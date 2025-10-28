import { deleteMediaBlob, loadMediaBlob, saveMediaBlob } from './zeezaMedia';

export type ZeezaPost = {
  id: string;
  caption: string;
  date: string;
  createdAt: string;
  mediaKey?: string | null;
  mediaType?: string | null;
  likes: number;
  mediaUrl?: string | null;
  liked?: boolean;
};

const STORAGE_KEY = 'zeezaPosts';
const POSTS_UPDATED_EVENT = 'zeeza-posts-updated';

type PostUpdate = Partial<Omit<ZeezaPost, 'id' | 'createdAt'>> & {
  likes?: number;
  liked?: boolean;
};

const isBrowser = typeof window !== 'undefined';

const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, base64Data] = dataUrl.split(',');
  if (!base64Data) {
    throw new Error('Invalid data URL');
  }
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mime = mimeMatch?.[1] ?? 'application/octet-stream';
  const binary = window.atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
};

const sortPosts = (posts: ZeezaPost[]) =>
  [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

export const loadZeezaPosts = (): ZeezaPost[] => {
  if (!isBrowser) return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as ZeezaPost[] | undefined;
    if (!Array.isArray(parsed)) return [];
    return sortPosts(
      parsed
        .filter((entry): entry is ZeezaPost => Boolean(entry && entry.id && entry.createdAt))
        .map((entry) => ({
          ...entry,
          likes: typeof entry.likes === 'number' ? entry.likes : 0,
          liked: Boolean(entry.liked),
        }))
    );
  } catch (error) {
    console.warn('Unable to load Zeeza posts from storage.', error);
    return [];
  }
};

const dispatchPostsUpdated = () => {
  if (!isBrowser) return;
  window.dispatchEvent(new Event(POSTS_UPDATED_EVENT));
};

export const saveZeezaPosts = (posts: ZeezaPost[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortPosts(posts)));
  dispatchPostsUpdated();
};

export const addZeezaPost = async (post: ZeezaPost, media?: Blob) => {
  const posts = loadZeezaPosts();
  const nextPosts = sortPosts([post, ...posts]);
  if (media && post.mediaKey) {
    await saveMediaBlob(post.mediaKey, media);
  }
  saveZeezaPosts(nextPosts);
};

export const updateZeezaPost = (id: string, updates: PostUpdate) => {
  const posts = loadZeezaPosts();
  const next = posts.map((post) =>
    post.id === id ? { ...post, ...updates } : post
  );
  saveZeezaPosts(next);
};

export const deleteZeezaPost = async (id: string) => {
  const posts = loadZeezaPosts();
  const target = posts.find((post) => post.id === id);
  const next = posts.filter((post) => post.id !== id);
  if (target?.mediaKey) {
    await deleteMediaBlob(target.mediaKey);
  }
  saveZeezaPosts(next);
};

export const loadZeezaPostMedia = (mediaKey: string) => loadMediaBlob(mediaKey);

export const migrateLegacyMedia = async (post: ZeezaPost) => {
  if (!isBrowser) return null;
  if (post.mediaKey || !post.mediaUrl) return null;
  try {
    const blob = dataUrlToBlob(post.mediaUrl);
    const mediaKey = `media-${post.id}`;
    await saveMediaBlob(mediaKey, blob);
    updateZeezaPost(post.id, {
      mediaKey,
      mediaType: blob.type,
      mediaUrl: null,
    });
    return { blob, mediaKey, mediaType: blob.type };
  } catch (error) {
    console.warn('Unable to migrate legacy media.', error);
    return null;
  }
};

export const subscribeToZeezaPosts = (callback: () => void) => {
  if (!isBrowser) return () => undefined;

  const handler = () => callback();
  window.addEventListener(POSTS_UPDATED_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(POSTS_UPDATED_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
};
