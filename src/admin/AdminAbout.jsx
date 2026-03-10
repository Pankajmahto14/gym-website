import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  ChartBarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { useAboutContent } from '../hooks/useAboutContent';
import toast from 'react-hot-toast';

export default function AdminAbout() {
  const { content, loading, saveAboutContent, defaults } = useAboutContent();
  const [form, setForm] = useState({
    aboutSubtitle: '',
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
    badgeTitle: '',
    badgeSubtitle: '',
    chips: [],
    stats: [],
  });
  const [gymImageFile, setGymImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newChip, setNewChip] = useState('');

  useEffect(() => {
    if (!loading) {
      setForm({
        aboutSubtitle: content.aboutSubtitle ?? defaults.aboutSubtitle,
        paragraph1: content.paragraph1 ?? defaults.paragraph1,
        paragraph2: content.paragraph2 ?? defaults.paragraph2,
        paragraph3: content.paragraph3 ?? defaults.paragraph3,
        badgeTitle: content.badgeTitle ?? defaults.badgeTitle,
        badgeSubtitle: content.badgeSubtitle ?? defaults.badgeSubtitle,
        chips: [...(content.chips || defaults.chips)],
        stats: (() => {
        const raw = content.stats && content.stats.length ? content.stats : defaults.stats;
        const four = raw.slice(0, 4).map((s) => ({ ...s }));
        while (four.length < 4) four.push({ value: 0, suffix: '+', label: '', icon: '🏋️' });
        return four;
      })(),
      });
    }
  }, [loading, content, defaults]);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setUploadProgress(0);
    saveAboutContent(form, gymImageFile, setUploadProgress, {
      onOptimisticDone: () => {
        setSaving(false);
        setUploadProgress(0);
        setGymImageFile(null);
        toast.success('About section updated!');
      },
    }).catch((err) => {
      toast.error(err.message || 'Failed to save.');
      setSaving(false);
      setUploadProgress(0);
    });
  };

  const addChip = () => {
    const v = newChip.trim();
    if (v && !form.chips.includes(v)) {
      setForm({ ...form, chips: [...form.chips, v] });
      setNewChip('');
    }
  };

  const removeChip = (i) => {
    setForm({ ...form, chips: form.chips.filter((_, idx) => idx !== i) });
  };

  const updateStat = (index, field, value) => {
    const next = [...form.stats];
    if (!next[index]) next[index] = { value: 0, suffix: '+', label: '', icon: '🏋️' };
    next[index][field] = field === 'value' ? (typeof value === 'string' ? parseInt(value, 10) || 0 : value) : value;
    setForm({ ...form, stats: next });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-dark-50 rounded w-1/3" />
        <div className="card-dark p-8 space-y-4">
          <div className="h-24 bg-dark-50 rounded" />
          <div className="h-24 bg-dark-50 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <DocumentTextIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">About Section</h1>
          <p className="text-gray-400 text-sm">
            Edit the About page: subtitle, paragraphs, gym image, badge, chips and stats cards.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section subtitle */}
        <div className="card-dark p-6">
          <h2 className="font-display text-lg font-bold mb-4">Section subtitle</h2>
          <textarea
            className="input-dark min-h-[80px]"
            value={form.aboutSubtitle}
            onChange={(e) => setForm({ ...form, aboutSubtitle: e.target.value })}
            placeholder="Text under 'About FIT N FEAT'"
            rows={3}
          />
        </div>

        {/* Paragraphs */}
        <div className="card-dark p-6">
          <h2 className="font-display text-lg font-bold mb-4">Body text (3 paragraphs)</h2>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Paragraph {i}</label>
              <textarea
                className="input-dark min-h-[80px]"
                value={form[`paragraph${i}`]}
                onChange={(e) => setForm({ ...form, [`paragraph${i}`]: e.target.value })}
                rows={3}
              />
            </div>
          ))}
        </div>

        {/* Gym image + badge */}
        <div className="card-dark p-6">
          <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <PhotoIcon className="w-5 h-5" />
            Gym image & badge
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Gym image (optional)</label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer text-sm">
                  <PhotoIcon className="w-5 h-5" />
                  {gymImageFile ? gymImageFile.name : 'Choose image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setGymImageFile(e.target.files?.[0] || null)}
                  />
                </label>
                {gymImageFile && (
                  <button type="button" onClick={() => setGymImageFile(null)} className="text-gray-500 hover:text-white text-sm">
                    Remove
                  </button>
                )}
              </div>
              {content.gymImageUrl && !gymImageFile && (
                <p className="text-gray-500 text-xs mt-2">Current image is set. Upload a new file to replace.</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Badge title (e.g. #1)</label>
              <input
                className="input-dark"
                value={form.badgeTitle}
                onChange={(e) => setForm({ ...form, badgeTitle: e.target.value })}
                placeholder="#1"
              />
              <label className="text-gray-400 text-sm mb-2 block mt-3">Badge subtitle</label>
              <input
                className="input-dark"
                value={form.badgeSubtitle}
                onChange={(e) => setForm({ ...form, badgeSubtitle: e.target.value })}
                placeholder="Rated Gym 2024"
              />
            </div>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <p className="text-primary text-sm">Uploading image… {uploadProgress}%</p>
          )}
        </div>

        {/* Chips */}
        <div className="card-dark p-6">
          <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <TagIcon className="w-5 h-5" />
            Chips (facility tags)
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.chips.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 glass px-3 py-1.5 rounded-full text-sm"
              >
                {c}
                <button type="button" onClick={() => removeChip(i)} className="text-gray-400 hover:text-red-400">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input-dark flex-1"
              value={newChip}
              onChange={(e) => setNewChip(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChip())}
              placeholder="New chip text"
            />
            <button type="button" onClick={addChip} className="btn-outline py-2 px-4 flex items-center gap-1">
              <PlusIcon className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="card-dark p-6">
          <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5" />
            Stats cards (value, suffix, label, icon)
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {form.stats.map((s, i) => (
              <div key={i} className="glass rounded-xl p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="input-dark text-sm"
                    type="number"
                    value={s.value}
                    onChange={(e) => updateStat(i, 'value', e.target.value)}
                    placeholder="Value"
                  />
                  <input
                    className="input-dark text-sm"
                    value={s.suffix}
                    onChange={(e) => updateStat(i, 'suffix', e.target.value)}
                    placeholder="Suffix (+ or %)"
                  />
                </div>
                <input
                  className="input-dark text-sm"
                  value={s.label}
                  onChange={(e) => updateStat(i, 'label', e.target.value)}
                  placeholder="Label"
                />
                <input
                  className="input-dark text-sm"
                  value={s.icon}
                  onChange={(e) => updateStat(i, 'icon', e.target.value)}
                  placeholder="Icon (emoji)"
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary py-3 px-8 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save all changes'}
        </button>
      </form>
    </div>
  );
}
