import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing YouTube API Key setup in .env.local" }, { status: 500 });
  }

  try {
    // We add "topic" or categorize it to try and get standard audio
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
        q + " audio"
      )}&type=video&videoCategoryId=10&key=${apiKey}`
    );
    const data = await res.json();

    if (data.error) {
       console.error("YouTube API responded with error:", data.error);
       const errorMsg = typeof data.error === 'string' ? data.error : (data.error.message || "YouTube API error");
       return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "No results found on YouTube." }, { status: 404 });
    }

    const item = data.items[0];
    
    // Clean up HTML entities in titles like &amp; or &#39;
    let cleanTitle = item.snippet.title;
    cleanTitle = cleanTitle.replace(/&quot;/g, '"');
    cleanTitle = cleanTitle.replace(/&#39;/g, "'");
    cleanTitle = cleanTitle.replace(/&amp;/g, "&");

    return NextResponse.json({
      videoId: item.id.videoId,
      title: cleanTitle,
      artist: item.snippet.channelTitle.replace(" - Topic", ""),
    });
  } catch (error) {
    console.error("YouTube Search Request failed:", error);
    return NextResponse.json({ error: "Failed to fetch music" }, { status: 500 });
  }
}
