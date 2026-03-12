import { useState, useEffect } from 'react';
import { ref as dbRef, get, push, set, update, remove } from 'firebase/database';
import { db } from '../firebase/config';
import { getCached, setCache } from '../lib/cache';
import { uploadToCloudinary } from '../lib/cloudinaryUpload';

const COLLECTION = 'equipment';
const CACHE_KEY = 'equipment';
const SECTION_PATH = 'settings/equipment';
const SECTION_CACHE_KEY = 'equipmentSection';

const DEFAULT_SECTION = {
  badge: 'Facility',
  title: 'Our Equipment',
  subtitle: 'Professional machines and tools to support your training and goals.',
};

export function useEquipment() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionContent, setSectionContent] = useState(DEFAULT_SECTION);

  const fetchSection = async () => {
    const cached = getCached(SECTION_CACHE_KEY);
    if (cached) {
      setSectionContent(cached);
    }
    try {
      const snap = await get(dbRef(db, SECTION_PATH));
      if (snap.exists()) {
        const val = snap.val();
        const next = {
          badge: val.badge ?? DEFAULT_SECTION.badge,
          title: val.title ?? DEFAULT_SECTION.title,
          subtitle: val.subtitle ?? DEFAULT_SECTION.subtitle,
        };
        setSectionContent(next);
        setCache(SECTION_CACHE_KEY, next);
      }
    } catch (_) {
      setSectionContent(DEFAULT_SECTION);
    }
  };

  const fetchEquipment = async () => {
    const cached = getCached(CACHE_KEY);
    if (cached) {
      setItems(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const snap = await get(dbRef(db, COLLECTION));
      let next = [];
      if (snap.exists()) {
        const val = snap.val();
        next = Object.entries(val).map(([id, data]) => ({ id, ...data }));
        next.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      }
      setItems(next);
      setCache(CACHE_KEY, next);
    } catch (err) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
    fetchSection();
  }, []);

  const saveSectionContent = async (data) => {
    const next = {
      badge: data.badge ?? DEFAULT_SECTION.badge,
      title: data.title ?? DEFAULT_SECTION.title,
      subtitle: data.subtitle ?? DEFAULT_SECTION.subtitle,
    };
    setSectionContent(next);
    setCache(SECTION_CACHE_KEY, next);
    await set(dbRef(db, SECTION_PATH), next);
  };

  const addEquipment = async (data, imageFile, onProgress) => {
    let imageUrl = '';
    let storagePath = null;

    if (imageFile) {
      onProgress?.(10);
      const upload = await uploadToCloudinary(imageFile);
      imageUrl = upload.url;
      storagePath = upload.publicId || null;
      onProgress?.(100);
    }

    const listRef = dbRef(db, COLLECTION);
    const newRef = push(listRef);
    await set(newRef, {
      name: data.name || '',
      description: data.description || '',
      imageUrl,
      storagePath,
      createdAt: Date.now(),
    });
    fetchEquipment();
  };

  const updateEquipment = async (id, data, imageFile, onProgress) => {
    const updates = {
      name: data.name || '',
      description: data.description || '',
    };

    if (imageFile) {
      onProgress?.(10);
      const upload = await uploadToCloudinary(imageFile);
      updates.imageUrl = upload.url;
      updates.storagePath = upload.publicId || null;
      onProgress?.(100);
    }

    await update(dbRef(db, `${COLLECTION}/${id}`), updates);
    fetchEquipment();
  };

  const deleteEquipment = async (item) => {
    await remove(dbRef(db, `${COLLECTION}/${item.id}`));
    fetchEquipment();
  };

  return {
    equipment: items,
    loading,
    sectionContent,
    refetch: fetchEquipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    saveSectionContent,
    sectionDefaults: DEFAULT_SECTION,
  };
}
