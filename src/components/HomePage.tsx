// src/app/HomePage.tsx
'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import axios from 'axios';
import AuthButtons from './AuthButtons';
import VideoForm from './VideoForm';
import Comments from './Comments';

const API_KEY = process.env.YOUTUBE_API_KEY!;

export default function HomePage() {
  const [videoId, setVideoId] = useState('');
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null); // ref for scrolling

  const fetchVideo = async () => {
    if (!videoId) return;

    try {
      const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: 'snippet,statistics',
          id: videoId,
          key: API_KEY,
        },
      });

      if (res.data.items.length === 0) {
        setError('No video found with this ID.');
        setVideo(null);
        return;
      }

      setVideo(res.data.items[0]);
      setError('');

      // Scroll to the details section after successful fetch
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError('Failed to fetch video. Check API key or video ID.');
      setVideo(null);
    }
  };

  const handleVideoUpdate = (updatedVideo: Video) => {
    setVideo(updatedVideo);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-12 pb-20 bg-black">
      <Image
        src="/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="mb-6 rounded-2xl"
      />
      <h1 className="text-3xl font-bold mb-6 text-center">EchoTube - YouTube Companion Dashboard</h1>

      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter YouTube Video ID"
          className="border border-gray-300 p-2 w-full rounded mb-2"
        />
        <button
          onClick={fetchVideo}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch Video
        </button>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        {/* AuthButtons always at bottom */}
      </div>
      <div className="flex justify-center">
        <AuthButtons />
      </div>

      {/* Details section anchor for scroll */}
      <div ref={detailsRef} className="w-full mt-8">
        {/* Show Video Details */}
        {video && (
          <>
            <div className="bg-white py-6 px-8 rounded shadow-md mb-6 max-w-3xl mx-auto">
              <Image
                src={video.snippet.thumbnails.medium.url}
                alt="Thumbnail"
                width={320}
                height={180}
                className="mx-auto mb-4 rounded"
              />
              <h2 className="text-2xl font-semibold text-black text-center">{video.snippet.title}</h2>
              <p className="text-gray-800 text-lg mt-2 text-center">{video.snippet.description}</p>
              <div className="mt-3 text-base text-center text-gray-700">
                Views: {video.statistics.viewCount} | Likes: {video.statistics.likeCount}
              </div>
            </div>

            {/* Edit Button */}
            <div className="text-center mb-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Video Details
              </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <VideoForm
                video={video}
                onVideoUpdate={handleVideoUpdate}
                onClose={() => setIsModalOpen(false)}
              />
            )}

            {/* Comments Section */}
            <div className="max-w-3xl mx-auto">
              <Comments videoId={videoId} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
