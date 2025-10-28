import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Social.css';
import {
  loadZeezaPosts,
  loadZeezaPostMedia,
  migrateLegacyMedia,
  subscribeToZeezaPosts,
  updateZeezaPost,
  ZeezaPost as ZeezaPostType,
} from '../utils/zeezaPosts';

type SocialPost = ZeezaPostType & { mediaUrl: string | null };

const Social: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [activeHeartId, setActiveHeartId] = useState<string | null>(null);
  const heartTimeout = useRef<number | null>(null);
  const mediaUrlRef = useRef<string[]>([]);

  const revokeObjectUrls = useCallback(() => {
    mediaUrlRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    mediaUrlRef.current = [];
  }, []);

  const hydratePosts = useCallback(async () => {
    const metadata = loadZeezaPosts();
    const createdUrls: string[] = [];
    const enriched = await Promise.all(
      metadata.map(async (post) => {
        if (!post.mediaKey) {
          if (post.mediaUrl) {
            try {
              const migrated = await migrateLegacyMedia(post);
              if (migrated) {
                const objectUrl = URL.createObjectURL(migrated.blob);
                createdUrls.push(objectUrl);
                return {
                  ...post,
                  mediaKey: migrated.mediaKey,
                  mediaType: migrated.mediaType,
                  mediaUrl: objectUrl,
                };
              }
            } catch (migrationError) {
              console.warn('Unable to migrate legacy media.', migrationError);
              return { ...post, mediaUrl: post.mediaUrl };
            }
            return { ...post, mediaUrl: post.mediaUrl };
          }
          return { ...post, mediaUrl: null };
        }
        try {
          const blob = await loadZeezaPostMedia(post.mediaKey);
          if (!blob) {
            return { ...post, mediaUrl: null };
          }
          const objectUrl = URL.createObjectURL(blob);
          createdUrls.push(objectUrl);
          return { ...post, mediaUrl: objectUrl, mediaType: post.mediaType ?? blob.type };
        } catch (error) {
          console.warn('Unable to load post media.', error);
          return { ...post, mediaUrl: null };
        }
      })
    );
    revokeObjectUrls();
    mediaUrlRef.current = createdUrls;
    setPosts(enriched);
    setInitialized(true);
  }, [revokeObjectUrls]);

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

  const toggleLike = (id: string, forceLiked?: boolean) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;
        const nextLiked = typeof forceLiked === 'boolean' ? forceLiked : !post.liked;
        const delta = nextLiked === post.liked ? 0 : nextLiked ? 1 : -1;
        const likes = Math.max(0, post.likes + delta);
        updateZeezaPost(id, { liked: nextLiked, likes });
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
          <video
            className="social-media media-video"
            src={post.mediaUrl}
            controls
            playsInline
            preload="metadata"
          />
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


