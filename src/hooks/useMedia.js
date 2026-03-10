import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { getCached, setCache } from '../lib/cache';

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
      const q = query(
        collection(db, colName),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const next = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
    const storageRef = ref(storage, `${uploadCol}/${Date.now()}_${file.name}`);

    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        'state_changed',
        (snap) => {
          const pct = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          onProgress?.(pct);
        },
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          const docRef = await addDoc(collection(db, uploadCol), {
            url,
            caption,
            name: file.name,
            storagePath: task.snapshot.ref.fullPath,
            createdAt: serverTimestamp(),
          });
          fetchItems();
          resolve({ id: docRef.id, url, caption });
        }
      );
    });
  };

  const deleteMedia = async (item, collectionName) => {
    if (item.storagePath) {
      await deleteObject(ref(storage, item.storagePath));
    }
    await deleteDoc(doc(db, collectionName, item.id));
    fetchItems();
  };

  const updateCaption = async (id, collectionName, caption) => {
    await updateDoc(doc(db, collectionName, id), { caption });
    fetchItems();
  };

  return { items, loading, refetch: fetchItems, uploadMedia, deleteMedia, updateCaption };
}
