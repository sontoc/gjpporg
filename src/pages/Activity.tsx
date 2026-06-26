import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, ArrowLeft, Loader2, PenTool, Compass, BookOpen, Layers, Mail, Clock, BookOpenCheck, Filter, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

const ActivityPage: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>(() => {
    // Initializer to display local cached items immediately (0 second delay)
    const localActBackup = storage.getPosts();
    const mergedAct: Post[] = [];
    for (const lp of localActBackup) {
      if (mergedAct.length >= 6) break; // Allow more items in webzine grid
      mergedAct.push({ ...lp, category: '활동소식' });
    }
    return mergedAct;
  });
  
  const [loading, setLoading] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [selectedIssue, setSelectedIssue] = React.useState<string>("vol-36");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [emailSubscribed, setEmailSubscribed] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState("");

  const settings = storage.getSettings();
  const user = storage.getUser();
  const isAdmin = user?.isAdmin === true || ['sonfrom@gmail.com', 'son3u@daum.net'].includes(user?.email?.toLowerCase() || '');

  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);

  React.useEffect(() => {
    const loadActivityPosts = async () => {
      setIsSyncing(true);
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .eq('category', 'activity')
          .order('id', { ascending: false });

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
          const isDup = mergedAct.some(m => m.title === lp.title || m.id === lp.id);
          if (!isDup) {
            mergedAct.push({ ...lp, category: '활동소식' });
          }
        }
        setPosts(mergedAct);
      } catch (err) {
        console.warn('[Activity] Note: Activities fetched from local fallback. Supabase connection bypassed:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    loadActivityPosts();
  }, []);

  // Webzine issues list
  const issues = [
    { id: "vol-36", name: "2026년 여름호 (통권 제36호)", isCurrent: true },
    { id: "vol-35", name: "2026년 봄호 (통권 제35호)", isCurrent: false },
    { id: "vol-34", name: "2025년 겨울호 (통권 제34호)", isCurrent: false }
  ];

  // Helper to categorize articles dynamically for realistic webzine feel
  const getWebzineCategory = (title: string): string => {
    if (title.includes('총회') || title.includes('이사회')) return '공동체/의사결정';
    if (title.includes('교육') || title.includes('배움')) return '시민교육/인권';
    if (title.includes('감시') || title.includes('예산') || title.includes('성명')) return '권력감시/행동';
    return '시민사회동향';
  };

  // Helper to calculate mock reading time
  const getReadingTime = (content: string) => {
    const textLength = content ? content.length : 100;
    const minutes = Math.ceil(textLength / 250);
    return `${minutes}분 분량`;
  };

  // Static content mapping based on selected issues for high quality interactive experience
  const getFilteredPosts = () => {
    let list = [...posts];
    
    // Filter by issue (for demonstration & interactivity, we distribute articles between issues)
    if (selectedIssue === "vol-35") {
      list = list.slice(1, 4); // Show some articles as previous issue
    } else if (selectedIssue === "vol-34") {
      list = list.slice(2, 5); // Show different ones for vol-34
    }

    // Filter by Webzine category tag
    if (activeCategory !== "all") {
      list = list.filter(p => {
        const cat = getWebzineCategory(p.title);
        return (activeCategory === "watch" && cat === '권력감시/행동') ||
               (activeCategory === "edu" && cat === '시민교육/인권') ||
               (activeCategory === "community" && cat === '공동체/의사결정') ||
               (activeCategory === "trend" && cat === '시민사회동향');
      });
    }

    return list;
  };

  const filteredPosts = getFilteredPosts();
  const coverStory = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const standardArticles = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setEmailSubscribed(true);
    setEmailInput("");
    setTimeout(() => setEmailSubscribed(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">홈으로 돌아가기</span>
        </Link>
        
        {/* Webzine Edition Masthead */}
        <div className="border-b border-slate-800 pb-8 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold tracking-[0.2em] uppercase">
              <BookOpenCheck className="w-4 h-4 animate-pulse" />
              <span>Gwangju Citizens Solidarity Webzine</span>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold bg-[#111111] px-3 py-1 rounded-full border border-slate-800">
              격월간 발행 | 제36호 (2026년 여름호)
            </div>
          </div>

          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                웹진 <span className="text-accent">참여의 소리</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                {settings.name}에서 격월로 발행하는 디지털 매거진입니다. 시민의 눈으로 관찰하고, 시민의 입으로 말하며, 시민의 행동으로 세상을 조각합니다.
              </p>
            </div>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 shadow-lg shadow-accent/5 cursor-pointer font-sans"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>소식 및 원고 작성</span>
              </Link>
            )}
          </header>
        </div>

        {/* Issue & Category Selectors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-[#0F0F0F] border border-slate-900 rounded-2xl p-4">
          {/* Issue Tab Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 호수 선택:
            </span>
            {issues.map(iss => (
              <button
                key={iss.id}
                onClick={() => {
                  setSelectedIssue(iss.id);
                  setActiveCategory("all");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedIssue === iss.id 
                    ? "bg-accent text-white shadow-lg shadow-accent/20" 
                    : "bg-[#161616] text-slate-400 hover:text-slate-200"
                }`}
              >
                {iss.name} {iss.isCurrent && "🔥"}
              </button>
            ))}
          </div>

          {/* Webzine Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> 대주제:
            </span>
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeCategory === "all" ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveCategory("watch")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeCategory === "watch" ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              권력감시/행동
            </button>
            <button
              onClick={() => setActiveCategory("edu")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeCategory === "edu" ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              시민교육/인권
            </button>
            <button
              onClick={() => setActiveCategory("community")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeCategory === "community" ? "text-accent border-b-2 border-accent" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              공동체/자치
            </button>
          </div>
        </div>

        {/* Syncing spinner in background */}
        {isSyncing && (
          <div className="mb-6 text-[10px] text-accent font-semibold flex items-center gap-2 justify-end">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>최신 웹진 호수 및 소식 동기화 중...</span>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center text-slate-500 font-light border border-slate-900 rounded-3xl bg-[#0F0F0F] text-sm">
            선택하신 호수 및 카테고리에 발행된 웹진 기사가 없습니다. 다른 조건의 기사를 탐색해보세요.
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Cover Story / Featured Main Article (Large Editorial Hero Layout) */}
            {coverStory && activeCategory === "all" && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => {
                  if (coverStory.url) {
                    window.open(coverStory.url, '_blank', 'noopener,noreferrer');
                  } else {
                    setSelectedPost(coverStory);
                  }
                }}
                className="group cursor-pointer bg-[#0F0F0F] border border-slate-850 rounded-3xl overflow-hidden shadow-2xl hover:border-accent/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[300px] bg-black overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-850">
                  <img 
                    src={coverStory.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"} 
                    alt={coverStory.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded shadow-lg">
                    COVER STORY 🌟
                  </div>
                </div>
                
                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-accent/15 text-accent border border-accent/25 rounded text-[10px] font-extrabold uppercase tracking-wider">
                        {getWebzineCategory(coverStory.title)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {getReadingTime(coverStory.content || '')}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight group-hover:text-accent transition-colors">
                      {coverStory.title}
                    </h2>

                    <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed line-clamp-4">
                      {coverStory.excerpt || coverStory.content}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-850 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-accent/25 border border-accent/30 flex items-center justify-center font-bold text-white text-xs">
                        {coverStory.author.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-white">필자: {coverStory.author}</p>
                        <p className="text-[10px] text-slate-500">{coverStory.date} 발행</p>
                      </div>
                    </div>
                    <span className="text-accent text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                      기사 전문 읽기 <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Standard Webzine Editorial Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Side: Editorial Articles list */}
              <div className="lg:col-span-8 space-y-12">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
                  <BookOpen className="w-5 h-5 text-accent" />
                  <span>이번 호 주요 실린 글 목록</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(activeCategory !== "all" ? filteredPosts : standardArticles).map((post, idx) => {
                    const handleArticleClick = () => {
                      if (post.url) {
                        window.open(post.url, '_blank', 'noopener,noreferrer');
                      } else {
                        setSelectedPost(post);
                      }
                    };

                    return (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={handleArticleClick}
                        className="group cursor-pointer flex flex-col justify-between h-full bg-[#0F0F0F]/60 border border-slate-900 hover:border-slate-800 p-5 rounded-2xl transition-all duration-300 hover:shadow-xl"
                      >
                        <div className="space-y-4">
                          <div className="w-full aspect-[16/9] rounded-xl overflow-hidden shrink-0 relative border border-transparent ring-1 ring-white/5 group-hover:border-accent transition-all duration-300">
                            <img 
                              src={post.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-[8px] font-bold tracking-widest text-slate-300 px-2 py-0.5 rounded">
                              {getWebzineCategory(post.title)}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                              <span className="flex items-center gap-1 font-medium"><Calendar className="w-2.5 h-2.5" /> {post.date}</span>
                              <span>|</span>
                              <span className="font-medium">By {post.author}</span>
                            </div>
                            <h4 className="text-base font-bold text-white group-hover:text-accent transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-slate-400 text-xs font-light leading-relaxed line-clamp-3">
                              {post.excerpt || post.content}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-light flex items-center gap-1"><Clock className="w-3 h-3" /> {getReadingTime(post.content || '')}</span>
                          <span className="text-accent text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            기사 읽기 <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Editorial Columns & Newsletter signup */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Editor's Note widget */}
                <div className="bg-[#0F0F0F] border border-slate-850 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-accent font-black text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4 text-accent" />
                    <span>이번 호 편집자 에세이</span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">"시민의 작은 용기가 한데 모여 큰 파도를 이룹니다"</h4>
                  <p className="text-slate-400 text-xs font-light leading-relaxed">
                    민주주의의 본질은 언제나 성실한 참여와 건강한 비판의 목소리에 있습니다. 이번 호에서는 2026년 정기총회 보고와 인권평화 교육 프로젝트 등 생동감 넘치는 주민자치 현장 소식을 한데 묶어 전합니다. 변화를 이끄는 가장 따뜻한 원동력, 바로 여러분입니다.
                  </p>
                  <p className="text-[10px] text-slate-500 text-right font-medium italic">- 웹진 편집 위원회 배상</p>
                </div>

                {/* Webzine Newsletter Subscribe Widget */}
                <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-2xl p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-bold text-base">웹진 정기 구독 신청</h4>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">
                      매달 발행되는 알찬 참여 소식과 권력감시 리포트를 이메일로 받아보세요. (무료 신청)
                    </p>
                  </div>

                  {emailSubscribed ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-accent/10 border border-accent/30 p-3 rounded-xl text-center text-accent text-xs font-bold"
                    >
                      구독 신청이 안전하게 완료되었습니다! 📬
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <input 
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="이메일 주소를 입력하세요"
                        className="w-full bg-black/40 border border-slate-800 focus:border-accent text-white text-xs px-3.5 py-2.5 rounded-lg focus:outline-none transition-all placeholder:text-slate-600"
                      />
                      <button 
                        type="submit"
                        className="w-full py-2.5 bg-accent text-white font-bold text-xs rounded-lg hover:brightness-110 transition-colors shadow-lg shadow-accent/10 cursor-pointer"
                      >
                        무료 정기 구독하기
                      </button>
                    </form>
                  )}
                </div>

                {/* Submitting Manuscript Column */}
                <div className="border border-slate-900 rounded-2xl p-6 bg-[#0B0B0B] text-center space-y-3">
                  <p className="text-[10px] text-accent font-bold tracking-widest uppercase">Reader Contribution</p>
                  <h4 className="text-xs font-bold text-white">시민 필진 / 원고 모집</h4>
                  <p className="text-slate-500 text-[11px] font-light leading-relaxed">
                    광주 지역의 생활 자치 현안, 독자 투고, 활동 소회를 나누고 싶은 시민은 누구나 필진으로 참여하실 수 있습니다.
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold">문의: {settings.contactEmail || "gjpp4u@gmail.com"}</p>
                </div>

              </div>

            </div>

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
                웹진 기사
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
                  <span>발행일자: {selectedPost.date}</span>
                  <span>|</span>
                  <span>집필위원: {selectedPost.author}</span>
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
                  블로그 기사 상세 링크 &rarr;
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
