import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Health check endpoint for monitoring
 * Returns 200 if app is healthy, 503 if not
 */
export async function GET() {
    try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            version: process.env.npm_package_version || "0.1.0",
        }, { status: 200 });
    } catch (error) {
        console.error("[Health Check] Failed:", error);
        
        return NextResponse.json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 503 });
    }
}
