"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Reply {
  id: string;
  snippet: {
    textDisplay: string;
    authorDisplayName: string;
    authorChannelId: {
      value: string;
    };
  };
}

interface Comment {
  id: string;
  snippet: {
    topLevelComment: {
      id: string;
      snippet: {
        textDisplay: string;
        authorDisplayName: string;
        authorChannelId: {
          value: string;
        };
      };
    };
    totalReplyCount: number;
  };
  replies?: {
    comments: Reply[];
  };
}

interface CommentsProps {
  videoId: string;
}

export default function Comments({ videoId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [userChannelId, setUserChannelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannelId = async () => {
      if (!session?.accessToken) return;
      try {
        const res = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
          params: { part: "id", mine: true },
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        const channelId = res.data.items[0]?.id;
        setUserChannelId(channelId);
      } catch (err) {
        console.error("Failed to fetch user channel ID:", err);
      }
    };
    fetchChannelId();
  }, [session]);

  const fetchComments = async () => {
    if (!session?.accessToken) return;
    try {
      const res = await axios.get("https://www.googleapis.com/youtube/v3/commentThreads", {
        params: {
          part: "snippet,replies",
          videoId,
          key: process.env.YOUTUBE_API_KEY!,
          access_token: session.accessToken,
          maxResults: 100,
        },
      });
      setComments(res.data.items);
    } catch (err) {
      setError("Failed to fetch comments.");
    }
  };

  const addComment = async () => {
    if (!session?.accessToken || !newComment.trim()) return;
    try {
      const res = await axios.post(
        "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet",
        {
          snippet: {
            videoId,
            topLevelComment: {
              snippet: {
                textOriginal: newComment,
              },
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newItem = res.data;
      setComments((prev) => [newItem, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      setError("Failed to add comment.");
    }
  };

  const handleReply = async (parentId: string) => {
    const replyText = prompt("Enter your reply:");
    if (!replyText || !session?.accessToken) return;

    try {
      const res = await axios.post(
        "https://www.googleapis.com/youtube/v3/comments?part=snippet",
        {
          snippet: {
            parentId,
            textOriginal: replyText,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newReply = res.data;
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId || comment.snippet.topLevelComment.id === parentId
            ? {
                ...comment,
                replies: {
                  comments: [...(comment.replies?.comments || []), newReply],
                },
              }
            : comment
        )
      );
    } catch (err) {
      console.error("Failed to add reply:", err);
      setError("Failed to add reply.");
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    if (!session?.accessToken) return;

    try {
      await axios.delete(`https://www.googleapis.com/youtube/v3/comments?id=${commentId}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      setComments((prev) =>
        prev.filter(
          (c) =>
            c.snippet.topLevelComment.id !== commentId &&
            c.id !== commentId &&
            !(c.replies?.comments.some((r) => r.id === commentId))
        )
      );
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setError("Failed to delete comment.");
    }
  };

  useEffect(() => {
    if (videoId) fetchComments();
  }, [videoId]);

  return (
    <div className="comments-section text-white space-y-6">
      <h2 className="text-xl font-bold mb-2">Comments</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="add-comment mb-4">
        <textarea
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button
          onClick={addComment}
          className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Add Comment
        </button>
      </div>

      <div className="comment-list space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => {
            const top = comment.snippet.topLevelComment;
            const isUserComment = top.snippet.authorChannelId?.value === userChannelId;

            return (
              <div key={top.id} className="bg-gray-900 p-4 rounded">
                <p className="font-semibold">{top.snippet.authorDisplayName}</p>
                <p className="text-gray-200">{top.snippet.textDisplay}</p>

                <div className="mt-2 flex gap-3">
                  <button
                    className="text-sm text-blue-400 hover:underline"
                    onClick={() => handleReply(top.id)}
                  >
                    Reply
                  </button>
                  {isUserComment && (
                    <button
                      className="text-sm text-red-400 hover:underline"
                      onClick={() => handleDelete(top.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>

                {comment.replies?.comments?.length > 0 && (
                  <div className="ml-6 mt-3 space-y-2">
                    {comment.replies.comments.map((reply) => {
                      const isUserReply = reply.snippet.authorChannelId?.value === userChannelId;
                      return (
                        <div key={reply.id} className="bg-gray-800 p-3 rounded">
                          <p className="font-medium">{reply.snippet.authorDisplayName}</p>
                          <p className="text-gray-300">{reply.snippet.textDisplay}</p>
                          {isUserReply && (
                            <button
                              className="text-xs text-red-400 hover:underline mt-1"
                              onClick={() => handleDelete(reply.id)}
                            >
                              Delete Reply
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
