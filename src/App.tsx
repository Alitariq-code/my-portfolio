import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Loading from './components/Loading';
import ReadingProgress from './components/ReadingProgress';
import BackToTop from './components/BackToTop';
import Analytics from './components/Analytics';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Testimonials from './sections/Testimonials';
import Projects from './sections/Projects';
import Clients from './sections/Clients';
import Education from './sections/Education';
import Blog from './sections/Blog';
import Contact from './sections/Contact';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time - 2.5 seconds for nice animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <Loading key="loading" />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-slate-900"
        >
          <Analytics />
          <ReadingProgress />
          <Navigation />
          <BackToTop />
          <main>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Testimonials />
            <Projects />
            <Clients />
            <Education />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
