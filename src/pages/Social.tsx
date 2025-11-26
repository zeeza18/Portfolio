import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Social.css';
import {
  loadZeezaPosts,
  subscribeToZeezaPosts,
  incrementLikes,
  ZeezaPost as ZeezaPostType,
} from '../utils/zeezaPosts';

type SocialPost = ZeezaPostType & { mediaUrl: string | null };

const LIKED_POSTS_KEY = 'zeeza_liked_posts';

const getLikedPosts = (): Set<string> => {
  try {
    const stored = localStorage.getItem(LIKED_POSTS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveLikedPosts = (likedPosts: Set<string>) => {
  try {
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(Array.from(likedPosts)));
  } catch (error) {
    console.warn('Unable to save liked posts to localStorage', error);
  }
};

const Social: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [activeHeartId, setActiveHeartId] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Record<string, boolean>>({});
  const heartTimeout = useRef<number | null>(null);
  const mediaUrlRef = useRef<string[]>([]);

  const revokeObjectUrls = useCallback(() => {
    mediaUrlRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    mediaUrlRef.current = [];
  }, []);

  const hydratePosts = useCallback(async () => {
    const metadata = await loadZeezaPosts();
    const deviceLikedPosts = getLikedPosts();
    const postsWithDeviceLikes = metadata.map((post) => ({
      ...post,
      liked: deviceLikedPosts.has(post.id),
    }));
    setPosts(postsWithDeviceLikes as SocialPost[]);
    setInitialized(true);
  }, []);

  useEffect(() => {
    hydratePosts().catch((error) => {
      console.warn('Unable to load social posts.', error);
    });
    const unsubscribe = subscribeToZeezaPosts(() => {
      hydratePosts().catch((error) => {
        console.warn('Unable to load social posts.', error);
      });
    });

    return () => {
      unsubscribe();
      revokeObjectUrls();
    };
  }, [hydratePosts, revokeObjectUrls]);

  useEffect(
    () => () => {
      if (heartTimeout.current) {
        window.clearTimeout(heartTimeout.current);
      }
    },
    []
  );

  const toggleMute = (id: string) => {
    setMutedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLike = (id: string, forceLiked?: boolean) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;
        const nextLiked = typeof forceLiked === 'boolean' ? forceLiked : !post.liked;
        const delta = nextLiked === post.liked ? 0 : nextLiked ? 1 : -1;

        if (delta !== 0) {
          // Update localStorage
          const deviceLikedPosts = getLikedPosts();
          if (nextLiked) {
            deviceLikedPosts.add(id);
          } else {
            deviceLikedPosts.delete(id);
          }
          saveLikedPosts(deviceLikedPosts);

          // Atomically increment/decrement likes count in database
          incrementLikes(id, delta);
        }

        const likes = Math.max(0, post.likes + delta);
        return { ...post, liked: nextLiked, likes };
      })
    );
  };

  const handleMediaDoubleClick = (id: string) => {
    toggleLike(id, true);
    setActiveHeartId(id);
    if (heartTimeout.current) {
      window.clearTimeout(heartTimeout.current);
    }
    heartTimeout.current = window.setTimeout(() => {
      setActiveHeartId((current) => (current === id ? null : current));
    }, 700);
  };

  const hasPosts = posts.length > 0;

  const captionFallback = useMemo(() => `${new Date().toLocaleDateString()} - Nothing posted yet.`, []);

  const renderMedia = (post: SocialPost) => {
    if (!post.mediaUrl) {
      return (
        <div className="social-media-frame placeholder">
          <span>Add your photo</span>
        </div>
      );
    }

    const derivedType =
      post.mediaType ??
      (post.mediaUrl && post.mediaUrl.startsWith('data:video') ? 'video/legacy' : '');
    const isVideo = derivedType.startsWith('video/');

    return (
      <div
        className="social-media-frame"
        role="button"
        tabIndex={0}
        onDoubleClick={(event) => {
          event.preventDefault();
          handleMediaDoubleClick(post.id);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleMediaDoubleClick(post.id);
          }
        }}
        aria-label="Double tap to like this post"
      >
        {isVideo ? (
          <>
            <video
              className="social-media media-video"
              src={post.mediaUrl}
              autoPlay
              muted={mutedVideos[post.id] !== false}
              loop
              playsInline
              preload="auto"
            />
            <button
              type="button"
              className="video-mute-button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute(post.id);
              }}
              aria-label={mutedVideos[post.id] !== false ? 'Unmute video' : 'Mute video'}
            >
              {mutedVideos[post.id] !== false ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </>
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="social-media"
            draggable={false}
          />
        )}
        {activeHeartId === post.id && (
          <span className="social-like-burst" aria-hidden="true">
            &#9829;
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="social-container">
      <header className="social-hero">
        <div className="social-hero-copy">
          <h2 className="social-title">Life Feed</h2>
          <p className="social-subtitle">
            Snapshots of what I create, where I wander, and how I spend the quiet hours. A clean look at my life in motion.
          </p>
        </div>
      </header>

      {!initialized ? (
        <div className="social-empty">
          <h3>Loading feed</h3>
          <p>Fetching your latest highlights...</p>
        </div>
      ) : !hasPosts ? (
        <div className="social-empty">
          <h3>No posts yet</h3>
          <p>Nothing live at the moment. I&apos;ll share highlights here as they happen.</p>
        </div>
      ) : (
        <div className="social-grid">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="social-card"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {renderMedia(post)}
              <div className="social-card-body">
                <div className="social-meta">
                  <time className="social-date">{post.date}</time>
                </div>
                <p className="social-caption">{post.caption || captionFallback}</p>
                <button
                  type="button"
                  className={`social-like-button ${post.liked ? 'liked' : ''}`}
                  onClick={() => toggleLike(post.id)}
                  aria-pressed={post.liked}
                >
                  <span className="social-like-icon" aria-hidden="true">
                    &#9829;
                  </span>
                  <span className="social-like-count">{post.likes}</span>
                  <span className="sr-only">{post.liked ? 'Unlike' : 'Like'} post shared on {post.date}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <footer className="social-footer">
        <p>
          Private updates are managed through the internal console.
        </p>
      </footer>
    </section>
  );
};

export default Social;


