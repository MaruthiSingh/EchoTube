"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Video {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
  };
}

interface VideoFormProps {
  video: Video;
  onVideoUpdate: (updatedVideo: Video) => void;
  onClose: () => void;
}

const VideoForm = ({ video, onVideoUpdate, onClose }: VideoFormProps) => {
  const { data: session } = useSession();
  const [updatedTitle, setUpdatedTitle] = useState(video.snippet.title);
  const [updatedDescription, setUpdatedDescription] = useState(
    video.snippet.description
  );
  const [error, setError] = useState("");

  console.log("Sending token:", session?.accessToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        "/api/video",
        {
          videoId: video.id,
          title: updatedTitle,
          description: updatedDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (res.status === 200) {
        const updatedVideo = {
          ...video,
          snippet: {
            ...video.snippet,
            title: updatedTitle,
            description: updatedDescription,
          },
        };
        onVideoUpdate(updatedVideo);
        setError("");
        onClose();
      }
    } catch (err: any) {
      console.error("Error updating video:", err);
      setError(
        err.response?.data?.error || "Failed to update video. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="relative bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-lg transition-transform animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6">Edit Video Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoForm;
