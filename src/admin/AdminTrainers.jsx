import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { useTrainers } from '../hooks/useTrainers';
import toast from 'react-hot-toast';

const INIT_FORM = { name: '', role: '', exp: '', specialty: '' };

export default function AdminTrainers() {
  const { trainers, loading, addTrainer, updateTrainer, deleteTrainer } = useTrainers();
  const [form, setForm] = useState(INIT_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error('Name is required.');
      return;
    }
    setSaving(true);
    setUploadProgress(0);
    try {
      if (editingId) {
        await updateTrainer(editingId, form, imageFile, setUploadProgress);
        toast.success('Trainer updated!');
      } else {
        await addTrainer(form, imageFile, setUploadProgress);
        toast.success('Trainer added!');
      }
      setForm(INIT_FORM);
      setImageFile(null);
      setEditingId(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name || '',
      role: t.role || '',
      exp: t.exp || '',
      specialty: t.specialty || '',
    });
    setImageFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(INIT_FORM);
    setImageFile(null);
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete trainer "${t.name}"?`)) return;
    try {
      await deleteTrainer(t);
      toast.success('Trainer deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <UserPlusIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Trainers</h1>
          <p className="text-gray-400 text-sm">
            Manage trainers shown on the About section. Add photo, name, role, experience & specialty.
          </p>
        </div>
      </div>

      {/* Add / Edit form */}
      <div className="card-dark p-6 mb-8">
        <h2 className="font-display text-lg font-bold mb-4">
          {editingId ? 'Edit Trainer' : 'Add Trainer'}
        </h2>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Name *</label>
            <input
              className="input-dark"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Trainer name"
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Role</label>
            <input
              className="input-dark"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Head Strength Coach"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Experience</label>
            <input
              className="input-dark"
              value={form.exp}
              onChange={(e) => setForm({ ...form, exp: e.target.value })}
              placeholder="e.g. 12 years exp."
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Specialty</label>
            <input
              className="input-dark"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              placeholder="e.g. Powerlifting & Strength"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-gray-400 text-sm mb-1 block">Photo (optional)</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 text-sm">
                <PhotoIcon className="w-5 h-5" />
                {imageFile ? imageFile.name : 'Choose image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
              {imageFile && (
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="text-gray-500 hover:text-white text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <p className="text-primary text-sm mt-2">Uploading… {uploadProgress}%</p>
            )}
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary py-2 px-6 disabled:opacity-60">
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Trainer'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn-outline py-2 px-6">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-dark p-4 animate-pulse">
              <div className="aspect-[4/3] bg-dark-50 rounded-lg mb-3" />
              <div className="h-4 bg-dark-50 rounded w-2/3 mb-2" />
              <div className="h-3 bg-dark-50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : trainers.length === 0 ? (
        <div className="card-dark p-12 text-center text-gray-500">
          No trainers yet. Add one above to show on the website.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {trainers.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card-dark overflow-hidden"
              >
                <div className="aspect-video bg-dark-50 relative">
                  {t.imageUrl ? (
                    <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PhotoIcon className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{t.name}</p>
                    <p className="text-primary text-sm truncate">{t.role}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(t)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
