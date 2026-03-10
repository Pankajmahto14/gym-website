import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useContactInfo } from '../hooks/useContactInfo';
import toast from 'react-hot-toast';

export default function AdminContactInfo() {
  const { contactInfo, loading, saveContactInfo, defaults } = useContactInfo();
  const [form, setForm] = useState({
    address: '',
    phone: '',
    email: '',
    hours: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      setForm({
        address: contactInfo.address ?? defaults.address,
        phone: contactInfo.phone ?? defaults.phone,
        email: contactInfo.email ?? defaults.email,
        hours: contactInfo.hours ?? defaults.hours,
      });
    }
  }, [loading, contactInfo.address, contactInfo.phone, contactInfo.email, contactInfo.hours]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveContactInfo(form);
      toast.success('Find Us details updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'address', label: 'Address', icon: MapPinIcon, placeholder: 'Full address' },
    { key: 'phone', label: 'Phone', icon: PhoneIcon, placeholder: 'Phone number' },
    { key: 'email', label: 'Email', icon: EnvelopeIcon, placeholder: 'Email address' },
    { key: 'hours', label: 'Hours', icon: ClockIcon, placeholder: 'e.g. Mon–Sat: 5 AM–12 PM, 3:30–10 PM | Sun: 6–9:30 AM, 5–8:30 PM' },
  ];

  if (loading) {
    return (
      <div className="card-dark p-8 animate-pulse">
        <div className="h-6 bg-dark-50 rounded w-1/3 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-dark-50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <MapPinIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Find Us</h1>
          <p className="text-gray-400 text-sm">
            Edit the contact details shown in the Contact section on the website.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-dark p-8"
      >
        <h2 className="font-display text-lg font-bold mb-6">Contact details</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </label>
              <input
                className="input-dark"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3 px-6 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
