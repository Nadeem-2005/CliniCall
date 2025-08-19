import { NextResponse } from "next/server";
import { cache } from "@/lib/redis";

export async function GET() {
  try {
    const stats = cache.getStats();
    
    return NextResponse.json({
      message: "Redis operation statistics",
      data: {
        totalOperations: stats.totalOperations,
        operationBreakdown: stats.operationBreakdown,
        timestamp: new Date().toISOString(),
        efficiency: {
          readOperations: stats.operationBreakdown.get,
          writeOperations: stats.operationBreakdown.set + stats.operationBreakdown.incr,
          deleteOperations: stats.operationBreakdown.del,
          otherOperations: stats.operationBreakdown.other + stats.operationBreakdown.pipeline
        }
      }
    });
  } catch (error) {
    console.error("Error getting Redis stats:", error);
    return NextResponse.json(
      { error: "Failed to get Redis statistics" },
      { status: 500 }
    );
  }
}