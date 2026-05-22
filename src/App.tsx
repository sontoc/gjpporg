/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Activity from './pages/Activity';
import Support from './pages/Support';
import News from './pages/News';
import Board from './pages/Board';
import NoticeBoard from './pages/NoticeBoard';
import VideoBoard from './pages/VideoBoard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { storage } from './services/storage';
import { supabase } from './lib/supabase';

export default function App() {
  React.useEffect(() => {
    const settings = storage.getSettings();
    document.title = settings.name;
    
    // Simple meta description update
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', settings.description);

    // Update SEO keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', settings.seoKeywords || '');

    // Update accent color globally via CSS variable if needed
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
  }, []);

  // Sync Supabase Auth session state with application storage
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        storage.login(session.user.email || '');
      } else {
        storage.logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/news" element={<News />} />
            <Route path="/board" element={<Board />} />
            <Route path="/notice" element={<NoticeBoard />} />
            <Route path="/videos" element={<VideoBoard />} />
            <Route path="/support" element={<Support />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            {/* Fallback for other routes */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
