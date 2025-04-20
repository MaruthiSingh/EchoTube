import { NextResponse } from 'next/server';
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

export async function GET(req: Request) {
  const { videoId } = req.url;

  try {
    // Fetch comments from YouTube API
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
      params: {
        part: 'snippet',
        videoId,
        key: YOUTUBE_API_KEY,
      },
    });

    const comments = response.data.items.map((item: any) => ({
      id: item.id,
      snippet: {
        textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
        authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
      },
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { videoId, text } = await req.json();

  try {
    // Code to add a comment via the YouTube API
    // For simplicity, this is not a complete implementation
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment.' }, { status: 500 });
  }
}
