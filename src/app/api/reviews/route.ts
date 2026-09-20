import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.projectId || !body?.title || !body?.body || !body?.rating) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }
  const title = String(body.title).trim();
  const text = String(body.body).trim();
  if (title.length < 4 || text.length < 20) {
    return NextResponse.json({ error: "Write a bit more detail" }, { status: 400 });
  }
  const project = await prisma.project.findUnique({ where: { id: String(body.projectId) } });
  if (!project) return NextResponse.json({ error: "Unknown project" }, { status: 404 });

  const review = await prisma.review.create({
    data: {
      projectId: project.id,
      rating,
      title,
      body: text,
      author: String(body.author || "Anonymous homebuyer").slice(0, 80),
    },
  });
  return NextResponse.json({ id: review.id });
}
