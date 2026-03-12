import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Videos from '../components/Videos';
import Equipment from '../components/Equipment';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const t = setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [hash]);

  return (
    <>
      <Hero />
      <About />
      <Gallery />
      <Videos />
      <Equipment />
      <Contact />
      <Footer />
    </>
  );
}
