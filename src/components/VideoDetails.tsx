'use client';

import Image from 'next/image';

interface Video {
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

interface VideoDetailsProps {
  video: Video;
}

const VideoDetails = ({ video }: VideoDetailsProps) => {
  return (
    <div className="bg-white py-4 px-12 rounded shadow mb-6">
      <Image
        src={video.snippet.thumbnails.medium.url}
        alt="Thumbnail"
        width={320}
        height={180}
        className="mx-auto mb-4 rounded"
      />
      <h2 className="text-2xl font-semibold mt-2 text-black mx-auto">{video.snippet.title}</h2>
      <p className="text-gray-800 text-lg mt-1">{video.snippet.description}</p>
      <div className="mt-2 text-base text-gray-700">
        Views: {video.statistics.viewCount} | Likes: {video.statistics.likeCount}
      </div>
    </div>
  );
};

export default VideoDetails;
