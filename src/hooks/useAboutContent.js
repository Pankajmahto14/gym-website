import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { getCached, setCache } from '../lib/cache';

const CACHE_KEY = 'about';

const SETTINGS_COLLECTION = 'settings';
const ABOUT_DOC_ID = 'about';
const GYM_IMAGE_PATH = 'about/gym-image';

export const DEFAULT_ABOUT = {
  aboutSubtitle:
    'We are more than a gym — we are a community dedicated to helping you Keep Fit & Gain Skills. State-of-the-art equipment, expert trainers, and an environment built for champions in Adityapur, Jamshedpur.',
  paragraph1:
    'FIT N FEAT has been the premier training destination in Adityapur, Jamshedpur for athletes, fitness enthusiasts, and beginners alike. Our facility is equipped with cutting-edge equipment to help you Keep Fit & Gain Skills.',
  paragraph2:
    'Our certified coaches bring decades of combined experience in strength training, HIIT, yoga, boxing, and more — creating personalized programs that deliver real results.',
  paragraph3:
    'We believe in building not just bodies, but confidence, discipline, and community. Every member is part of our family.',
  gymImageUrl: '',
  gymImageStoragePath: '',
  badgeTitle: '#1',
  badgeSubtitle: 'Rated Gym 2024',
  chips: ['Olympic Lifting Zone', 'Cardio Deck', 'Sauna & Recovery', 'Nutrition Bar'],
  stats: [
    { value: 2500, suffix: '+', label: 'Happy Members', icon: '💪' },
    { value: 50, suffix: '+', label: 'Expert Trainers', icon: '🏋️' },
    { value: 10, suffix: '+', label: 'Years of Excellence', icon: '🏆' },
    { value: 98, suffix: '%', label: 'Success Rate', icon: '⭐' },
  ],
};

function mergeWithDefaults(data) {
  const d = DEFAULT_ABOUT;
  return {
    aboutSubtitle: data?.aboutSubtitle ?? d.aboutSubtitle,
    paragraph1: data?.paragraph1 ?? d.paragraph1,
    paragraph2: data?.paragraph2 ?? d.paragraph2,
    paragraph3: data?.paragraph3 ?? d.paragraph3,
    gymImageUrl: data?.gymImageUrl ?? d.gymImageUrl,
    gymImageStoragePath: data?.gymImageStoragePath ?? d.gymImageStoragePath,
    badgeTitle: data?.badgeTitle ?? d.badgeTitle,
    badgeSubtitle: data?.badgeSubtitle ?? d.badgeSubtitle,
    chips: Array.isArray(data?.chips) && data.chips.length ? data.chips : d.chips,
    stats: Array.isArray(data?.stats) && data.stats.length ? data.stats : d.stats,
  };
}

export function useAboutContent() {
  const [content, setContent] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);

  const fetchAbout = async () => {
    const cached = getCached(CACHE_KEY);
    if (cached) {
      setContent(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const snap = await getDoc(doc(db, SETTINGS_COLLECTION, ABOUT_DOC_ID));
      const next = mergeWithDefaults(snap.exists() ? snap.data() : null);
      setContent(next);
      setCache(CACHE_KEY, next);
    } catch (_) {
      setContent(DEFAULT_ABOUT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const resizeImageIfNeeded = (file, maxWidth = 1200, quality = 0.85) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/') || file.size < 300 * 1024) {
        resolve(file);
        return;
      }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        if (img.width <= maxWidth) {
          resolve(file);
          return;
        }
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => resolve(blob ? new File([blob], file.name, { type: file.type }) : file),
          file.type,
          quality
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
  };

  const uploadGymImage = async (file, onProgress) => {
    const toUpload = await resizeImageIfNeeded(file);
    const path = `${GYM_IMAGE_PATH}_${Date.now()}.${file.name.split('.').pop() || 'jpg'}`;
    const storageRef = ref(storage, path);
    await new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, toUpload);
      task.on(
        'state_changed',
        (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        reject,
        resolve
      );
    });
    const url = await getDownloadURL(storageRef);
    return { url, storagePath: path };
  };

  const saveAboutContent = async (data, gymImageFile, onProgress, { onOptimisticDone } = {}) => {
    const buildPayload = (gymUrl, gymPath) => ({
      aboutSubtitle: data.aboutSubtitle ?? content.aboutSubtitle,
      paragraph1: data.paragraph1 ?? content.paragraph1,
      paragraph2: data.paragraph2 ?? content.paragraph2,
      paragraph3: data.paragraph3 ?? content.paragraph3,
      gymImageUrl: gymUrl,
      gymImageStoragePath: gymPath,
      badgeTitle: data.badgeTitle ?? content.badgeTitle,
      badgeSubtitle: data.badgeSubtitle ?? content.badgeSubtitle,
      chips: data.chips ?? content.chips,
      stats: (data.stats ?? content.stats).map((s) => ({
        value: typeof s.value === 'number' ? s.value : parseInt(s.value, 10) || 0,
        suffix: s.suffix ?? '+',
        label: s.label ?? '',
        icon: s.icon ?? '🏋️',
      })),
    });

    // Optimistic update: show new text/chips/stats immediately (keep current image until upload done)
    const optimisticPayload = buildPayload(
      content.gymImageUrl ?? '',
      content.gymImageStoragePath ?? ''
    );
    const optimisticMerged = mergeWithDefaults(optimisticPayload);
    setContent(optimisticMerged);
    setCache(CACHE_KEY, optimisticMerged);
    onOptimisticDone?.();

    // Background: upload image if needed, then write to Firestore
    let gymImageUrl = content.gymImageUrl ?? '';
    let gymImageStoragePath = content.gymImageStoragePath ?? '';

    if (gymImageFile) {
      if (content.gymImageStoragePath) {
        try {
          await deleteObject(ref(storage, content.gymImageStoragePath));
        } catch (_) {}
      }
      const result = await uploadGymImage(gymImageFile, onProgress);
      gymImageUrl = result.url;
      gymImageStoragePath = result.storagePath;
    }

    const payload = buildPayload(gymImageUrl, gymImageStoragePath);
    await setDoc(doc(db, SETTINGS_COLLECTION, ABOUT_DOC_ID), payload);
    const next = mergeWithDefaults(payload);
    setContent(next);
    setCache(CACHE_KEY, next);
  };

  return { content, loading, refetch: fetchAbout, saveAboutContent, defaults: DEFAULT_ABOUT };
}
