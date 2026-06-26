import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Menu, X, User, LogIn, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const settings = storage.getSettings();
  const user = storage.getUser();
  const isAdmin = user?.isAdmin === true || ['sonfrom@gmail.com', 'son3u@daum.net'].includes(user?.email?.toLowerCase() || '');

  const navItems = [
    { name: '홈', path: '/' },
    { name: '단체소개', path: '/about' },
    { name: '공지사항', path: '/notice' },
    { name: '활동소식', path: '/activity' },
    { name: '캠페인', path: '/campaigns' },
    { name: '언론기사', path: '/news' },
    { name: '영상자료', path: '/videos' },
    { name: '자유게시판', path: '/board' },
    { name: '회원가입', path: '/support' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group flex-nowrap shrink-0">
          <div className="px-2.5 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 group-hover:rotate-3 transition-all text-xs shadow-lg shadow-accent/20 tracking-wider whitespace-nowrap shrink-0 select-none">ㅅㅅㅅ</div>
          <span className={cn(
            "flex flex-col justify-center items-start transition-opacity group-hover:opacity-80"
          )}>
            <span className="text-xs sm:text-sm font-black tracking-[0.1em] text-white leading-none">광주참여자치시민연대</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8 flex-nowrap whitespace-nowrap">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                location.pathname === item.path ? "text-accent" : "text-gray-400"
              )}
            >
              {item.name}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin ? (
                <Link to="/admin" className="p-2 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-all border border-accent/20 flex items-center justify-center gap-1.5 px-3.5" title={`${user.email}`}>
                  <User className="w-4 h-4 animate-pulse text-accent" />
                  <span className="text-xs font-semibold">{user.email.split('@')[0]} (관리자)</span>
                </Link>
              ) : (
                <div className="p-2 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5 px-3.5 text-slate-400">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold">{user.email.split('@')[0]}</span>
                </div>
              )}
              <button 
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                  } catch (e) {
                    console.error('Logout error', e);
                  }
                  storage.logout();
                  window.location.reload();
                }}
                className="text-xs text-slate-500 hover:text-white font-medium transition-colors flex items-center gap-1 border border-slate-800 px-2.5 py-1 rounded-lg hover:border-slate-700 bg-[#111111]"
              >
                <LogOut className="w-3.5 h-3.5" />
                로그아웃
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-1.5 rounded-lg bg-accent/10 border border-accent/30 hover:bg-accent-dark hover:bg-accent/20 text-accent text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              로그인
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#0a0a0a] border-b border-white/10 px-4 py-8 flex flex-col gap-6"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-lg font-medium",
                location.pathname === item.path ? "text-accent" : "text-gray-400"
              )}
            >
              {item.name}
            </Link>
          ))}
          {user ? (
            <>
              <div className="text-xs text-slate-500 italic px-1">
                로그인됨: {user.email} {isAdmin && '(관리자)'}
              </div>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-accent"
                >
                  관리자 대시보드
                </Link>
              )}
              <button 
                onClick={async () => {
                  setIsOpen(false);
                  try {
                    await supabase.auth.signOut();
                  } catch (e) {}
                  storage.logout();
                  window.location.reload();
                }}
                className="text-left text-lg font-medium text-red-400 hover:text-red-300"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-accent"
            >
              로그인
            </Link>
          )}
        </motion.div>
      )}
    </header>
  );
}
