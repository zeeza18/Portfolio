import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ZeezaPost.css';
import {
  addZeezaPost,
  deleteZeezaPost,
  loadZeezaPosts,
  subscribeToZeezaPosts,
  ZeezaPost as ZeezaPostType,
} from '../utils/zeezaPosts';

const ACCESS_PASSWORD = 'ZEEZASUCKS';
const DIGEST_STORAGE_KEY = 'zeezaPostDigest';
const SESSION_STORAGE_KEY = 'zeezaPostSession';
const MAX_MEDIA_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB limit
const MAX_MEDIA_SIZE_MB = 50;

const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const formatInputDate = (date: Date) => date.toISOString().split('T')[0];

const computeDigest = async (password: string, key: string) => {
  if (!password || !key) {
    throw new Error('Missing password or key for digest.');
  }
  if (!window.crypto?.subtle) {
    throw new Error('Secure digest API unavailable.');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}:${key}`);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const readDigest = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(DIGEST_STORAGE_KEY);
};

type ZeezaPostEntry = ZeezaPostType & { mediaUrl: string | null };

const ZeezaPost: React.FC = () => {
  const [storedDigest, setStoredDigest] = useState<string | null>(() => readDigest());
  const [secretKey, setSecretKey] = useState('');
  const [hexPreview, setHexPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const mediaUrlRef = useRef<string[]>([]);
  const [isUnlocked, setUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    const sessionDigest = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    const digest = readDigest();
    return Boolean(sessionDigest && digest && sessionDigest === digest);
  });

  const isConfigured = Boolean(storedDigest);

  useEffect(() => {
    let cancelled = false;
    if (!secretKey) {
      setHexPreview('');
      return () => {
        cancelled = true;
      };
    }

    const generatePreview = async () => {
      try {
        const digest = await computeDigest(ACCESS_PASSWORD, secretKey);
        if (!cancelled) {
          setHexPreview(digest);
        }
      } catch (digestError) {
        console.warn('Unable to compute digest preview.', digestError);
      }
    };

    generatePreview();

    return () => {
      cancelled = true;
    };
  }, [secretKey]);

  const resetFeedback = () => {
    setError('');
    setNotice('');
  };

  const handleSetup = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetFeedback();

      if (!secretKey) {
        setError('Enter the private key you want to use.');
        return;
      }

      try {
        setBusy(true);
        const digest = await computeDigest(ACCESS_PASSWORD, secretKey);
        window.localStorage.setItem(DIGEST_STORAGE_KEY, digest);
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, digest);
        setStoredDigest(digest);
        setUnlocked(true);
        setNotice('Secure gate configured and unlocked. Remember your key - only you have it.');
      } catch (setupError) {
        setError('Unable to configure access gate. Refresh and try again.');
      } finally {
        setBusy(false);
      }
    },
    [secretKey]
  );

  const handleUnlock = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetFeedback();

      if (!secretKey) {
        setError('Enter your secret key to unlock.');
        return;
      }

      try {
        setBusy(true);
        const digest = await computeDigest(ACCESS_PASSWORD, secretKey);
        if (digest !== storedDigest) {
          setError('Key mismatch. Access denied.');
          return;
        }
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, digest);
        setUnlocked(true);
        setNotice('Access granted. Welcome back.');
      } catch (unlockError) {
        setError('Unable to verify key. Refresh and try again.');
      } finally {
        setBusy(false);
      }
    },
    [secretKey, storedDigest]
  );

  const [postDate, setPostDate] = useState(() => formatInputDate(new Date()));
  const [caption, setCaption] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<ZeezaPostEntry[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const clearForm = () => {
    resetFeedback();
    setPostDate(formatInputDate(new Date()));
    setCaption('');
    setMediaFile(null);
    setPreviewUrl(null);
    setDragActive(false);
  };

  const handleFileSelection = (files: FileList | null) => {
    if (!files || !files.length) {
      return;
    }
    const file = files[0];
    setMediaFile(file);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleFileSelection(event.dataTransfer.files);
  };

  const submitPost = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetFeedback();

      if (!mediaFile) {
        setError('Attach an image or video before publishing.');
        return;
      }

      if (mediaFile.size > MAX_MEDIA_SIZE_BYTES) {
        setError(`Media is too large. Please keep uploads under ${MAX_MEDIA_SIZE_MB} MB.`);
        return;
      }

      try {
        setBusy(true);        const now = new Date();
        const scheduledDate = postDate ? new Date(postDate) : new Date();
        const validDate = Number.isNaN(scheduledDate.getTime()) ? new Date() : scheduledDate;
        const displayDate = formatDisplayDate(validDate);
        const captionText = caption.trim() || 'Untitled moment';
        const mediaKey = mediaFile ? `media-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}` : null;

        const post = {
          caption: captionText,
          date: displayDate,
          createdAt: now.toISOString(),
          mediaKey,
          mediaType: mediaFile.type,
          likes: 0,
          liked: false,
        };

        await addZeezaPost(post, mediaFile);
        clearForm();
        setNotice('Post published to Social.');
      } catch (publishError) {
        if (publishError instanceof DOMException && publishError.name === 'QuotaExceededError') {
          setError('Storage is full. Delete older posts or upload a smaller file.');
        } else {
          console.error('Unable to publish Zeeza post.', publishError);
          setError('Something went wrong while saving. Try again.');
        }
      } finally {
        setBusy(false);
      }
    },
    [mediaFile, caption, postDate]
  );

  useEffect(() => {
    if (!mediaFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(mediaFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [mediaFile]);

  useEffect(() => {
    if (isUnlocked) {
      setSecretKey('');
      setPostDate(formatInputDate(new Date()));
      setCaption('');
    }
  }, [isUnlocked]);

  const revokeObjectUrls = useCallback(() => {
    mediaUrlRef.current.forEach((url) => URL.revokeObjectURL(url));
    mediaUrlRef.current = [];
  }, []);

  const hydratePosts = useCallback(async () => {
    const metadata = await loadZeezaPosts();
    setPosts(metadata as ZeezaPostEntry[]);
  }, []);

  useEffect(() => {
    hydratePosts().catch((error) => {
      console.warn('Unable to load admin posts.', error);
    });
    const unsubscribe = subscribeToZeezaPosts(() => {
      hydratePosts().catch((error) => {
        console.warn('Unable to load admin posts.', error);
      });
    });
    return () => {
      unsubscribe();
      revokeObjectUrls();
    };
  }, [hydratePosts, revokeObjectUrls]);

  const handleDelete = async (id: string) => {
    try {
      await deleteZeezaPost(id);
      setOpenMenuId(null);
    } catch (deleteError) {
      console.error('Unable to delete post.', deleteError);
      setError('Unable to delete the post. Try again.');
    }
  };

  const dragHandlers = {
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    },
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    },
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    },
  };

  return (
    <main className="zeeza-admin">
      <section className="zeeza-card">
        <header className="zeeza-header">
          <h1>Zeeza Social Console</h1>
          <p>Private staging area for adding social posts. Guard your key.</p>
        </header>

        {!isUnlocked ? (
          <form className="zeeza-form" onSubmit={isConfigured ? handleUnlock : handleSetup}>
            <fieldset disabled={busy} className="zeeza-fieldset">
              <legend>{isConfigured ? 'Unlock feed' : 'Secure this console'}</legend>

              <label className="zeeza-label">
                Access Password
                <input
                  type="password"
                  value={ACCESS_PASSWORD}
                  readOnly
                  className="zeeza-input"
                />
              </label>

              <label className="zeeza-label">
                Secret Key
                <input
                  type="password"
                  value={secretKey}
                  onChange={(event) => setSecretKey(event.target.value)}
                  className="zeeza-input"
                  placeholder="Your private key"
                  autoFocus
                />
              </label>

              <div className="zeeza-hex-preview">
                <span>SHA-256 Hex</span>
                <code>{hexPreview || '--'}</code>
              </div>
            </fieldset>

            {error && <p className="zeeza-alert error">{error}</p>}
            {notice && <p className="zeeza-alert notice">{notice}</p>}

            <button type="submit" className="zeeza-primary" disabled={busy}>
              {isConfigured ? 'Unlock Console' : 'Generate & Lock'}
            </button>
          </form>
        ) : (
          <form className="zeeza-form" onSubmit={submitPost}>
            <fieldset disabled={busy} className="zeeza-fieldset">
              <legend>Publish social update</legend>

              <label className="zeeza-label">
                Date
                <input
                  type="date"
                  className="zeeza-input"
                  value={postDate}
                  max={formatInputDate(new Date())}
                  onChange={(event) => setPostDate(event.target.value)}
                />
              </label>

              <label className="zeeza-label">
                Caption
                <textarea
                  className="zeeza-textarea"
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  rows={4}
                  placeholder="Add a caption for this post"
                />
              </label>

              <div
                className={`zeeza-dropzone ${dragActive ? 'drag-active' : ''}`}
                onDrop={onDrop}
                {...dragHandlers}
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(event) => handleFileSelection(event.target.files)}
                />
                <p>Drag & drop an image or video, or click to browse.</p>
              </div>

              {previewUrl && (
                <div className="zeeza-preview">
                  {mediaFile?.type.startsWith('video/') ? (
                    <video src={previewUrl} controls playsInline />
                  ) : (
                    <img src={previewUrl} alt="Selected media" />
                  )}
                </div>
              )}
            </fieldset>

            {error && <p className="zeeza-alert error">{error}</p>}
            {notice && <p className="zeeza-alert notice">{notice}</p>}

            <div className="zeeza-actions">
              <button type="button" className="zeeza-secondary" onClick={clearForm} disabled={busy}>
                Clear
              </button>
              <button type="submit" className="zeeza-primary" disabled={busy}>
                Publish to Social
              </button>
            </div>
          </form>
        )}

        {isUnlocked && (
          <section className="zeeza-posts">
            <div className="zeeza-posts-header">
              <h2>Published Posts</h2>
              <span>{posts.length} {posts.length === 1 ? 'entry' : 'entries'}</span>
            </div>
            {posts.length === 0 ? (
              <p className="zeeza-posts-empty">No posts yet. Publish one above to see it listed here.</p>
            ) : (
              <ul className="zeeza-posts-list">
                {posts.map((post) => {
                  const isMenuOpen = openMenuId === post.id;
                  const isVideo =
                    typeof post.mediaType === 'string'
                      ? post.mediaType.startsWith('video/')
                      : Boolean(post.mediaUrl && post.mediaUrl.startsWith('data:video'));
                  return (
                    <li key={post.id} className="zeeza-posts-item">
                      <div className="zeeza-posts-media">
                        {post.mediaUrl ? (
                          isVideo ? (
                            <video src={post.mediaUrl} playsInline muted loop controls />
                          ) : (
                            <img src={post.mediaUrl} alt={post.caption} />
                          )
                        ) : (
                          <div className="zeeza-posts-placeholder">No media</div>
                        )}
                      </div>
                      <div className="zeeza-posts-body">
                        <div className="zeeza-posts-meta">
                          <time>{post.date}</time>
                          <div className="zeeza-posts-actions">
                            <button
                              type="button"
                              className="zeeza-posts-menu-button"
                              aria-haspopup="true"
                              aria-expanded={isMenuOpen}
                              onClick={() =>
                                setOpenMenuId((current) => (current === post.id ? null : post.id))
                              }
                            >
                              ⋮
                            </button>
                            {isMenuOpen && (
                              <div className="zeeza-posts-menu">
                                <button
                                  type="button"
                                  className="zeeza-posts-menu-item danger"
                                  onClick={() => handleDelete(post.id)}
                                >
                                  Delete post
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="zeeza-posts-caption">{post.caption}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </section>
    </main>
  );
};

export default ZeezaPost;















