import { motion } from 'motion/react';
import { ArrowRight, Calendar, User, Tag, ChevronRight, ExternalLink, MessageSquare, Send, Play, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';

export default function Home() {
  const settings = storage.getSettings();
  const posts = storage.getPosts().slice(0, 3);

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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-8 text-white whitespace-pre-line">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {posts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => post.url && window.open(post.url, '_blank')}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-xl mb-6 relative border border-slate-800 ring-1 ring-white/5 group-hover:ring-accent/50 transition-all duration-500">
                <img 
                  src={post.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-0.5 bg-accent/80 backdrop-blur-md rounded text-[9px] font-bold uppercase tracking-wider text-white">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 font-light leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
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
                { title: '인권 증진 및 공익 지원', desc: '사회적 약자의 존엄성 보호를 위한 제도 개선, 인권 교육 및 상담 지원' },
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
            {[
              {
                title: "광주참여자치시민연대, '광주시 도시개발사업' 투명성 확보 촉구 성명",
                source: "씨티뉴스",
                date: "2024-03-20",
                url: "https://blog.naver.com/gjct21/223389210541"
              },
              {
                title: "광주시민연대, '경기도 광주시의회 의정비 인상안' 재고 요청",
                source: "경인일보",
                date: "2024-02-15",
                url: "https://blog.naver.com/gjct21/223354210100"
              }
            ].map((news, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => window.open(news.url, '_blank')}
                className="bg-[#141414] border border-slate-800 p-8 rounded-2xl hover:border-accent/40 transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-accent uppercase tracking-widest">{news.source}</span>
                    <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{news.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors leading-tight mb-4">
                    {news.title}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 aspect-video bg-[#141414] border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                <Play className="w-8 h-8 fill-current" />
              </div>
              <h4 className="text-xl font-bold text-white">현장 스케치 & 라이브</h4>
              <p className="text-slate-500 text-sm font-light">광주참여자치시민연대의 다양한 <br />현장 활동 기록을 확인하세요.</p>
            </div>
            <div className="aspect-square md:aspect-auto bg-[#141414] border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4">
              <Youtube className="w-10 h-10 text-slate-700" />
              <h4 className="text-white font-bold">교육/강연</h4>
              <p className="text-slate-500 text-xs font-light">다양한 주제의 <br />강연 영상을 제공합니다.</p>
            </div>
            <div className="aspect-square md:aspect-auto bg-[#141414] border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4">
              <ExternalLink className="w-10 h-10 text-slate-700" />
              <h4 className="text-white font-bold">언론 보도</h4>
              <p className="text-slate-500 text-xs font-light">미디어에 비친 <br />우리의 발자취입니다.</p>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141414] border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 py-16">
              <MessageSquare className="w-10 h-10 text-accent/50" />
              <h4 className="text-white font-bold">자유로운 소통</h4>
              <p className="text-slate-500 text-sm font-light leading-relaxed">지역 사회에 대한 제안이나 <br />개인적인 의견을 나누세요.</p>
            </div>
            <div className="bg-[#141414] border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 py-16">
              <Send className="w-10 h-10 text-accent/50" />
              <h4 className="text-white font-bold">생생한 소식</h4>
              <p className="text-slate-500 text-sm font-light leading-relaxed">시민들이 전하는 우리 동네의 <br />작고 큰 소식들을 확인하세요.</p>
            </div>
            <div className="bg-accent/5 border border-accent/20 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-6 py-16">
              <p className="text-white text-sm font-medium leading-relaxed">로그인 후 누구나 <br />글을 작성할 수 있습니다.</p>
              <Link 
                to="/board"
                className="bg-accent text-white px-6 py-2 rounded-full font-bold text-xs"
              >
                지금 글쓰기
              </Link>
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
    </div>
  );
}
