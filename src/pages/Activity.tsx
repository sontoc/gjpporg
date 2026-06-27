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
    { id: "vol-35", name: "2026년 봄호 (통권 제35호)", isCurrent: false }
  ];

  // Static webzine issues with structured articles
  const webzineIssues = [
    {
      id: "vol-36",
      name: "2026년 여름호",
      volume: "통권 제36호",
      isCurrent: true,
      coverUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800",
      description: "뜨거운 계절, 시민의 참여로 조각하는 자치분권과 예산 감시 현황을 전해드립니다.",
      articles: [
        {
          id: "web-36-1",
          title: "권력감시와 참된 자치: 경기도 광주시 자치 분석 리포트",
          excerpt: "지방자치단체의 예산 집행과 의정 활동을 시민의 시각에서 평가하고 투명한 재정 운영을 위한 대안을 모색합니다.",
          content: "지방자치제도가 도입된 지 수십 년이 흘렀지만 여전히 행정의 밀실 결정과 무분별한 예산 집행에 대한 시민들의 우려가 큽니다. 광주시민연대 예산 감시 위원회는 지난 분기 동안의 주요 재정 집행 내역을 분석하여, 불필요한 개발 사업에 낭비되는 예산과 정작 필요한 교육, 복지 인프라에 소홀한 부분을 집중적으로 지목했습니다. 시민이 직접 참여하는 투명한 예산 행정만이 참된 자치를 실현하는 지름길입니다. 여러분의 성원과 감시의 눈길이 필요합니다.",
          category: "권력감시/행동",
          date: "2026-06-15",
          author: "예산분석팀 홍길동",
          imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800"
        },
        {
          id: "web-36-2",
          title: "기억과 미래: 세대를 잇는 인권·평화 시민교육을 개막하며",
          excerpt: "과거의 아픔을 보듬고 평화로운 미래로 나아가기 위한 학생 및 시민 참여형 역사 기억하기 프로젝트의 여정을 전합니다.",
          content: "역사를 기억하지 않는 민족에게 미래는 없다는 말이 있습니다. 광주시민연대는 이번 여름을 맞이하여 경기도 광주시 나눔의 집 및 평화의 소녀상과 연계한 시민교육 프로그램을 시작합니다. 청소년들과 일반 시민들이 함께 참여하여 수요시위를 참관하고 과거의 상처를 따뜻한 인권 의식으로 채워 넣는 이 배움의 길은 단순한 지식 전달을 넘어 우리 이웃과의 적극적인 공감대를 형성하는 기회입니다. 더 많은 시민들의 참가를 기다립니다.",
          category: "시민교육/인권",
          date: "2026-06-10",
          author: "인권교육팀 김철수",
          imageUrl: "https://cdn.litt.ly/images/RFD8lmckgdVLiJ4g6MQEvhiPPqOTJHHr"
        },
        {
          id: "web-36-3",
          title: "주민자치회 활성화를 위한 조례 개정안 해설",
          excerpt: "시민이 주인이 되는 마을 공동체를 일구기 위한 제도적 뒷받침인 주민자치 조례의 쟁점과 향후 전망을 살펴봅니다.",
          content: "마을의 주인은 주민이며, 주민자치회는 그 목소리를 공식적으로 담는 그릇입니다. 최근 발의된 경기도 광주시 주민자치회 설치 및 활성화 조례 개정안은 기존의 형식적인 운영에서 벗어나 실질적인 권한과 예산 분배를 명문화하는 획기적인 내용을 담고 있습니다. 이번 기고에서는 주민들의 직접 제안이 예산안에 반영되는 주민참여예산과의 연계 방안을 깊이 있게 다루고, 다른 모범 지자체들의 선진 사례들을 검토해 보았습니다. 진정한 풀뿌리 민주주의를 우리 동네에서부터 가꾸어 나갑시다.",
          category: "공동체/자치",
          date: "2026-06-05",
          author: "자치연구소 이영희",
          imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800"
        }
      ]
    },
    {
      id: "vol-35",
      name: "2026년 봄호",
      volume: "통권 제35호",
      isCurrent: false,
      coverUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800",
      description: "도약하는 봄날의 활기찬 기운을 담아, 정기총회 결과보고 및 시민 평화 강연 소식을 수록했습니다.",
      articles: [
        {
          id: "web-35-1",
          title: "2026년 정기총회 보고: 도약하는 광주시민연대",
          excerpt: "회원들의 열띤 참여와 의결로 확정된 올 한 해 핵심 활동 방향과 시민 참여 채널 확장 계획을 소개합니다.",
          content: "지난 봄 개최된 2026년 정기총회는 광주시민연대의 새로운 미래 비전을 공표하는 자리가 되었습니다. 회원들의 만장일치로 통과된 새해 사업안은 기후위기 대응 마을 행동, 청년 자치 포럼 활성화, 그리고 격월간 디지털 웹진의 전면 개편을 포함하고 있습니다. 정부의 보조금을 단 1원도 받지 않고 오직 깨어 있는 시민들의 후원금으로만 자립 운영되는 우리 연대의 자부심을 다시 한번 확인했습니다. 동반자 여러분께 진심으로 고개 숙여 감사드립니다.",
          category: "공동체/자치",
          date: "2026-04-20",
          author: "사무처 박민우",
          imageUrl: "https://postfiles.pstatic.net/MjAyNjA0MDhfMiAg/MDAxNzc1NjAxMzk4OTQ5.t5fVguRy1vU6v1Qk6Hd-J4JISYvSgQFzYHxgguWuITcg.qfhLPB0a5OMGbkcj6oIhU-y_C2qgOfhXYBjOnnAcHzgg.PNG/2026_%EA%B4%91%EC%A3%BC%EC%8B%9C%EB%AF%BC%EC%97%B0%EB%8C%80_%EC%B4%9D%ED%9A%8C.png?type=w773"
        },
        {
          id: "web-35-2",
          title: "풀뿌리 시민활동과 세금 감시: 왜 우리의 감시가 멈추지 않아야 하는가",
          excerpt: "지역 정치와 권력에 대한 상시적 감시망 구축을 위해 시민 연대가 가져야 할 태도와 연대의 방향성을 고찰합니다.",
          content: "권력은 감시받지 않을 때 부패하고 자치는 참여하지 않을 때 박제됩니다. 우리는 왜 매주 지자체의 주요 정책과 예산안을 분석하고 보도자료를 낼까요? 그것은 시민의 피땀 어린 세금이 공정하고 정의롭게 쓰이도록 만드는 최소한의 안전장치이기 때문입니다. 한 사람의 목소리는 작지만 시민연대의 이름으로 뭉친 우리들의 성명과 행동은 시정을 올바른 방향으로 움직이는 견고한 지렛대가 됩니다. 올 봄에도 투명한 광주를 만들기 위한 감시 행동은 계속됩니다.",
          category: "권력감시/행동",
          date: "2026-04-10",
          author: "예산감시팀 정선아",
          imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800"
        },
        {
          id: "web-35-3",
          title: "인권과 평화의 감수성을 기르는 현장: 나눔의 집 방문 소회",
          excerpt: "역사 교육의 요람인 나눔의 집에서 나눈 시민들과의 대화, 그리고 평화로운 내일을 향한 실천적 소회를 공유합니다.",
          content: "봄바람이 부는 주말, 시민들과 함께 경기 광주시 퇴촌면에 위치한 나눔의 집을 찾았습니다. 할머니들의 생생한 역사적 증언이 깃든 전시실을 돌아보며, 우리가 누리는 평화와 인권이 얼마나 값진 희생 위에 서 있는지 다시금 뼈저리게 느꼈습니다. 단순한 슬픔을 넘어, 인권 유린이 되풀이되지 않도록 청소년들에게 바른 역사를 교육하고 연대의 불꽃을 피워 올리는 것이 오늘을 살아가는 우리의 소명입니다. 소중한 여정에 동참해주신 모든 시민들께 감사드립니다.",
          category: "시민교육/인권",
          date: "2026-04-05",
          author: "교육회원 최윤정",
          imageUrl: "https://cdn.litt.ly/images/sTf7jd1Q5hsMa0O8seqfrnEnARV8FR7Z"
        }
      ]
    }
  ];

  // Helper to calculate mock reading time
  const getReadingTime = (content: string) => {
    const textLength = content ? content.length : 100;
    const minutes = Math.ceil(textLength / 250);
    return `${minutes}분 분량`;
  };

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
              격월간 발행
            </div>
          </div>

          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-none">
                활동소식 <span className="text-accent">웹진</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed max-w-2xl">
                {settings.name}에서 격월로 발행하는 디지털 매거진 및 생생한 활동 보고입니다. 시민의 눈으로 관찰하고, 시민의 입으로 말하며, 행동으로 세상을 바꿉니다.
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

        {/* Syncing spinner in background */}
        {isSyncing && (
          <div className="mb-6 text-[10px] text-accent font-semibold flex items-center gap-2 justify-end">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>최신 웹진 호수 및 소식 동기화 중...</span>
          </div>
        )}

        <div className="space-y-16">
          
          {/* SECTION 1: 시민연대 활동소식 (Activity News) */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center font-bold text-sm">
                  📢
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">시민연대 활동소식</h2>
                  <p className="text-slate-500 text-xs mt-0.5">광주시민연대의 따끈따끈한 최근 소식과 활동 보고서</p>
                </div>
              </div>
              <div className="text-[11px] font-bold text-purple-400 bg-purple-500/5 border border-purple-500/20 px-3 py-1 rounded-md self-start sm:self-auto">
                최근 소식 (전체 3개)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((post, idx) => {
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
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={handleArticleClick}
                    className="group cursor-pointer flex flex-col justify-between h-full bg-[#0F0F0F]/60 border border-slate-900 hover:border-slate-800 p-5 rounded-2xl transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="space-y-4">
                      <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shrink-0 relative border border-transparent ring-1 ring-white/5 group-hover:border-accent transition-all duration-300 bg-slate-900">
                        <img 
                          src={post.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
                          referrerPolicy="no-referrer"
                          alt={post.title}
                        />
                        <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-[8px] font-bold tracking-widest text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                          {post.category}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                          <span className="flex items-center gap-1 font-medium"><Calendar className="w-2.5 h-2.5" /> {post.date}</span>
                          <span>|</span>
                          <span className="font-medium">By {post.author}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-accent transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-slate-400 text-xs font-light leading-relaxed line-clamp-3">
                          {post.excerpt || post.content}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-light flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {getReadingTime(post.content || '')}
                      </span>
                      <span className="text-accent text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        소식 읽기 <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: 디지털 웹진 (Digital Webzine) */}
          <section className="space-y-6 pt-6 border-t border-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center font-bold text-sm">
                  📖
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">디지털 웹진</h2>
                  <p className="text-slate-500 text-xs mt-0.5">시민의 다채로운 목소리가 한데 깃든 격월간 소통 매거진</p>
                </div>
              </div>
              <div className="text-[11px] font-bold text-accent bg-accent/5 border border-accent/20 px-3 py-1 rounded-md self-start sm:self-auto">
                2026년 발행 호수 (전체 2개)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {webzineIssues.map((issue) => (
                <div 
                  key={issue.id}
                  className="bg-[#0F0F0F] border border-slate-850 hover:border-accent/30 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Issue Cover Header with background image */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900 border-b border-slate-850">
                    <img 
                      src={issue.coverUrl} 
                      alt={issue.name}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-[1.03] transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-black/35" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      {issue.isCurrent && (
                        <span className="bg-red-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                          LATEST 🔥
                        </span>
                      )}
                      <span className="bg-slate-850/90 text-slate-200 border border-slate-700 font-bold text-[9px] px-2 py-0.5 rounded shadow">
                        {issue.volume}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-accent transition-colors">
                        {issue.name}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1 font-light line-clamp-1">{issue.description}</p>
                    </div>
                  </div>

                  {/* Article Table of Contents list */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-900 pb-2">
                        이번 호 주요 실린 글 목차
                      </p>
                      
                      <div className="space-y-3">
                        {issue.articles.map((article) => (
                          <div
                            key={article.id}
                            onClick={() => setSelectedPost({
                              id: article.id,
                              title: article.title,
                              excerpt: article.excerpt,
                              content: article.content,
                              category: article.category,
                              date: article.date,
                              author: article.author,
                              imageUrl: article.imageUrl
                            })}
                            className="p-3 bg-black/30 hover:bg-accent/5 border border-slate-900 hover:border-accent/25 rounded-xl cursor-pointer transition-all flex items-start gap-3 group/item"
                          >
                            <span className="mt-1 px-1.5 py-0.5 bg-slate-800 text-[9px] text-slate-300 rounded font-semibold whitespace-nowrap">
                              {article.category}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover/item:text-accent transition-colors truncate">
                                {article.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                                <span>필자: {article.author}</span>
                                <span>•</span>
                                <span>{article.date}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover/item:text-accent self-center transition-transform group-hover/item:translate-x-0.5" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPost({
                        id: issue.articles[0].id,
                        title: issue.articles[0].title,
                        excerpt: issue.articles[0].excerpt,
                        content: issue.articles[0].content,
                        category: issue.articles[0].category,
                        date: issue.articles[0].date,
                        author: issue.articles[0].author,
                        imageUrl: issue.articles[0].imageUrl
                      })}
                      className="w-full py-2.5 bg-slate-900 hover:bg-accent text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-800 hover:border-accent transition-all cursor-pointer text-center"
                    >
                      {issue.name} 대표 기사 바로 읽기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Widgets Grid Footer Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-900">
            {/* Webzine Newsletter Subscribe Widget */}
            <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                  <Mail className="w-4 h-4" />
                </div>
                <h4 className="text-white font-bold text-sm sm:text-base">웹진 정기 구독 신청</h4>
              </div>
              <p className="text-slate-400 text-xs font-light leading-relaxed">
                매달 발행되는 알찬 참여 소식과 권력감시 리포트를 이메일로 받아보세요. (무료 신청)
              </p>

              {emailSubscribed ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/10 border border-accent/30 p-2.5 rounded-xl text-center text-accent text-xs font-bold"
                >
                  구독 신청이 안전하게 완료되었습니다! 📬
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input 
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="이메일 주소 입력"
                    className="flex-1 bg-black/40 border border-slate-800 focus:border-accent text-white text-xs px-3.5 py-2 rounded-lg focus:outline-none transition-all placeholder:text-slate-600"
                  />
                  <button 
                    type="submit"
                    className="py-2 px-4 bg-accent text-white font-bold text-xs rounded-lg hover:brightness-110 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    무료 구독
                  </button>
                </form>
              )}
            </div>

            {/* Submitting Manuscript Column */}
            <div className="border border-slate-900 rounded-2xl p-6 bg-[#0B0B0B] flex flex-col justify-between space-y-3">
              <div>
                <p className="text-[9px] text-accent font-bold tracking-widest uppercase">Reader Contribution</p>
                <h4 className="text-xs sm:text-sm font-bold text-white mt-1">시민 필진 / 원고 모집</h4>
                <p className="text-slate-500 text-xs font-light leading-relaxed mt-2">
                  광주 지역의 생활 자치 현안, 독자 투고, 활동 소회를 나누고 싶은 시민은 누구나 필진으로 참여하실 수 있습니다.
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-900 pt-2 mt-2">
                <span>문의 및 접수:</span>
                <span className="text-accent">{settings.contactEmail || "gjpp4u@gmail.com"}</span>
              </div>
            </div>
          </div>

        </div>
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
              <span className="px-2.5 py-1 bg-accent/25 text-accent border border-accent/30 rounded text-[10px] font-bold uppercase tracking-widest">
                상세 소식 및 기사 보기
              </span>
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
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
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                  {selectedPost.title}
                </h2>
              </div>

              {selectedPost.imageUrl && (
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-850 bg-slate-950">
                  <img 
                    src={selectedPost.imageUrl} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    alt={selectedPost.title}
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
                  상세 웹링크 바로가기 &rarr;
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

