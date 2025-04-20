// src/app/api/video/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function PUT(req: NextRequest) {
  // Get the session for the current user
  const session = await getServerSession(authOptions);

  // Check if the session exists and if it contains a valid access token
  if (!session || !session.accessToken) {
    console.error("No access token in session:", session);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the request body to get videoId, title, and description
    const body = await req.json();
    console.log("Received request body:", body);

    const { videoId, title, description } = body;

    // Validate the required fields (videoId, title, and description)
    if (!videoId || !title || !description) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Send a PUT request to the YouTube API to update the video details
    const response = await axios.put(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet`,
      {
        id: videoId, // Use videoId from the body
        snippet: {
          title,
          description,
          categoryId: "22", // Example categoryId, can be adjusted as needed
        },
      },
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the response data from YouTube API
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error and return an error message
    console.error("YouTube API Error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}
