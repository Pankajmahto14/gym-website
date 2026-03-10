import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  CloudArrowUpIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { useMedia } from '../hooks/useMedia';
import toast from 'react-hot-toast';

function UploadZone({ onDrop, type }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      type === 'image'
        ? { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }
        : { 'video/*': ['.mp4', '.mov', '.avi', '.webm'] },
    multiple: true,
    maxSize: type === 'image' ? 10 * 1024 * 1024 : 200 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? 'border-primary bg-primary/10 scale-[1.02]'
          : 'border-white/10 hover:border-primary/50 hover:bg-white/2'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            isDragActive ? 'bg-primary' : 'bg-primary/10'
          }`}
        >
          <CloudArrowUpIcon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-white font-medium">
            {isDragActive
              ? 'Drop files here...'
              : `Drag & drop ${type}s here`}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            or click to browse files
          </p>
          <p className="text-gray-600 text-xs mt-2">
            {type === 'image'
              ? 'JPG, PNG, GIF, WEBP up to 10MB'
              : 'MP4, MOV, AVI, WEBM up to 200MB'}
          </p>
        </div>
      </div>
    </div>
  );
}

function UploadProgress({ uploads }) {
  if (!uploads.length) return null;
  return (
    <div className="space-y-3">
      {uploads.map((u) => (
        <div key={u.name} className="glass rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white truncate max-w-[60%]">{u.name}</span>
            <span className="text-primary font-medium">{u.progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <motion.div
              className="h-1.5 bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${u.progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MediaCard({ item, type, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(item.caption || '');
  const [deleting, setDeleting] = useState(false);

  const colName = type === 'image' ? 'images' : 'videos';

  const handleSave = async () => {
    await onEdit(item.id, colName, caption);
    toast.success('Caption updated!');
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this file permanently?')) return;
    setDeleting(true);
    try {
      await onDelete(item, colName);
      toast.success('Deleted successfully!');
    } catch {
      toast.error('Failed to delete.');
      setDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="card-dark overflow-hidden group"
    >
      {/* Preview */}
      <div className="aspect-video relative overflow-hidden">
        {type === 'image' ? (
          <img
            src={item.url}
            alt={item.caption}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <video
            src={item.url}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
          />
        )}
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setEditing(true)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-primary text-white transition-colors"
          >
            <PencilIcon className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleDelete}
            disabled={deleting}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500 text-white transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </motion.button>
        </div>
        {deleting && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-primary text-sm">Deleting...</div>
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="p-3">
        {editing ? (
          <div className="flex gap-2">
            <input
              className="input-dark text-sm py-1.5 px-2 flex-1"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add caption..."
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary-600"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditing(false)}
              className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-sm truncate">
            {item.caption || (
              <span className="text-gray-600 italic">No caption</span>
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function MediaManager({ type }) {
  const { items, loading, uploadMedia, deleteMedia, updateCaption } =
    useMedia(type);
  const [uploads, setUploads] = useState([]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const newUploads = acceptedFiles.map((f) => ({
        name: f.name,
        progress: 0,
      }));
      setUploads((prev) => [...prev, ...newUploads]);

      await Promise.all(
        acceptedFiles.map(async (file) => {
          try {
            await uploadMedia(file, '', (pct) => {
              setUploads((prev) =>
                prev.map((u) =>
                  u.name === file.name ? { ...u, progress: pct } : u
                )
              );
            });
            toast.success(`${file.name} uploaded!`);
          } catch {
            toast.error(`Failed to upload ${file.name}`);
          } finally {
            setUploads((prev) => prev.filter((u) => u.name !== file.name));
          }
        })
      );
    },
    [uploadMedia]
  );

  const isImage = type === 'image';

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          {isImage ? (
            <PhotoIcon className="w-5 h-5 text-primary" />
          ) : (
            <VideoCameraIcon className="w-5 h-5 text-primary" />
          )}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">
            {isImage ? 'Image' : 'Video'} Manager
          </h1>
          <p className="text-gray-400 text-sm">
            {items.length} {isImage ? 'image' : 'video'}
            {items.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
      </motion.div>

      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <UploadZone onDrop={onDrop} type={type} />
      </motion.div>

      {/* Upload progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <UploadProgress uploads={uploads} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-2xl bg-dark-50 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-gray-600"
        >
          {isImage ? (
            <PhotoIcon className="w-16 h-16 mx-auto mb-3" />
          ) : (
            <VideoCameraIcon className="w-16 h-16 mx-auto mb-3" />
          )}
          <p>No {isImage ? 'images' : 'videos'} uploaded yet.</p>
          <p className="text-sm mt-1">
            Drag & drop files above to get started.
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {items.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                type={type}
                onDelete={deleteMedia}
                onEdit={updateCaption}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
