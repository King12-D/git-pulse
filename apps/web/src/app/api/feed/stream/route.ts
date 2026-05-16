import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.login) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUsername = session.user.login;
  const { searchParams } = new URL(req.url);
  const since = searchParams.get('since');
  
  const lastCheckedTime = since ? new Date(since) : new Date(Date.now() - 5000);

  try {
    // fetch the current user's following list to filter the feed
    const currentUser = await prisma.user.findUnique({
      where: { username: currentUsername },
      select: {
        following: { select: { followingId: true } }
      }
    });
    const followingIds = currentUser?.following.map((f) => f.followingId) || [];

    const whereClause: any = {
      createdAt: { gt: lastCheckedTime }
    };

    // if the user follows anyone, filter to only those authors
    if (followingIds.length > 0) {
      whereClause.authorId = { in: followingIds };
    }

    const newPosts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: { select: { username: true, githubId: true } },
        reactions: true,
        repostOf: { include: { author: { select: { username: true, githubId: true } }, reactions: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    const posts = newPosts.map(post => {
      const isQuote = post.content !== `Reposted by @${post.author.username}`;
      
      let quotedPost = undefined;
      if (post.repostOf && isQuote) {
        quotedPost = {
          id: post.repostOf.id,
          type: post.repostOf.type,
          author: {
            username: post.repostOf.author.username,
            avatar: `https://avatars.githubusercontent.com/u/${post.repostOf.author.githubId}?v=4`
          },
          content: post.repostOf.content,
          timestamp: post.repostOf.createdAt.toISOString(),
          likes: post.repostOf.reactions.length,
          comments: 0,
          reactions: post.repostOf.reactions,
          images: post.repostOf.images,
          repoUrl: post.repostOf.repoUrl,
          repoEmbed: post.repostOf.repoEmbed,
          score: 0,
          passedBadge: false
        };
      }

      return {
        id: post.id,
        type: post.type,
        author: {
          username: post.author.username,
          avatar: `https://avatars.githubusercontent.com/u/${post.author.githubId}?v=4`
        },
        content: post.content,
        timestamp: post.createdAt.toISOString(),
        likes: post.reactions.length,
        comments: 0,
        reactions: post.reactions,
        images: post.images,
        repoUrl: post.repoUrl,
        repoEmbed: post.repoEmbed,
        score: 0,
        passedBadge: false,
        quotedPost,
        isRepost: post.repostOf && !isQuote ? true : undefined,
        repostedBy: post.repostOf && !isQuote ? post.author.username : undefined
      };
    });

    return NextResponse.json({ posts, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Feed poll error:", error);
    return NextResponse.json({ posts: [], timestamp: new Date().toISOString() });
  }
}
