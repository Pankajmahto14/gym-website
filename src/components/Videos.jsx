import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { PlayIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useMedia } from '../hooks/useMedia';

function VideoModal({ video, onClose }) {
  return (
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
      <motion.div
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        className="w-full max-w-4xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={video.url}
          controls
          autoPlay
          className="w-full h-full rounded-xl"
        />
        {video.caption && (
          <p className="text-center text-gray-300 mt-3">{video.caption}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Videos() {
  const { items, loading } = useMedia('video');
  const [activeVideo, setActiveVideo] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="videos" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-dark-50/30 to-black" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 70% 30%, rgba(249,115,22,1) 0%, transparent 60%)',
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
            In Action
          </span>
          <h2 className="section-title mt-3">
            Training <span className="text-gradient">Videos</span>
          </h2>
          <p className="section-subtitle mx-auto">
            See our trainers and members in action. Get inspired and start your
            journey.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible scrollbar-hide">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[85vw] max-w-[340px] aspect-video rounded-2xl bg-dark-50 animate-pulse snap-center md:w-auto md:max-w-none md:flex-shrink"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <VideoCameraIcon className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No videos yet.</p>
            <p className="text-gray-600 text-sm mt-2">
              Admin can upload videos from the dashboard.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible scrollbar-hide"
          >
            {items.map((vid) => (
              <motion.div
                key={vid.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="relative flex-shrink-0 w-[85vw] max-w-[340px] aspect-video rounded-2xl overflow-hidden cursor-pointer group card-dark snap-center md:w-auto md:max-w-none md:flex-shrink"
                onClick={() => setActiveVideo(vid)}
              >
                <video
                  src={vid.url}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/40"
                  >
                    <PlayIcon className="w-7 h-7 text-white ml-1" />
                  </motion.div>
                </div>
                {vid.caption && (
                  <div className="absolute bottom-0 left-0 right-0 glass p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {vid.caption}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  );
}
