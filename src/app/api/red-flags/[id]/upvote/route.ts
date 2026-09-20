import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const flag = await prisma.redFlag.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });
    return NextResponse.json({ upvotes: flag.upvotes });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
