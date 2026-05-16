import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username = session.user.login;

  try {
    const unreadCount = await prisma.notification.count({
      where: {
        user: {
          username: {
            equals: username,
          },
        },
        read: {
          equals: false,
        },
      },
    });

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("[Notifications Poll] Error:", error);
    return NextResponse.json({ unreadCount: 0 });
  }
}