import { deleteMediaBlob, loadMediaBlob, saveMediaBlob } from './zeezaMedia';
import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  increment,
} from 'firebase/firestore';

export type ZeezaPost = {
  id: string;
  caption: string;
  date: string;
  createdAt: string;
  mediaKey?: string | null;
  mediaType?: string | null;
  mediaUrl?: string | null;
  likes: number;
  liked?: boolean;
};

const POSTS_COLLECTION = 'zeezaPosts';
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

const dispatchPostsUpdated = () => {
  if (!isBrowser) return;
  window.dispatchEvent(new Event(POSTS_UPDATED_EVENT));
};

export const loadZeezaPosts = async (): Promise<ZeezaPost[]> => {
  if (!isBrowser) return [];
  try {
    const postsQuery = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(postsQuery);
    const posts: ZeezaPost[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      posts.push({
        id: docSnapshot.id,
        caption: data.caption || '',
        date: data.date || '',
        createdAt: data.createdAt || new Date().toISOString(),
        mediaKey: data.mediaKey || null,
        mediaType: data.mediaType || null,
        mediaUrl: data.mediaUrl || null,
        likes: typeof data.likes === 'number' ? data.likes : 0,
        liked: Boolean(data.liked),
      });
    });
    return posts;
  } catch (error) {
    console.warn('Unable to load Zeeza posts from Firestore.', error);
    return [];
  }
};

export const addZeezaPost = async (post: Omit<ZeezaPost, 'id'>, media?: Blob) => {
  try {
    let mediaUrl = null;
    if (media && post.mediaKey) {
      mediaUrl = await saveMediaBlob(post.mediaKey, media);
    }

    const postData = {
      caption: post.caption,
      date: post.date,
      createdAt: post.createdAt,
      mediaKey: post.mediaKey || null,
      mediaType: post.mediaType || null,
      mediaUrl: mediaUrl,
      likes: post.likes || 0,
      liked: post.liked || false,
    };

    await addDoc(collection(db, POSTS_COLLECTION), postData);
    dispatchPostsUpdated();
  } catch (error) {
    console.error('Unable to add post to Firestore:', error);
    throw error;
  }
};

export const updateZeezaPost = async (id: string, updates: PostUpdate) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(postRef, updates);
    dispatchPostsUpdated();
  } catch (error) {
    console.error('Unable to update post in Firestore:', error);
    throw error;
  }
};

export const incrementLikes = async (id: string, delta: number) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(postRef, {
      likes: increment(delta),
    });
    dispatchPostsUpdated();
  } catch (error) {
    console.error('Unable to increment likes in Firestore:', error);
    throw error;
  }
};

export const deleteZeezaPost = async (id: string) => {
  try {
    const posts = await loadZeezaPosts();
    const target = posts.find((post) => post.id === id);

    if (target?.mediaKey) {
      await deleteMediaBlob(target.mediaKey);
    }

    const postRef = doc(db, POSTS_COLLECTION, id);
    await deleteDoc(postRef);
    dispatchPostsUpdated();
  } catch (error) {
    console.error('Unable to delete post from Firestore:', error);
    throw error;
  }
};

export const loadZeezaPostMedia = (mediaKey: string) => loadMediaBlob(mediaKey);

export const migrateLegacyMedia = async (post: ZeezaPost) => {
  if (!isBrowser) return null;
  if (post.mediaKey || !post.mediaUrl) return null;
  try {
    const blob = dataUrlToBlob(post.mediaUrl);
    const mediaKey = `media-${post.id}`;
    const mediaUrl = await saveMediaBlob(mediaKey, blob);
    await updateZeezaPost(post.id, {
      mediaKey,
      mediaType: blob.type,
      mediaUrl: mediaUrl,
    });
    return { blob, mediaKey, mediaType: blob.type };
  } catch (error) {
    console.warn('Unable to migrate legacy media.', error);
    return null;
  }
};

export const subscribeToZeezaPosts = (callback: () => void) => {
  if (!isBrowser) return () => undefined;

  const postsQuery = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
  const unsubscribeSnapshot = onSnapshot(postsQuery, () => {
    callback();
  });

  const handler = () => callback();
  window.addEventListener(POSTS_UPDATED_EVENT, handler);

  return () => {
    unsubscribeSnapshot();
    window.removeEventListener(POSTS_UPDATED_EVENT, handler);
  };
};
