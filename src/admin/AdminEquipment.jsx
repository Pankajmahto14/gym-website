import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CubeTransparentIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { useEquipment } from '../hooks/useEquipment';
import toast from 'react-hot-toast';

const INIT_FORM = { name: '', description: '' };
const INIT_SECTION = {
  badge: 'Facility',
  title: 'Our Equipment',
  subtitle: 'Professional machines and tools to support your training and goals.',
};

export default function AdminEquipment() {
  const {
    equipment,
    loading,
    sectionContent,
    sectionDefaults,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    saveSectionContent,
  } = useEquipment();
  const [form, setForm] = useState(INIT_FORM);
  const [sectionForm, setSectionForm] = useState(INIT_SECTION);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
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
        await updateEquipment(editingId, form, imageFile, setUploadProgress);
        toast.success('Equipment updated!');
      } else {
        await addEquipment(form, imageFile, setUploadProgress);
        toast.success('Equipment added!');
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

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      description: item.description || '',
    });
    setImageFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(INIT_FORM);
    setImageFile(null);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try {
      await deleteEquipment(item);
      toast.success('Equipment deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  useEffect(() => {
    setSectionForm({
      badge: sectionContent.badge ?? sectionDefaults.badge,
      title: sectionContent.title ?? sectionDefaults.title,
      subtitle: sectionContent.subtitle ?? sectionDefaults.subtitle,
    });
  }, [sectionContent.badge, sectionContent.title, sectionContent.subtitle, sectionDefaults.badge, sectionDefaults.title, sectionDefaults.subtitle]);

  const handleSaveSection = async (e) => {
    e.preventDefault();
    setSavingSection(true);
    try {
      await saveSectionContent(sectionForm);
      toast.success('Section text updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to save.');
    } finally {
      setSavingSection(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <CubeTransparentIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Equipment</h1>
          <p className="text-gray-400 text-sm">
            Add machines and equipment with photo, name and short description for the website.
          </p>
        </div>
      </div>

      {/* Section header (title & subtitle on website) */}
      <div className="card-dark p-6 mb-8">
        <h2 className="font-display text-lg font-bold mb-4">Section header text</h2>
        <p className="text-gray-400 text-sm mb-4">
          Change the heading and subtitle shown above the equipment list on the website.
        </p>
        <form onSubmit={handleSaveSection} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Badge (small label above title)</label>
            <input
              className="input-dark"
              value={sectionForm.badge}
              onChange={(e) => setSectionForm((f) => ({ ...f, badge: e.target.value }))}
              placeholder="e.g. Facility"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Title</label>
            <input
              className="input-dark"
              value={sectionForm.title}
              onChange={(e) => setSectionForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Our Equipment"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Subtitle</label>
            <textarea
              className="input-dark min-h-[80px]"
              value={sectionForm.subtitle}
              onChange={(e) => setSectionForm((f) => ({ ...f, subtitle: e.target.value }))}
              placeholder="e.g. Professional machines and tools to support your training and goals."
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={savingSection}
            className="btn-primary py-2 px-6 disabled:opacity-60"
          >
            {savingSection ? 'Saving...' : 'Save section text'}
          </button>
        </form>
      </div>

      <div className="card-dark p-6 mb-8">
        <h2 className="font-display text-lg font-bold mb-4">
          {editingId ? 'Edit Equipment' : 'Add Equipment'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Name *</label>
            <input
              className="input-dark"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Treadmill, Smith Machine"
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Description</label>
            <textarea
              className="input-dark min-h-[100px]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description of what this machine does and its benefits."
              rows={4}
            />
          </div>
          <div>
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
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2 px-6 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Equipment'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn-outline py-2 px-6">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading && equipment.length === 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-dark p-4 animate-pulse">
              <div className="aspect-[4/3] bg-dark-50 rounded-lg mb-3" />
              <div className="h-4 bg-dark-50 rounded w-2/3 mb-2" />
              <div className="h-3 bg-dark-50 rounded w-full" />
            </div>
          ))}
        </div>
      ) : equipment.length === 0 ? (
        <div className="card-dark p-12 text-center text-gray-500">
          No equipment yet. Add one above to show on the website.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {equipment.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card-dark overflow-hidden"
              >
                <div className="aspect-[4/3] bg-dark-50 relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CubeTransparentIcon className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{item.name}</p>
                    <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
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
