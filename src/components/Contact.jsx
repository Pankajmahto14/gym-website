import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import GymMap from './GymMap';
import { useContactInfo } from '../hooks/useContactInfo';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
/** All contact form messages are sent to this email */
const CONTACT_RECIPIENT_EMAIL = 'info.fitnfeat@gmail.com';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { contactInfo } = useContactInfo();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const INFO = [
    { icon: MapPinIcon, label: 'Address', value: contactInfo.address },
    { icon: PhoneIcon, label: 'Phone', value: contactInfo.phone },
    { icon: EnvelopeIcon, label: 'Email', value: contactInfo.email },
    { icon: ClockIcon, label: 'Hours', value: contactInfo.hours },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.email?.trim() || !form.phone?.trim() || !form.message?.trim()) {
      toast.error('Please fill in name, email, phone and message.');
      return;
    }
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error('Email not set up: add EmailJS keys to .env (see EMAILJS-SETUP.md in project).');
      return;
    }
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: CONTACT_RECIPIENT_EMAIL,
          from_name: form.name.trim(),
          from_email: form.email.trim(),
          from_phone: form.phone?.trim() || '—',
          message: form.message.trim(),
          reply_to: form.email.trim(),
        },
        EMAILJS_PUBLIC_KEY
      );
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err.text || 'Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(249,115,22,1) 0%, transparent 70%)',
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
            Get In Touch
          </span>
          <h2 className="section-title mt-3">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Ready to start your fitness journey? Reach out and we'll help you
            get started.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="card-dark p-8">
              <h3 className="font-display text-2xl font-bold mb-8">
                Find Us
              </h3>
              <div className="space-y-6">
                {INFO.map((i) => (
                  <div key={i.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <i.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">
                        {i.label}
                      </p>
                      <p className="text-white mt-1">{i.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OpenStreetMap + Leaflet (free) */}
            <div className="card-dark overflow-hidden">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                <GymMap />
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants}>
            <div className="card-dark p-8">
              <h3 className="font-display text-2xl font-bold mb-8">
                Send a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Your Name <span className="text-primary">*</span>
                  </label>
                  <input
                    className="input-dark"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    className="input-dark"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Phone Number <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    className="input-dark"
                    placeholder="Your phone number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    rows={5}
                    className="input-dark resize-none"
                    placeholder="Tell us about your fitness goals..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
