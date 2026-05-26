import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, ArrowLeft, Loader2, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

const ActivityPage: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const settings = storage.getSettings();
  const user = storage.getUser();
  const isAdmin = user?.isAdmin === true || ['sonfrom@gmail.com', 'son3u@daum.net'].includes(user?.email?.toLowerCase() || '');

  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);

  React.useEffect(() => {
    const loadActivityPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .eq('category', 'activity')
          .order('id', { ascending: false })
          .limit(3);

        if (error) throw error;

        let dbMapped: Post[] = [];
        if (data && data.length > 0) {
          dbMapped = data.map((p: any) => ({
            id: p.id,
            title: p.title || '',
            content: p.content || '',
            excerpt: p.excerpt || '',
            category: '활동소식',
            date: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            author: p.author || '관리자',
            imageUrl: p.image_url || undefined,
            url: p.post_url || undefined
          }));
        }

        const localActBackup = storage.getPosts();
        const mergedAct: Post[] = [...dbMapped];
        for (const lp of localActBackup) {
          if (mergedAct.length >= 3) break;
          const isDup = mergedAct.some(m => m.title === lp.title || m.id === lp.id);
          if (!isDup) {
            mergedAct.push({ ...lp, category: '활동소식' });
          }
        }
        setPosts(mergedAct);
      } catch (err) {
        console.error('Error fetching activity posts:', err);
        const localActBackup = storage.getPosts();
        const mergedAct: Post[] = [];
        for (const lp of localActBackup) {
          if (mergedAct.length >= 3) break;
          mergedAct.push({ ...lp, category: '활동소식' });
        }
        setPosts(mergedAct);
      } finally {
        setLoading(false);
      }
    };

    loadActivityPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">홈으로 돌아가기</span>
        </Link>
        
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">활동소식</h1>
            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-2xl mt-4">
              {settings.name}의 모든 활동과 현장의 목소리를 기록합니다. 시민의 참여로 만들어가는 소중한 소식들입니다.
            </p>
          </div>
          {isAdmin && (
            <Link 
              to="/admin" 
              className="bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 shadow-lg shadow-accent/5 cursor-pointer font-sans"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>소식 작성</span>
            </Link>
          )}
        </header>

        {loading ? (
          <div className="py-24 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-sm font-light">실시간 활동 소식 조회 중...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center text-slate-500 font-light border border-slate-900 rounded-3xl bg-[#0F0F0F] text-sm">
            아직 등록된 활동소식이 없습니다. 대시보드를 통해 첫 글을 게시할 수 있습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer flex flex-col h-full bg-[#0F0F0F]/60 border border-slate-900 rounded-3xl p-6 hover:border-accent/40 transition-all duration-300"
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
                    {post.excerpt || post.content}
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
        )}
      </div>

      {/* Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] border border-slate-850 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <span className="px-2.5 py-1 bg-accent text-white rounded text-[10px] font-bold uppercase tracking-widest">
                {selectedPost.category}
              </span>
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl transition-all"
              >
                닫기 ✕
              </button>
            </div>
            
            <div className="overflow-y-auto p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                  <span>날짜: {selectedPost.date}</span>
                  <span>|</span>
                  <span>작성자: {selectedPost.author}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {selectedPost.title}
                </h2>
              </div>

              {selectedPost.imageUrl && (
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-850">
                  <img 
                    src={selectedPost.imageUrl} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-light py-2">
                {selectedPost.content || selectedPost.excerpt}
              </div>
            </div>

            {selectedPost.url && (
              <div className="p-6 border-t border-slate-800 bg-[#161616] flex justify-end">
                <a 
                  href={selectedPost.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-accent hover:brightness-110 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-accent/25"
                >
                  블로그 상세 링크로 이동 &rarr;
                </a>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
