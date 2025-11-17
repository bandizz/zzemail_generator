import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const char = searchParams.get("char");

  if (!char) {
    return NextResponse.json(
      { error: "Missing 'char' query parameter" },
      { status: 400 }
    );
  }

  try {
    const upstreamUrl = `https://www.emoji.family/api/emojis/${encodeURIComponent(
      char
    )}/fluent/png/256`;

    const response = await fetch(upstreamUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch emoji PNG" },
        { status: 502 }
      );
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return NextResponse.json({ base64 });
  } catch (error) {
    console.error("Error fetching emoji PNG:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
