import { useEffect } from 'react';

// Type declarations for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });

  // Make gtag available globally
  window.gtag = gtag;
};

// Track page view
export const trackPageView = (path: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('click', 'button', `${buttonName}${location ? ` - ${location}` : ''}`);
};

// Track download events
export const trackDownload = (fileName: string) => {
  trackEvent('download', 'file', fileName);
};

// Track external link clicks
export const trackExternalLink = (url: string) => {
  trackEvent('click', 'external_link', url);
};

// Track form submissions
export const trackFormSubmit = (formName: string, success: boolean) => {
  trackEvent(success ? 'form_submit_success' : 'form_submit_error', 'form', formName);
};

// Track section views
export const trackSectionView = (sectionName: string) => {
  trackEvent('view', 'section', sectionName);
};

// Analytics Component - Handles page view tracking
export default function Analytics() {
  useEffect(() => {
    // Initialize GA on mount
    if (GA_MEASUREMENT_ID) {
      initGA();
      // Track initial page view
      trackPageView(window.location.pathname);
    }
  }, []);

  // Track page view on scroll (for single-page app)
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const handleScroll = () => {
      // Track section views based on scroll position
      const sections = ['home', 'about', 'skills', 'experience', 'testimonials', 'projects', 'education', 'contact'];
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            trackSectionView(section);
          }
        }
      });
    };

    // Throttle scroll tracking
    let timeout: ReturnType<typeof setTimeout>;
    window.addEventListener('scroll', () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScroll, 1000);
    }, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

