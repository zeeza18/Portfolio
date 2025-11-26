const isBrowser = typeof window !== 'undefined';

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export const saveMediaBlob = async (key: string, blob: Blob): Promise<string> => {
  if (!isBrowser) throw new Error('Not in browser environment');

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration missing');
  }

  const formData = new FormData();
  formData.append('file', blob);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('public_id', key);
  formData.append('folder', 'zeeza-media');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const loadMediaBlob = async (key: string): Promise<Blob | null> => {
  return null;
};

export const deleteMediaBlob = async (key: string): Promise<void> => {
  console.warn('Cloudinary deletion not implemented. Manually delete from Cloudinary dashboard if needed.');
};

