import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Search, 
  Calendar, 
  Loader2,
  ArrowLeft,
  Youtube,
  ExternalLink,
  Settings,
  Plus,
  PenTool
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { storage } from '../services/storage';
import { Post } from '../types';
import { DEFAULT_VIDEOS } from '../constants';

const VideoBoard: React.FC = () => {
  const [videos, setVideos] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const user = storage.getUser();
  const isAdmin = user?.isAdmin === true || ['sonfrom@gmail.com', 'son3u@daum.net'].includes(user?.email?.toLowerCase() || '');

  useEffect(() => {
    const fetchVideoPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .eq('category', 'video')
          .order('id', { ascending: false });

        if (error) throw error;

        // Separate channel and normal videos to maintain channel at index 0
        const channelVideo = DEFAULT_VIDEOS.find(v => v.id === "v-channel");
        const otherDefaultVideos = DEFAULT_VIDEOS.filter(v => v.id !== "v-channel");

        if (data && data.length > 0) {
          const mapped: Post[] = data.map((p: any) => ({
            id: p.id,
            title: p.title || '',
            content: p.content || '',
            excerpt: p.excerpt || '',
            category: 'video',
            date: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            author: p.author || '관리자',
            imageUrl: p.image_url || undefined,
            youtubeUrl: p.youtube_url || p.post_url || ''
          }));

          // Exclude channel if there are any duplicate IDs
          const dbVideos = mapped.filter(v => v.id !== "v-channel");
          const sortedOthers = [...dbVideos, ...otherDefaultVideos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const merged = channelVideo ? [channelVideo, ...sortedOthers] : sortedOthers;
          setVideos(merged);
        } else {
          const sortedOthers = [...otherDefaultVideos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const sorted = channelVideo ? [channelVideo, ...sortedOthers] : sortedOthers;
          setVideos(sorted);
        }
      } catch (err) {
        console.error('Error fetching video posts from Supabase:', err);
        const channelVideo = DEFAULT_VIDEOS.find(v => v.id === "v-channel");
        const otherDefaultVideos = DEFAULT_VIDEOS.filter(v => v.id !== "v-channel");
        const sortedOthers = [...otherDefaultVideos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const sorted = channelVideo ? [channelVideo, ...sortedOthers] : sortedOthers;
        setVideos(sorted);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoPosts();
  }, []);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">홈으로 돌아가기</span>
        </Link>

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">영상자료실</h1>
            </div>
            <p className="text-slate-400 text-lg font-light max-w-xl leading-relaxed">
              광주시민연대의 생생한 활동 모습과 <br />
              다양한 교육, 문화 및 특별 강연 영상을 한곳에 수집했습니다.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="영상 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/50 border border-slate-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 w-full md:w-64"
              />
            </div>
            {isAdmin && (
              <Link 
                to="/admin"
                className="bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 shadow-lg shadow-accent/5 cursor-pointer font-sans"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>영상 업로드</span>
              </Link>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-slate-500 text-sm font-light">영상 자료를 가져옵니다...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video, idx) => {
              const vId = getYoutubeId(video.youtubeUrl || '');
              const isChannel = video.id === 'v-channel';
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`border overflow-hidden group transition-all flex flex-col h-full rounded-3xl ${
                    isChannel 
                      ? "bg-accent/5 border-accent/20 hover:border-accent/40 shadow-lg shadow-accent/5" 
                      : "bg-[#141414] border-slate-800 hover:border-accent/30"
                  }`}
                >
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img 
                      src={video.imageUrl || (vId ? `https://img.youtube.com/vi/${vId}/hqdefault.jpg` : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop")} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    {video.youtubeUrl && (
                      <a 
                        href={video.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                          <Play className="w-8 h-8 fill-current text-white" />
                        </div>
                      </a>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {isChannel && (
                        <div className="mb-2 text-accent text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                          공식 미디어 채널
                        </div>
                      )}
                      <h3 className="text-base font-bold text-white leading-snug group-hover:text-accent transition-colors mb-3 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-slate-400 text-xs font-light mb-6 line-clamp-2 leading-relaxed">
                        {video.excerpt || video.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 font-bold text-[9px] uppercase tracking-widest text-slate-500">
                      {isChannel ? (
                        <>
                          <span className="flex items-center gap-1.5 text-accent font-extrabold"><Youtube className="w-3.5 h-3.5 text-red-500 animate-pulse" /> OFFICIAL CHANNEL</span>
                          <a 
                            href={video.youtubeUrl || "https://www.youtube.com/@gjpp"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-white transition-colors cursor-pointer underline decoration-dotted"
                          >
                            채널구독
                          </a>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1.5"><Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube Record</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {video.date}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 border border-slate-800 rounded-3xl bg-slate-900/10">
            <Play className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-light text-sm">등록된 영상 리스트가 비어 있거나 필터링 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoBoard;
