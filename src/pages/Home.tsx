import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, User, Tag, ChevronRight, ExternalLink, MessageSquare, Send, Play, Youtube, Loader2, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import { DEFAULT_VIDEOS } from '../constants';
import { newsItems } from './News';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function Home() {
  const settings = storage.getSettings();
  const [posts, setPosts] = useState<Post[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [homeVideos, setHomeVideos] = useState<Post[]>(DEFAULT_VIDEOS.slice(0, 3));
  const [boardPosts, setBoardPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getArticleUrl = (newsItem: { url: string; title: string }) => {
    if (!newsItem.url || newsItem.url === '#' || newsItem.url.includes('kocus.com')) {
      // kocus.com article indices recycle over time. Searching the title on Naver is the most accurate way to present the correct press coverage.
      return `https://search.naver.com/search.naver?query=${encodeURIComponent(newsItem.title)}`;
    }
    return newsItem.url;
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // 1. Fetch activities
        const { data: actData, error: actErr } = await supabase
          .from('community_posts')
          .select('*')
          .eq('category', 'activity')
          .order('id', { ascending: false })
          .limit(3);

        if (actErr) throw actErr;

        let dbMapped: Post[] = [];
        if (actData && actData.length > 0) {
          dbMapped = actData.map((p: any) => ({
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

        // 2. Fetch news
        const { data: newsData, error: newsErr } = await supabase
          .from('community_posts')
          .select('*')
          .eq('category', 'news')
          .order('id', { ascending: false });

        let dbNewsMapped: any[] = [];
        if (newsData && newsData.length > 0) {
          dbNewsMapped = newsData.map((p: any) => ({
            id: p.id,
            title: p.title || '',
            source: p.source || '참여자치연대',
            date: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            url: p.post_url || '#',
            excerpt: p.excerpt || p.content || ''
          }));
        }

        const mergedNews = [...dbNewsMapped, ...newsItems]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4);
        setNews(mergedNews);

        // 3. Fetch videos
        try {
          const { data: videoData, error: videoErr } = await supabase
            .from('community_posts')
            .select('*')
            .eq('category', 'video')
            .order('id', { ascending: false });

          const channelVideo = DEFAULT_VIDEOS.find(v => v.id === "v-channel");
          const otherDefaultVideos = DEFAULT_VIDEOS.filter(v => v.id !== "v-channel");

          if (videoData && videoData.length > 0) {
            const mappedVideos = videoData.map((p: any) => ({
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

            const dbVideos = mappedVideos.filter(v => v.id !== "v-channel");
            const sortedOthers = [...dbVideos, ...otherDefaultVideos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const merged = channelVideo ? [channelVideo, ...sortedOthers] : sortedOthers;
            setHomeVideos(merged.slice(0, 3));
          } else {
            const sortedOthers = [...otherDefaultVideos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const sorted = channelVideo ? [channelVideo, ...sortedOthers] : sortedOthers;
            setHomeVideos(sorted.slice(0, 3));
          }
        } catch (vErr) {
          console.error('Error fetching videos in Home:', vErr);
          const channelVideo = DEFAULT_VIDEOS.find(v => v.id === "v-channel");
          const otherDefaultVideos = DEFAULT_VIDEOS.filter(v => v.id !== "v-channel");
          const sortedOthers = [...otherDefaultVideos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const sorted = channelVideo ? [channelVideo, ...sortedOthers] : sortedOthers;
          setHomeVideos(sorted.slice(0, 3));
        }

        // 4. Fetch board posts from Firebase
        try {
          const boardQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5));
          const boardSnapshot = await getDocs(boardQuery);
          const fetchedBoardPosts = boardSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || '',
              content: data.content || '',
              authorName: data.authorName || '익명',
              createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
            };
          });
          setBoardPosts(fetchedBoardPosts);
        } catch (boardError) {
          console.error("Error fetching board posts in Home:", boardError);
        }

      } catch (err) {
        console.error('Error fetching home data:', err);
        const localActBackup = storage.getPosts();
        const mergedAct: Post[] = [];
        for (const lp of localActBackup) {
          if (mergedAct.length >= 3) break;
          mergedAct.push({ ...lp, category: '활동소식' });
        }
        setPosts(mergedAct);
        
        const sortedStaticNews = [...newsItems]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4);
        setNews(sortedStaticNews);

        const channelVideo = DEFAULT_VIDEOS.find(v => v.id === "v-channel");
        const otherDefaultVideos = DEFAULT_VIDEOS.filter(v => v.id !== "v-channel");
        const sortedOthers = [...otherDefaultVideos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const sorted = channelVideo ? [channelVideo, ...sortedOthers] : sortedOthers;
        setHomeVideos(sorted.slice(0, 3));

        // Fallback fetch
        try {
          const boardQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5));
          const boardSnapshot = await getDocs(boardQuery);
          const fetchedBoardPosts = boardSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || '',
              content: data.content || '',
              authorName: data.authorName || '익명',
              createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
            };
          });
          setBoardPosts(fetchedBoardPosts);
        } catch (bErr) {
          console.error("Error fetching board posts fallback:", bErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="bg-[#0A0A0A] text-slate-200 pt-16">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-[#0A0A0A]" />
          <div 
            className="w-full h-full bg-cover bg-center opacity-30 scale-105 animate-[pulse_8s_infinite]"
            style={{ backgroundImage: 'url("https://imgnews.pstatic.net/image/032/2022/10/18/0003180216_001_20250522073506658.jpg?type=w860")' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block px-3 py-1 rounded bg-accent/20 text-accent text-[10px] font-bold tracking-widest uppercase mb-6 border border-accent/30">
              참여 민주주의, 광주의 미래
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.1] mb-8 text-white whitespace-pre-line">
              {settings.homepageHeroTitle}
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light max-w-2xl">
              {settings.homepageHeroSub}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/activity"
                className="px-8 py-3.5 bg-accent text-white rounded font-bold hover:brightness-110 transition-all flex items-center gap-2 group text-sm"
              >
                활동 참여하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/about"
                className="px-8 py-3.5 bg-slate-800/50 backdrop-blur-md text-white rounded font-bold hover:bg-slate-800 transition-all border border-slate-700 text-sm"
              >
                단체 소개 보기
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-[1px] h-12 bg-white animate-[bounce_2s_infinite]" />
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* Featured Posts */}
      <section id="activity-section" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">최근 활동 소식</h2>
            <p className="text-slate-500">{settings.name}의 생생한 현장 소식을 전합니다.</p>
          </div>
          <Link 
            to="/activity" 
            className="text-accent text-sm font-bold flex items-center gap-1 hover:brightness-110 transition-all border border-accent/20 px-4 py-2 rounded"
          >
            전체 보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-sm font-light">최신 활동 소식을 불러오고 있습니다...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-light border border-slate-900 rounded-3xl bg-[#0F0F0F] text-sm">
            등록된 활동소식이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer bg-[#0F0F0F]/60 border border-slate-900 rounded-3xl p-6 hover:border-accent/40 transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-xl mb-6 relative border border-slate-800 ring-1 ring-white/5 group-hover:ring-accent/50 transition-all duration-500">
                  <img 
                    src={post.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 font-light leading-relaxed">
                    {post.excerpt || post.content}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Values/Mission */}
      <section className="bg-[#0F0F0F] border-y border-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tighter text-white">
              우리가 지키고자 하는<br /><span className="text-accent">참여의 가치</span>
            </h2>
            <div className="space-y-10">
              {[
                { title: '권력 감시 및 정책 연구', desc: '국가와 지방 권력의 투명성과 책임성 제고를 위한 모니터링 및 정책 연구' },
                { title: '평화 실현 및 평화 교육', desc: '전쟁 없는 평화 사회를 위한 연구, 시민 교육 및 평화 문화 확산 사업' },
                { title: '인권 증진 및 공익 지원', desc: '사회적 약자의 존엄성 보호를 위한 제도 개선, 인권 공익 활동 지원' },
                { title: '역사 계승 및 미래세대 지원', desc: '역사적 진실을 올바르게 기억하고 계승하기 위한 청년/청소년 참여 지원' },
                { title: '문화 및 연대 활동', desc: '시민평화축제(기림제) 기획·운영 및 국내외 시민단체와의 연대 활동' },
                { title: '생태 환경 및 기후 정의', desc: 'RE100 에너지 전환 및 자원 순환 정책 등 환경 실천 사업' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-10 h-10 shrink-0 rounded bg-slate-800/50 border border-slate-700 flex items-center justify-center text-accent text-sm font-bold group-hover:bg-accent group-hover:text-white transition-all">
                    {i+1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-slate-400 leading-relaxed text-sm font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-slate-800 grayscale active:grayscale-0 hover:grayscale-0 transition-all duration-700 shadow-2xl">
              <img 
                src="https://imgnews.pstatic.net/image/032/2022/10/18/0003180216_001_20250522073506658.jpg?type=w860" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute top-10 -right-10 bg-[#141414] border border-slate-800 p-8 rounded shadow-2xl space-y-2 max-w-[240px]">
              <p className="text-3xl font-bold text-white tracking-tighter">100+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Activists</p>
              <p className="text-xs font-light text-slate-400 leading-relaxed">회원들과 활동가들이 함께 민주주의를 지키고 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0C0C0C]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-accent" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Press Coverage</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">언론에 비친 <span className="text-slate-400 font-light">시민연대</span></h2>
              <p className="text-slate-500 font-light">주요 언론 보도를 통해 보는 광주참여자치의 발자취입니다.</p>
            </div>
            <Link 
              to="/news" 
              className="text-accent text-sm font-bold flex items-center gap-1 hover:brightness-110 transition-all border border-accent/20 px-4 py-2 rounded"
            >
              전체 기사 보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => window.open(getArticleUrl(item), '_blank')}
                className="bg-[#141414] border border-slate-800 p-8 rounded-2xl hover:border-accent/40 transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-accent uppercase tracking-widest">{item.source}</span>
                    <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors leading-tight mb-4">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-accent text-[11px] font-bold uppercase tracking-widest mt-4">
                  기사 전문 보기 <ExternalLink className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Archive Section Preview */}
      <section className="py-24 px-6 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-accent" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Archive</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">활동 <span className="text-slate-400 font-light">영상자료</span></h2>
              <p className="text-slate-500 font-light">현장의 생생한 목소리와 활동을 영상으로 만나보세요.</p>
            </div>
            <Link 
              to="/videos" 
              className="text-accent text-sm font-bold flex items-center gap-1 hover:brightness-110 transition-all border border-accent/20 px-4 py-2 rounded"
            >
              영상자료실 이동 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeVideos.map((video, idx) => {
              const vId = getYoutubeId(video.youtubeUrl || '');
              const isChannel = video.id === 'v-channel';
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`border overflow-hidden group transition-all flex flex-col rounded-3xl ${
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
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                          <Play className="w-7 h-7 fill-current text-white" />
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
                      <h3 className="text-base font-bold text-white leading-snug group-hover:text-accent transition-colors mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-slate-400 text-xs font-light mb-4 line-clamp-2 leading-relaxed">
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
                            className="text-accent group-hover:text-white transition-colors cursor-pointer underline decoration-dotted"
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
        </div>
      </section>

      {/* Community Board Section Preview */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-accent" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Community</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">시민 <span className="text-slate-400 font-light">자유게시판</span></h2>
              <p className="text-slate-500 font-light">시민 여러분의 소중한 목소리를 기다립니다.</p>
            </div>
            <Link 
              to="/board" 
              className="text-accent text-sm font-bold flex items-center gap-1 hover:brightness-110 transition-all border border-accent/20 px-4 py-2 rounded"
            >
              게시판 바로가기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-[#111111] border border-slate-900 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  최근 올라온 글
                </h3>
                
                {boardPosts && boardPosts.length > 0 ? (
                  <div className="space-y-4">
                    {boardPosts.map((bp) => (
                      <Link 
                        key={bp.id}
                        to="/board"
                        className="group flex sm:flex-row flex-col sm:items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-3 rounded-lg transition-all gap-1"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <h4 className="text-sm font-semibold text-slate-200 group-hover:text-accent transition-colors truncate">
                            {bp.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-light block mt-1">
                            {bp.content ? (bp.content.substring(0, 70) + (bp.content.length > 70 ? "..." : "")) : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 text-right self-end sm:self-center">
                          <span className="text-xs text-slate-400 font-medium">{bp.authorName || '익명'}</span>
                          <span className="text-[11px] text-slate-500 font-light">
                            {bp.createdAt ? format(bp.createdAt instanceof Date ? bp.createdAt : new Date(bp.createdAt), 'yyyy.MM.dd') : ''}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 font-light text-sm">
                    최근 자유게시판에 작성된 글이 없습니다.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#141414] border border-slate-800 p-8 rounded-2xl flex flex-col justify-between items-center text-center space-y-6 py-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center text-accent mx-auto">
                  <PenTool className="w-5 h-5" />
                </div>
                <h4 className="text-white font-bold">참여와 소통의 광장</h4>
                <p className="text-slate-400 text-xs font-light leading-relaxed max-w-xs mx-auto">
                  광주시민연대 회원 및 일반 시민 누구나 회원 가입 후 자유롭게 의견을 보태고 지역 소식을 나눌 수 있습니다.
                </p>
              </div>
              <div className="w-full space-y-3">
                <Link 
                  to="/board"
                  className="block w-full text-center bg-accent hover:bg-accent-focus text-white py-3 rounded-xl font-bold text-xs transition-colors"
                >
                  지금 글쓰기
                </Link>
                <p className="text-[10px] text-slate-600 font-light">
                  ※ 건전한 소통을 위해 로그인 후 작성 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white tracking-tight">변화를 만드는 용기, <br />당신의 참여로부터 시작됩니다.</h2>
        <p className="text-lg text-slate-400 mb-12 font-light">지금 {settings.name}의 회원이 되어 정의롭고 투명한 광주를 함께 만들어가세요.</p>
        <button 
          onClick={() => settings.donationUrl && window.open(settings.donationUrl, '_blank')}
          className="px-10 py-4 bg-white text-black rounded font-bold hover:bg-slate-200 transition-colors text-sm"
        >
          정기후원 참여하기
        </button>
      </section>

      {/* Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] border border-slate-850 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <span className="px-2.5 py-1 bg-accent/80 backdrop-blur-md text-white rounded text-[10px] font-bold uppercase tracking-widest">
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
}
