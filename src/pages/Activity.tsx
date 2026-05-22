import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';

const ActivityPage: React.FC = () => {
  const posts = storage.getPosts();
  const settings = storage.getSettings();

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">홈으로 돌아가기</span>
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">활동소식</h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-2xl">
            {settings.name}의 모든 활동과 현장의 목소리를 기록합니다. 시민의 참여로 만들어가는 소중한 소식들입니다.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => post.url && window.open(post.url, '_blank')}
              className="group cursor-pointer flex flex-col h-full"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-2xl mb-6 relative border border-slate-800 ring-1 ring-white/5 group-hover:ring-accent/50 transition-all duration-500">
                <img 
                  src={post.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-accent/80 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider text-white">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 font-medium"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="w-1 h-1 bg-slate-800 rounded-full" />
                  <span className="font-medium">By {post.author}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 font-light leading-relaxed">
                  {post.content || post.excerpt}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5">
                <span className="text-accent text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  자세히 보기 <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
