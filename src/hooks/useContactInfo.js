import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '../firebase/config';
import { getCached, setCache } from '../lib/cache';

const CACHE_KEY = 'contact';

const SETTINGS_COLLECTION = 'settings';
const CONTACT_DOC_ID = 'contact';

const DEFAULTS = {
  address: '4th floor, Veenapani Tower, Adityapur - Kandra Hwy, Dindli Basti, Adityapur, Jamshedpur, Jharkhand 831013',
  phone: '070043 56390',
  email: 'info@fitnfeat.com',
  hours: 'Mon–Sat: 5 AM–12 PM, 3:30–10 PM  |  Sun: 6–9:30 AM, 5–8:30 PM',
};

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const fetchContactInfo = async () => {
    const cached = getCached(CACHE_KEY);
    if (cached) {
      setContactInfo(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const snap = await get(ref(db, `${SETTINGS_COLLECTION}/${CONTACT_DOC_ID}`));
      const data = snap.exists() ? snap.val() : null;
      const next = data
        ? {
            address: data.address ?? DEFAULTS.address,
            phone: data.phone ?? DEFAULTS.phone,
            email: data.email ?? DEFAULTS.email,
            hours: data.hours ?? DEFAULTS.hours,
          }
        : DEFAULTS;
      setContactInfo(next);
      setCache(CACHE_KEY, next);
    } catch (_) {
      setContactInfo(DEFAULTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const saveContactInfo = async (data) => {
    const next = {
      address: data.address ?? DEFAULTS.address,
      phone: data.phone ?? DEFAULTS.phone,
      email: data.email ?? DEFAULTS.email,
      hours: data.hours ?? DEFAULTS.hours,
    };
    setContactInfo(next);
    setCache(CACHE_KEY, next);
    await set(ref(db, `${SETTINGS_COLLECTION}/${CONTACT_DOC_ID}`), next);
  };

  return { contactInfo, loading, refetch: fetchContactInfo, saveContactInfo, defaults: DEFAULTS };
}
