import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import { useEquipment } from '../hooks/useEquipment';
import ImageLightbox from './ImageLightbox';

export default function Equipment() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { equipment, loading, sectionContent } = useEquipment();
  const [lightboxImage, setLightboxImage] = useState(null);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <section id="equipment" className="py-24 relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 60% 40%, rgba(249,115,22,1) 0%, transparent 55%)',
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
            {sectionContent.badge}
          </span>
          <h2 className="section-title mt-3">
            <span className="text-gradient">{sectionContent.title}</span>
          </h2>
          <p className="section-subtitle mx-auto">
            {sectionContent.subtitle}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[85vw] max-w-[320px] rounded-2xl overflow-hidden card-dark animate-pulse snap-center md:w-auto md:max-w-none md:flex-shrink"
              >
                <div className="aspect-[4/3] bg-dark-50" />
                <div className="p-4 space-y-2">
                  <div className="h-5 w-3/4 bg-dark-50 rounded" />
                  <div className="h-3 w-full bg-dark-50 rounded" />
                  <div className="h-3 w-5/6 bg-dark-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : equipment.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <CubeTransparentIcon className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No equipment added yet.</p>
            <p className="text-gray-600 text-sm mt-2">
              Admin can add equipment from the dashboard.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex overflow-x-auto gap-6 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible scrollbar-hide"
          >
            {equipment.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="flex-shrink-0 w-[85vw] max-w-[340px] rounded-2xl overflow-hidden card-dark group hover:border-primary/30 transition-colors snap-center md:w-auto md:max-w-none md:flex-shrink"
              >
                <div
                  className="aspect-[4/3] bg-dark-50 relative overflow-hidden cursor-pointer"
                  role={item.imageUrl ? 'button' : undefined}
                  onClick={() => item.imageUrl && setLightboxImage({ src: item.imageUrl, alt: item.name || 'Equipment', caption: item.name || '' })}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CubeTransparentIcon className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {item.name || 'Equipment'}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {item.description || 'No description.'}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <ImageLightbox
          open={!!lightboxImage}
          src={lightboxImage?.src}
          alt={lightboxImage?.alt}
          caption={lightboxImage?.caption}
          onClose={() => setLightboxImage(null)}
        />
      </div>
    </section>
  );
}
