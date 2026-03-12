import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Full-screen lightbox for a single image. Use when user clicks an image.
 * @param {{ open: boolean, src: string, alt?: string, caption?: string, onClose: () => void }} props
 */
export default function ImageLightbox({ open, src, alt = '', caption = '', onClose }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full glass z-10"
          aria-label="Close"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-4xl max-h-[85vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain rounded-xl"
          />
          {caption && (
            <div className="absolute bottom-0 left-0 right-0 glass p-4 rounded-b-xl text-center text-white text-sm">
              {caption}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
