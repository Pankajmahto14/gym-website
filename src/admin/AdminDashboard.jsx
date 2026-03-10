import { motion } from 'framer-motion';
import { PhotoIcon, VideoCameraIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useMedia } from '../hooks/useMedia';

function StatCard({ icon: Icon, label, count, to, color }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="card-dark p-6 group">
      <div className="flex items-center justify-between mb-6">
        <div
          className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <Link
          to={to}
          className="text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </div>
      <div className="font-display text-4xl font-bold text-white mb-1">
        {count}
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { items: images } = useMedia('image');
  const { items: videos } = useMedia('video');

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold">
          Welcome back! 👋
        </h1>
        <p className="text-gray-400 mt-2">
          Here's an overview of your gym content.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 gap-6 mb-10"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={PhotoIcon}
            label="Total Images"
            count={images.length}
            to="/admin/images"
            color="bg-primary"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={VideoCameraIcon}
            label="Total Videos"
            count={videos.length}
            to="/admin/videos"
            color="bg-orange-600"
          />
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-dark p-6 mb-8"
      >
        <h2 className="font-display text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/admin/images"
            className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 group"
          >
            <PhotoIcon className="w-6 h-6 text-primary" />
            <span className="font-medium">Upload Images</span>
            <ArrowRightIcon className="w-4 h-4 text-primary ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/admin/videos"
            className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 transition-colors border border-orange-500/20 group"
          >
            <VideoCameraIcon className="w-6 h-6 text-orange-400" />
            <span className="font-medium">Upload Videos</span>
            <ArrowRightIcon className="w-4 h-4 text-orange-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Recent Images preview */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-dark p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Recent Images</h2>
            <Link
              to="/admin/images"
              className="text-primary text-sm hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {images.slice(0, 6).map((img) => (
              <div
                key={img.id}
                className="aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
