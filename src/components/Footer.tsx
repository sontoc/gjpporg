import { Link } from 'react-router-dom';
import { Shield, Facebook, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { storage } from '../services/storage';

export default function Footer() {
  const settings = storage.getSettings();

  return (
    <footer className="bg-[#0F0F0F] border-t border-slate-800 py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-accent/20">참</div>
            <span className="text-lg font-bold text-white tracking-tight">{settings.name}</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed font-light italic">
            {settings.description}
          </p>
          <div className="flex items-center gap-6">
            {settings.socialLinks.naverBlog && (
              <a href={settings.socialLinks.naverBlog} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#03C75A] transition-colors flex items-center justify-center">
                <div className="w-4 h-4 border border-current rounded-sm flex items-center justify-center leading-none">
                  <span className="text-[9px] font-black italic">B</span>
                </div>
              </a>
            )}
            {settings.socialLinks.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-accent transition-colors flex items-center justify-center">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings.socialLinks.youtube && (
              <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-accent transition-colors flex items-center justify-center">
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {settings.socialLinks.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-accent transition-colors flex items-center justify-center">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.socialLinks.twitter && (
              <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-accent transition-colors flex items-center justify-center">
                <span className="text-[11px] font-bold leading-none">X</span>
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Navigation</h4>
          <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <li><Link to="/about" className="hover:text-accent transition-colors">단체소개</Link></li>
            <li><Link to="/notice" className="hover:text-accent transition-colors">공지사항</Link></li>
            <li><Link to="/activity" className="hover:text-accent transition-colors">활동소식</Link></li>
            <li><Link to="/news" className="hover:text-accent transition-colors">언론기사</Link></li>
            <li><Link to="/videos" className="hover:text-accent transition-colors">영상자료</Link></li>
            <li><Link to="/board" className="hover:text-accent transition-colors">자유게시판</Link></li>
            <li><Link to="/support" className="hover:text-accent transition-colors">회원가입</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Contact</h4>
          <ul className="space-y-4 text-xs text-slate-500 font-light">
            <li className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-accent" /> {settings.contactEmail}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-accent" /> {settings.contactPhone}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-3 h-3 text-accent shrink-0 mt-0.5" /> 경기 광주시 회안대로 980 / 3층(사무실)
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Newsletter</h4>
          <p className="text-slate-500 text-xs font-light">최신 활동 소식을 메일로 받아보세요.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-[#141414] border border-slate-800 rounded px-4 py-2.5 text-xs text-white w-full focus:outline-none focus:border-accent transition-colors"
            />
            <button className="bg-accent text-white px-5 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-colors whitespace-nowrap">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-medium tracking-widest text-slate-600 uppercase">© {new Date().getFullYear()} {settings.name}.</p>
        <div className="flex gap-10">
          <a href="/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700 hover:text-accent transition-colors">Admin Access</a>
        </div>
      </div>
    </footer>
  );
}
