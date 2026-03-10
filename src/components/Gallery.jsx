import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useMedia } from '../hooks/useMedia';

function Lightbox({ items, index, onClose, onPrev, onNext }) {
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
          className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full glass"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full glass"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        <motion.div
          key={index}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-4xl max-h-[85vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={items[index]?.url}
            alt={items[index]?.caption || 'Gallery image'}
            className="w-full h-full object-contain rounded-xl"
          />
          {items[index]?.caption && (
            <div className="absolute bottom-0 left-0 right-0 glass p-4 rounded-b-xl text-center text-white">
              {items[index].caption}
            </div>
          )}
        </motion.div>

        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full glass"
        >
          <ArrowRightIcon className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
          {index + 1} / {items.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Gallery() {
  const { items, loading } = useMedia('image');
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section id="gallery" className="py-24 relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 50%, rgba(249,115,22,1) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Our Space
          </span>
          <h2 className="section-title mt-3">
            Photo <span className="text-gradient">Gallery</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Explore our world-class facilities and the community that makes us great.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-dark-50 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <PhotoIcon className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No images yet.</p>
            <p className="text-gray-600 text-sm mt-2">
              Admin can upload images from the dashboard.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {items.map((img, i) => (
              <motion.div
                key={img.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setLightboxIdx(i)}
              >
                <img
                  src={img.url}
                  alt={img.caption || ''}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  {img.caption && (
                    <p className="text-white text-sm font-medium truncate">
                      {img.caption}
                    </p>
                  )}
                </div>
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/60 rounded-2xl transition-all duration-300" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          items={items}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((i) => (i - 1 + items.length) % items.length)}
          onNext={() => setLightboxIdx((i) => (i + 1) % items.length)}
        />
      )}
    </section>
  );
}
