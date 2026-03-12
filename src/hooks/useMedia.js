import { useState, useEffect } from 'react';
import { ref as dbRef, get, push, set, update, remove } from 'firebase/database';
import { db } from '../firebase/config';
import { getCached, setCache } from '../lib/cache';
import { uploadToCloudinary } from '../lib/cloudinaryUpload';

export function useMedia(type) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const colName = type === 'image' ? 'images' : 'videos';
  const cacheKey = colName;

  const fetchItems = async () => {
    const cached = getCached(cacheKey);
    if (cached) {
      setItems(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const snap = await get(dbRef(db, colName));
      let next = [];
      if (snap.exists()) {
        const val = snap.val(); // { id: itemData }
        next = Object.entries(val).map(([id, data]) => ({ id, ...data }));
        next.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }
      setItems(next);
      setCache(cacheKey, next);
    } catch (err) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

  const uploadMedia = async (file, caption = '', onProgress) => {
    const uploadCol = file.type.startsWith('image') ? 'images' : 'videos';
    onProgress?.(10);
    const upload = await uploadToCloudinary(file);
    onProgress?.(100);
    const listRef = dbRef(db, uploadCol);
    const newRef = push(listRef);
    await set(newRef, {
      url: upload.url,
      caption,
      name: file.name,
      storagePath: upload.publicId || null,
      createdAt: Date.now(),
    });
    fetchItems();
    return { id: newRef.key, url: upload.url, caption };
  };

  const deleteMedia = async (item, collectionName) => {
    await remove(dbRef(db, `${collectionName}/${item.id}`));
    fetchItems();
  };

  const updateCaption = async (id, collectionName, caption) => {
    await update(dbRef(db, `${collectionName}/${id}`), { caption });
    fetchItems();
  };

  return { items, loading, refetch: fetchItems, uploadMedia, deleteMedia, updateCaption };
}
