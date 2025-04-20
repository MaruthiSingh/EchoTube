// src/app/api/comments/[commentId]/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

export async function DELETE(req: Request) {
  const { commentId } = req.url;

  try {
    // YouTube API to delete a comment (dummy code for this example)
    await axios.delete(`https://www.googleapis.com/youtube/v3/comments/${commentId}`, {
      params: {
        key: YOUTUBE_API_KEY,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete comment.' }, { status: 500 });
  }
}
