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
  Megaphone
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

interface Notice {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  priority: boolean;
  createdAt: any;
}

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: false });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Simple admin check based on email from config/runtime
  const isAdmin = user?.email === 'sonfrom@gmail.com';

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, 'notices'), orderBy('priority', 'desc'), orderBy('createdAt', 'desc'));
    const unsubscribeNotices = onSnapshot(q, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notice[];
      setNotices(noticesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notices:", error);
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
                className="bg-accent text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-accent/20 shrink-0"
              >
                <Plus className="w-4 h-4" />
                공지 작성
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
                className={`bg-[#141414] border ${notice.priority ? 'border-accent/40 shadow-[0_0_20px_rgba(var(--accent-rgb),0.05)]' : 'border-slate-800'} p-6 rounded-2xl hover:border-accent/30 transition-all group`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors flex items-center gap-2">
                    {notice.priority && <Megaphone className="w-4 h-4 text-accent shrink-0" />}
                    {notice.title}
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
                      {notice.createdAt ? format(notice.createdAt.toDate(), 'yyyy.MM.dd', { locale: ko }) : '방금 전'}
                    </span>
                  </div>
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
