import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/posts/[id]
 * Delete a post (only by the author or admin)
 */
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const session = await auth();

  if (!session?.user?.login) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    // Find the post
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is the author or admin
    const user = await prisma.user.findUnique({
      where: { username: session.user.login },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAuthor = post.authorId === user.id;
    const isAdmin = user.isAdmin;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own posts" },
        { status: 403 }
      );
    }

    // Delete the post (cascade will handle comments, reactions, etc.)
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("[DeletePost] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/posts/[id]
 * Get a single post by ID
 */
export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    const { id } = params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            name: true,
            avatar: true,
            statusEmoji: true,
            statusText: true,
          },
        },
        reactions: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
            reposts: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get current user's reactions
    const session = await auth();
    let userReactions: string[] = [];

    if (session?.user?.login) {
      const user = await prisma.user.findUnique({
        where: { username: session.user.login },
      });

      if (user) {
        userReactions = post.reactions
          .filter((r) => r.userId === user.id)
          .map((r) => r.emoji);
      }
    }

    // Aggregate reactions
    const reactionCounts = post.reactions.reduce((acc, r) => {
      acc[r.emoji] = (acc[r.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const formattedReactions = Object.entries(reactionCounts).map(
      ([emoji, count]) => ({
        emoji,
        count,
        hasReacted: userReactions.includes(emoji),
      })
    );

    return NextResponse.json({
      ...post,
      reactions: formattedReactions,
    });
  } catch (error) {
    console.error("[GetPost] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
