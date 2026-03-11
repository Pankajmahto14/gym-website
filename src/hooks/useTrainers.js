import { useState, useEffect } from 'react';
import { ref as dbRef, get, push, set, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { getCached, setCache } from '../lib/cache';

const COLLECTION = 'trainers';
const CACHE_KEY = 'trainers';

export function useTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainers = async () => {
    const cached = getCached(CACHE_KEY);
    if (cached) {
      setTrainers(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const snap = await get(dbRef(db, COLLECTION));
      let next = [];
      if (snap.exists()) {
        const val = snap.val(); // { id: trainerData }
        next = Object.entries(val).map(([id, data]) => ({ id, ...data }));
        next.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      }
      setTrainers(next);
      setCache(CACHE_KEY, next);
    } catch (err) {
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const addTrainer = async (data, imageFile, onProgress) => {
    let imageUrl = '';
    let storagePath = null;

    if (imageFile) {
      const path = `trainers/${Date.now()}_${imageFile.name}`;
      const fileRef = storageRef(storage, path);
      await new Promise((resolve, reject) => {
        const task = uploadBytesResumable(fileRef, imageFile);
        task.on(
          'state_changed',
          (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          async () => {
            imageUrl = await getDownloadURL(task.snapshot.ref);
            storagePath = path;
            resolve();
          }
        );
      });
    }

    const listRef = dbRef(db, COLLECTION);
    const newRef = push(listRef);
    await set(newRef, {
      name: data.name || '',
      role: data.role || '',
      exp: data.exp || '',
      specialty: data.specialty || '',
      imageUrl,
      storagePath,
      createdAt: Date.now(),
    });
    fetchTrainers();
  };

  const updateTrainer = async (id, data, imageFile, onProgress) => {
    const updates = {
      name: data.name,
      role: data.role,
      exp: data.exp,
      specialty: data.specialty,
    };

    if (imageFile) {
      const path = `trainers/${Date.now()}_${imageFile.name}`;
      const fileRef = storageRef(storage, path);
      await new Promise((resolve, reject) => {
        const task = uploadBytesResumable(fileRef, imageFile);
        task.on(
          'state_changed',
          (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          async () => {
            updates.imageUrl = await getDownloadURL(task.snapshot.ref);
            updates.storagePath = path;
            resolve();
          }
        );
      });
    }

    await update(dbRef(db, `${COLLECTION}/${id}`), updates);
    fetchTrainers();
  };

  const deleteTrainer = async (trainer) => {
    if (trainer.storagePath) {
      try {
        await deleteObject(storageRef(storage, trainer.storagePath));
      } catch (_) {}
    }
    await remove(dbRef(db, `${COLLECTION}/${trainer.id}`));
    fetchTrainers();
  };

  return { trainers, loading, refetchTrainers: fetchTrainers, addTrainer, updateTrainer, deleteTrainer };
}
