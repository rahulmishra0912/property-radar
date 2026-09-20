import { NextResponse } from "next/server";
import { searchAll } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const { projects, developers } = await searchAll(q, 8);
  return NextResponse.json({
    projects: projects.map((p) => ({
      slug: p.slug,
      name: p.name,
      locality: p.locality,
      reraId: p.reraId,
      delayMonths: p.delayMonths,
      developer: { name: p.developer.name },
    })),
    developers: developers.map((d) => ({ slug: d.slug, name: d.name })),
  });
}
