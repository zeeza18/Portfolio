export type ZeezaPost = {
  id: string;
  caption: string;
  date: string;
  createdAt: string;
  mediaUrl: string;
  likes: number;
  liked?: boolean;
};

const STORAGE_KEY = 'zeezaPosts';
const POSTS_UPDATED_EVENT = 'zeeza-posts-updated';

type PostUpdate = Partial<Omit<ZeezaPost, 'id' | 'createdAt'>> & {
  likes?: number;
  liked?: boolean;
};

const isBrowser = typeof window !== 'undefined';

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

export const addZeezaPost = (post: ZeezaPost) => {
  const posts = loadZeezaPosts();
  saveZeezaPosts(sortPosts([post, ...posts]));
};

export const updateZeezaPost = (id: string, updates: PostUpdate) => {
  const posts = loadZeezaPosts();
  const next = posts.map((post) =>
    post.id === id ? { ...post, ...updates } : post
  );
  saveZeezaPosts(next);
};

export const deleteZeezaPost = (id: string) => {
  const posts = loadZeezaPosts();
  saveZeezaPosts(posts.filter((post) => post.id !== id));
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

