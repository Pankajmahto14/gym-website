import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTrainers } from '../hooks/useTrainers';
import { useAboutContent } from '../hooks/useAboutContent';
import ImageLightbox from './ImageLightbox';

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(target);
    const duration = 2000;
    const step = end / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CARD_COLORS = ['from-orange-500 to-red-600', 'from-orange-400 to-amber-600', 'from-red-500 to-orange-600'];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { trainers, loading: trainersLoading } = useTrainers();
  const { content: about, loading: aboutLoading } = useAboutContent();
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-dark-50/50 to-black" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 70% 50%, rgba(249,115,22,1) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Who We Are
          </span>
          <h2 className="section-title mt-3">
            About <span className="text-gradient">FIT N FEAT</span>
          </h2>
          <div className="section-subtitle mx-auto mt-4">
            {aboutLoading || !about ? (
              <div className="h-4 w-80 bg-dark-50 rounded mx-auto animate-pulse" />
            ) : (
              about.aboutSubtitle
            )}
          </div>
        </motion.div>

        {/* About content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-16 items-center mb-24"
        >
          <motion.div variants={itemVariants}>
            <h3 className="font-display text-3xl font-bold mb-6">
              Built for <span className="text-primary">Champions</span>
            </h3>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              {aboutLoading || !about ? (
                <>
                  <div className="h-4 w-full bg-dark-50 rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-dark-50 rounded animate-pulse" />
                  <div className="h-4 w-10/12 bg-dark-50 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <p>{about.paragraph1}</p>
                  <p>{about.paragraph2}</p>
                  <p>{about.paragraph3}</p>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {aboutLoading || !about
                ? [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-7 w-24 bg-dark-50 rounded-full animate-pulse"
                    />
                  ))
                : (about.chips || []).map((f) => (
                    <span
                      key={f}
                      className="glass text-sm text-primary px-4 py-2 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
            </div>
          </motion.div>

          {/* Visual element */}
          <motion.div variants={itemVariants} className="relative">
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-dark-50 cursor-pointer"
              role={about?.gymImageUrl ? 'button' : undefined}
              onClick={() => about?.gymImageUrl && setLightboxImage({ src: about.gymImageUrl, alt: 'FIT N FEAT Gym', caption: about.badgeTitle || '' })}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              {aboutLoading || !about ? (
                <div className="w-full h-full bg-dark-50 animate-pulse rounded-3xl" />
              ) : about.gymImageUrl ? (
                <img
                  src={about.gymImageUrl}
                  alt="FIT N FEAT Gym"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-display text-8xl text-primary/20 font-bold">FNF</div>
                    <p className="text-gray-500 text-sm mt-4">Replace with gym image (Admin)</p>
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary/50 rounded-br-xl" />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-xl"
            >
              {aboutLoading || !about ? (
                <div className="space-y-2">
                  <div className="h-5 w-10 bg-dark-50 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-dark-50 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="font-display text-2xl font-bold text-primary">
                    {about.badgeTitle}
                  </div>
                  <div className="text-xs text-gray-400">
                    {about.badgeSubtitle}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
        >
          {aboutLoading || !about
            ? [1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="card-dark p-6 text-center"
                >
                  <div className="w-10 h-10 mx-auto mb-3 bg-dark-50 rounded-full animate-pulse" />
                  <div className="h-6 w-16 mx-auto bg-dark-50 rounded animate-pulse" />
                  <div className="h-3 w-20 mx-auto mt-2 bg-dark-50 rounded animate-pulse" />
                </motion.div>
              ))
            : (about.stats || []).map((s, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="card-dark p-6 text-center hover:border-primary/30 transition-colors group"
                >
                  <div className="text-3xl mb-2">{s.icon || '🏋️'}</div>
                  <div className="font-display text-4xl font-bold text-primary">
                    <AnimatedCounter target={s.value} suffix={s.suffix || ''} />
                  </div>
                  <div className="text-gray-400 text-sm mt-2">{s.label}</div>
                </motion.div>
              ))}
        </motion.div>

        {/* Trainers */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Our Team
          </span>
          <h3 className="section-title mt-3">
            Expert <span className="text-gradient">Trainers</span>
          </h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex overflow-x-auto gap-6 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible scrollbar-hide"
        >
          {trainersLoading ? (
            [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex-shrink-0 w-[85vw] max-w-[320px] card-dark overflow-hidden animate-pulse snap-center md:w-auto md:max-w-none md:flex-shrink"
              >
                <div className="h-48 bg-dark-50" />
                <div className="p-6 space-y-2">
                  <div className="h-5 bg-dark-50 rounded w-3/4" />
                  <div className="h-4 bg-dark-50 rounded w-1/2" />
                  <div className="h-4 bg-dark-50 rounded w-1/3" />
                </div>
              </motion.div>
            ))
          ) : trainers.length === 0 ? (
            <motion.p
              variants={itemVariants}
              className="min-w-full text-center text-gray-500 py-8 md:col-span-3"
            >
              No trainers added yet. Admin can add trainers from the dashboard.
            </motion.p>
          ) : (
            trainers.map((t, i) => (
              <motion.div
                key={t.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="flex-shrink-0 w-[85vw] max-w-[320px] card-dark overflow-hidden group cursor-pointer snap-center md:w-auto md:max-w-none md:flex-shrink"
              >
                {/* Avatar / Photo from Firebase */}
                <div
                  className={`h-48 relative bg-gradient-to-br ${CARD_COLORS[i % CARD_COLORS.length]} overflow-hidden cursor-pointer`}
                  role={t.imageUrl ? 'button' : undefined}
                  onClick={(e) => { if (t.imageUrl) { e.stopPropagation(); setLightboxImage({ src: t.imageUrl, alt: t.name || 'Trainer', caption: [t.name, t.role].filter(Boolean).join(' · ') }); } }}
                >
                  {t.imageUrl ? (
                    <img
                      src={t.imageUrl}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-4xl">
                        🏋️
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h4 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                    {t.name || 'Trainer'}
                  </h4>
                  <p className="text-primary text-sm mt-1">{t.role || ''}</p>
                  <p className="text-gray-500 text-sm mt-1">{t.exp || ''}</p>
                  <p className="text-gray-400 text-sm mt-3">{t.specialty || ''}</p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

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
