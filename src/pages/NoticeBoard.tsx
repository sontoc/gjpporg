import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  X, 
  Send,
  Loader2,
  Lock,
  ArrowLeft,
  Megaphone,
  ExternalLink,
  PenTool
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { db, auth, signInWithGoogle } from '../lib/firebase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';

interface Notice {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  priority: boolean;
  createdAt: any;
  url?: string;
}

const DEFAULT_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: '2026 광주시민연대 정기총회',
    content: '2026년 광주시민연대 정기총회 개최 관련 기록입니다. 올 한 해 동안 나아갈 단체 운영 방향을 정립하고, 주요 추진 사업 보고와 내부 민주적 의사결정을 성공적으로 진행하였습니다. 주민자치와 투명한 정치를 위한 시민 여러분의 관심과 지지를 모으는 자리가 되었습니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: true,
    createdAt: new Date('2026-03-15'),
    url: 'https://blog.naver.com/gjct21/224244740416'
  },
  {
    id: 'n2',
    title: '시민&회원들과 함께하는 광주시민연대 차담회',
    content: '회원 및 일반 시민 여러분과의 따뜻한 소통을 위한 차담회를 개최하였습니다. 단체의 전반적인 활동 현황을 편안하게 나누고, 다양한 지역 현안에 대한 생생한 의견 수렴 및 향후 행사의 밑그림을 그리는 유익한 간담회 형태의 대화의 밤이었습니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: false,
    createdAt: new Date('2024-11-20'),
    url: 'https://blog.naver.com/gjct21/223872209986'
  },
  {
    id: 'n3',
    title: '광주시민연대 긴급성명서',
    content: '최근 대두되고 있는 중대한 지역 또는 사회 현안과 관련하여 광주시민연대의 깊은 깊이의 결의를 담은 긴급 성명을 발표하였습니다. 특정 정책이나 불합리한 사건에 대해 감시와 책임 경영의 기치에서 시민단체의 공식적 입장을 확고히 공표하는 내용입니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: false,
    createdAt: new Date('2024-05-10'),
    url: 'https://blog.naver.com/gjct21/223681791083'
  },
  {
    id: 'n4',
    title: '회원여론조사 (사업 및 활동 설문 결과)',
    content: '광주시민연대의 올바른 가치 지향과 구체적 활동 계획 설정을 조력받고자 진행한 전수 회원 설문조사 결과 보고서입니다. 본 설문 결과를 충실히 기반 삼아 주민 복리와 자치에 한걸음 더 성숙하게 다가서는 사업 및 운영 개선안을 성실히 이끌어 내겠습니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: false,
    createdAt: new Date('2022-11-18'),
    url: 'https://blog.naver.com/gjct21/222930077762'
  },
  {
    id: 'n5',
    title: '이태원 참사 관련 성명서',
    content: '이태원 참사에 부쳐 흘리는 깊은 애도와 함께 시민사회의 공식적인 입장 및 안전 사회 실현 성명을 발표했습니다. 재발 방지에 대한 책임자 처벌 및 사회적 보호 시스템 정립을 강력 촉구하는 목소리를 담고 있습니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: false,
    createdAt: new Date('2022-11-10'),
    url: 'https://blog.naver.com/gjct21/222925603176'
  },
  {
    id: 'n6',
    title: '광주시민연대 창립 보도참고자료',
    content: '자랑스러운 경기 광주시 최초의 시민 주도 무정파 시민운동 단체인 "광주시민연대"의 정식 공식 출범을 성원리에 공론화하는 보도참고자료입니다. 난개발 저지, 예산 감시, 민주 시민성 제고 등 올바른 출범의 기치와 취지를 소중히 안내합니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: true,
    createdAt: new Date('2022-10-18'),
    url: 'https://blog.naver.com/gjct21/222925603176'
  },
  {
    id: 'n7',
    title: '광주시민연대 1차 이사회',
    content: '단체 창립 후 개최된 첫 번째 정식 집합 이사회의 결과입니다. 이사회 조직 체계를 더욱 밀도 높게 구상하고, 초기 추진 사업 및 회계 전산 계획, 회원 조직 전파 계획 등의 핵심 안건을 공식 의결하며 발전을 도모하였습니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: false,
    createdAt: new Date('2022-10-28'),
    url: 'https://blog.naver.com/gjct21/222913026854'
  },
  {
    id: 'n8',
    title: '광주시민연대 창립식 사진',
    content: '설레는 마음으로 가득했던 광주시민연대 창립식 현장의 기록용 생동감 있는 사진 모음입니다. 수많은 시민이 한 자리에 서서 축하와 성원을 보내주신 역사의 한 페이지를 고스란히 남기며, 발주 행사의 따스하고 장엄한 분위기를 함께 공유하고자 합니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: false,
    createdAt: new Date('2022-10-19'),
    url: 'https://blog.naver.com/gjct21/222903774886'
  },
  {
    id: 'n9',
    title: '손봉호 교수 특별강연 “세상을 바꾸는 시민”',
    content: '석학 손봉호 서울대 명예교수를 초청하여 진행된 "세상을 바꾸는 시민" 특별 명사 강연회 소식입니다. 시민으로서의 도덕적 의무와 공동체 지성의 중요성, 민주주의의 기둥인 시민 운동이 세상을 어떻게 투명하게 개선하는지 심도 있게 호소한 강론을 안내해 드립니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: false,
    createdAt: new Date('2022-10-14'),
    url: 'https://blog.naver.com/gjct21/222899110739'
  },
  {
    id: 'n10',
    title: '광주시민연대 창립식 현수막 게시',
    content: '광주시민연대 창립식을 경기 광주시 일대 및 곳곳에 널리 안내하고 홍보하기 위한 수려한 거리 현수막 게시 경위 안내입니다. 더 많은 일반 주민들이 애정을 담아 자발적인 역사의 시작에 참여할 수 있도록 널리 가교 역할을 다해주었습니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: false,
    createdAt: new Date('2022-10-08'),
    url: 'https://blog.naver.com/gjct21/222894835793'
  },
  {
    id: 'n11',
    title: '광주참여자치시민연대 소개 글',
    content: '우리가 지켜야 할 아름답고 자긍심 높은 보금자리인 광주시의 자치 분권, 건강한 견제 소식입니다. 광주참여자치시민연대(광주시민연대)의 설립 취지문, 설립 목적, 향후 활동 방향을 진중하게 풀어서 기술한 전체 길동무 소개 자료입니다.',
    authorName: '관리자',
    authorId: 'admin',
    priority: false,
    createdAt: new Date('2022-09-24'),
    url: 'https://blog.naver.com/gjct21/222882744959'
  }
];

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: false });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dual auth check: check for verified administrator roles
  const localUser = storage.getUser();
  const isAdmin = localUser?.isAdmin === true || 
    ['sonfrom@gmail.com', 'son3u@daum.net'].includes(localUser?.email?.toLowerCase() || '') ||
    ['sonfrom@gmail.com', 'son3u@daum.net'].includes(user?.email?.toLowerCase() || '');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, 'notices'), orderBy('priority', 'desc'), orderBy('createdAt', 'desc'));
    const unsubscribeNotices = onSnapshot(q, (snapshot) => {
      const dbNotices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notice[];
      
      const combined = [...dbNotices];
      // Append default notices if they aren't already written to database
      DEFAULT_NOTICES.forEach(defNotice => {
        if (!combined.some(n => n.id === defNotice.id || n.title === defNotice.title)) {
          combined.push(defNotice);
        }
      });

      // Sort notices: first by priority, then by date descending
      combined.sort((a, b) => {
        if (a.priority && !b.priority) return -1;
        if (!a.priority && b.priority) return 1;
        
        const dateA = a.createdAt ? (typeof a.createdAt.toDate === 'function' ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date();
        const dateB = b.createdAt ? (typeof b.createdAt.toDate === 'function' ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date();
        return dateB.getTime() - dateA.getTime();
      });

      setNotices(combined);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notices:", error);
      // Fallback to default notices if database is offline or not ready
      const sortedDefaults = [...DEFAULT_NOTICES].sort((a, b) => {
        if (a.priority && !b.priority) return -1;
        if (!a.priority && b.priority) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setNotices(sortedDefaults);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeNotices();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !newNotice.title || !newNotice.content) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'notices'), {
        title: newNotice.title,
        content: newNotice.content,
        priority: newNotice.priority,
        authorName: user?.displayName || 'Admin',
        authorId: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewNotice({ title: '', content: '', priority: false });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding notice:", error);
      alert("공지 작성에 실패했습니다. 관리자 권한을 확인해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNotices = notices.filter(notice => 
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">홈으로 돌아가기</span>
        </Link>

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                <Bell className="w-5 h-5" />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">공지사항</h1>
            </div>
            <p className="text-slate-400 text-lg font-light max-w-xl">
              광주참여자치시민연대의 중요 소식과 안내를 <br />
              가장 빠르게 전해드립니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="공지 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 w-full md:w-64"
              />
            </div>
            {isAdmin && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 shadow-lg shadow-accent/5 cursor-pointer font-sans"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>공지 작성</span>
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-slate-500 text-sm font-light">공지사항을 불러오는 중...</p>
          </div>
        ) : filteredNotices.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredNotices.map((notice, idx) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-[#141414] border ${notice.priority ? 'border-accent/40 shadow-[0_0_20px_rgba(var(--accent-rgb),0.05)]' : 'border-slate-800'} p-6 rounded-2xl hover:border-accent/30 transition-all group ${notice.url ? 'cursor-pointer hover:bg-slate-900/50' : ''}`}
                onClick={() => {
                  if (notice.url) {
                    window.open(notice.url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors flex items-center gap-2">
                    {notice.priority && <Megaphone className="w-4 h-4 text-accent shrink-0" />}
                    <span className={notice.url ? 'group-hover:underline decoration-accent/60' : ''}>{notice.title}</span>
                  </h3>
                  {notice.priority && (
                    <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Important</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm font-light mb-6 line-clamp-3 leading-relaxed">
                  {notice.content}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {notice.authorName}</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> 
                      {(() => {
                        if (!notice.createdAt) return '방금 전';
                        try {
                          if (typeof notice.createdAt.toDate === 'function') {
                            return format(notice.createdAt.toDate(), 'yyyy.MM.dd', { locale: ko });
                          }
                          const dateObj = notice.createdAt instanceof Date ? notice.createdAt : new Date(notice.createdAt);
                          return format(dateObj, 'yyyy.MM.dd', { locale: ko });
                        } catch (err) {
                          console.error(err);
                          return '방금 전';
                        }
                      })()}
                    </span>
                  </div>
                  {notice.url && (
                    <a 
                      href={notice.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent hover:text-white text-xs font-semibold px-3 py-1.5 border border-accent/20 rounded-full hover:bg-accent/10 transition-all shadow-sm"
                    >
                      <span>블로그 원문보기</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
            <Bell className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-light">등록된 공지사항이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Write Modal - Only for Admins */}
      <AnimatePresence>
        {isModalOpen && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#141414] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">중요 공지 작성</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">제목</label>
                  <input 
                    required
                    type="text" 
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    placeholder="공지 제목을 입력하세요"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">내용</label>
                  <textarea 
                    required
                    rows={8}
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    placeholder="공지 내용을 상세히 입력하세요"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    id="priority"
                    checked={newNotice.priority}
                    onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-accent focus:ring-accent"
                  />
                  <label htmlFor="priority" className="text-sm text-slate-400 font-light cursor-pointer">
                    상단 고정 (핀) 설정
                  </label>
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    disabled={submitting}
                    type="submit"
                    className="bg-accent text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5" />}
                    공지 게시하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoticeBoard;
