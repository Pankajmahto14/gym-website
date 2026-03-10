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
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
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
      const q = query(
        collection(db, COLLECTION),
        orderBy('createdAt', 'asc')
      );
      const snap = await getDocs(q);
      const next = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
      const storageRef = ref(storage, path);
      await new Promise((resolve, reject) => {
        const task = uploadBytesResumable(storageRef, imageFile);
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

    await addDoc(collection(db, COLLECTION), {
      name: data.name || '',
      role: data.role || '',
      exp: data.exp || '',
      specialty: data.specialty || '',
      imageUrl,
      storagePath,
      createdAt: serverTimestamp(),
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
      const storageRef = ref(storage, path);
      await new Promise((resolve, reject) => {
        const task = uploadBytesResumable(storageRef, imageFile);
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

    await updateDoc(doc(db, COLLECTION, id), updates);
    fetchTrainers();
  };

  const deleteTrainer = async (trainer) => {
    if (trainer.storagePath) {
      try {
        await deleteObject(ref(storage, trainer.storagePath));
      } catch (_) {}
    }
    await deleteDoc(doc(db, COLLECTION, trainer.id));
    fetchTrainers();
  };

  return { trainers, loading, refetchTrainers: fetchTrainers, addTrainer, updateTrainer, deleteTrainer };
}
