import { Link } from 'react-router-dom';
import { Shield, Facebook, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { storage } from '../services/storage';
import { TransparentLogo } from './TransparentLogo';

export default function Footer() {
  const settings = storage.getSettings();

  return (
    <footer className="bg-black border-t border-slate-900 py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-6">
          <div className="flex flex-col gap-3">
            <div className="select-none self-start">
              <TransparentLogo 
                src="https://postfiles.pstatic.net/MjAyNjA1MjJfMTkg/MDAxNzc5NDQ2ODUwNTA5.ehFWlj6XKybyxZ461_dKU3DyGZu3Rjzu265h8QFXhpog.NmsKbc80Vmu3zxrJ9UJ22ERcM6oS-1TTPFy-V1W0M3og.PNG/%EC%9E%90%EC%82%B0_1%EA%B4%91%EC%A3%BC%EC%B0%B8%EC%97%AC%EC%9E%90%EC%B9%98%EC%8B%9C%EB%AF%BC%EC%97%B0%EB%8C%80_%ED%8D%BC%ED%94%8C2.png?type=w3840" 
                className="h-14 w-auto object-contain" 
                alt="광주참여자치시민연대 로고" 
              />
            </div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed font-light italic">
            {settings.description}
          </p>
          <div className="flex items-center gap-3">
            {settings.socialLinks.naverBlog && (
              <a 
                href={settings.socialLinks.naverBlog} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-[#03C75A] hover:bg-[#02b350] transition-all flex items-center justify-center text-white font-black italic text-xs shadow-md hover:scale-110"
                title="네이버 블로그"
              >
                B
              </a>
            )}
            {settings.socialLinks.naverCafe && (
              <a 
                href={settings.socialLinks.naverCafe} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-[#2DB400] hover:bg-[#259900] transition-all flex items-center justify-center text-white font-black italic text-xs shadow-md hover:scale-110"
                title="네이버 카페"
              >
                C
              </a>
            )}
            {settings.socialLinks.facebook && (
              <a 
                href={settings.socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-[#1877F2] hover:bg-[#145dbd] transition-all flex items-center justify-center text-white shadow-md hover:scale-110"
                title="페이스북"
              >
                <Facebook className="w-4 h-4 fill-white" />
              </a>
            )}
            {settings.socialLinks.youtube && (
              <a 
                href={settings.socialLinks.youtube} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-[#FF0000] hover:bg-[#cc0000] transition-all flex items-center justify-center text-white shadow-md hover:scale-110"
                title="유튜브"
              >
                <Youtube className="w-4 h-4 fill-white" />
              </a>
            )}
            {settings.socialLinks.instagram && (
              <a 
                href={settings.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F9CE34] via-[#EE2A7B] to-[#6228D7] hover:brightness-110 transition-all flex items-center justify-center text-white shadow-md hover:scale-110"
                title="인스타그램"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.socialLinks.twitter && (
              <a 
                href={settings.socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-[#111111] border border-slate-755 hover:bg-[#222222] transition-all flex items-center justify-center text-white shadow-md hover:scale-110"
                title="X (트위터)"
              >
                <span className="text-[11px] font-black font-sans leading-none">X</span>
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
              <MapPin className="w-3 h-3 text-accent shrink-0 mt-0.5" /> 경기 광주시 양촌길 124-8
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
