import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Footer() {
  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-100 border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo className="w-12 h-12" />
              <span className="font-display text-2xl font-bold text-gradient">
                FIT N FEAT
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Keep Fit & Gain Skills. Your premier destination for fitness
              training in Adityapur, Jamshedpur.
            </p>
            <div className="flex gap-4 mt-6">
              <motion.a
                href="https://www.facebook.com/share/1ApQgtYhp7/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-xs text-gray-400 hover:text-primary hover:border-primary/50 cursor-pointer transition-colors"
                aria-label="Facebook"
              >
                FB
              </motion.a>
              <motion.a
                href="https://www.instagram.com/fitnfeatgym?igsh=bnV2MXpvZW93MjFv"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-xs text-gray-400 hover:text-primary hover:border-primary/50 cursor-pointer transition-colors"
                aria-label="Instagram"
              >
                IG
              </motion.a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-wider mb-4 text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                ['Home', '#home'],
                ['About', '#about'],
                ['Gallery', '#gallery'],
                ['Videos', '#videos'],
                ['Equipment', '#equipment'],
                ['Contact', '#contact'],
              ].map(([label, id]) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-gray-400 hover:text-primary text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-wider mb-4 text-sm">
              Gym Hours
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Mon – Sat: 5:00 AM – 12:00 PM, 3:30 – 10:00 PM</li>
              <li>Sunday: 6:00 – 9:30 AM, 5:00 – 8:30 PM</li>
              <li className="text-primary font-medium mt-4">
                Open 7 days a week
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FIT N FEAT. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span className="hover:text-primary cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-primary cursor-pointer transition-colors">
              Terms of Service
            </span>
            <a href="/admin/login" className="hover:text-primary transition-colors">
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
