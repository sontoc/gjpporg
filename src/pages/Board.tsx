import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  X, 
  Send,
  Loader2,
  Lock,
  ArrowLeft,
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

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: any;
}

const Board: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.title || !newPost.content) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        title: newPost.title,
        content: newPost.content,
        authorName: user.displayName || 'Anonymous',
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewPost({ title: '', content: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding post:", error);
      alert("글 작성에 실패했습니다. (보안 규칙을 확인해주세요)");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
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
                <MessageSquare className="w-5 h-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">자유게시판</h1>
            </div>
            <p className="text-slate-400 text-lg font-light max-w-xl">
              시민 여러분의 자유로운 의견을 나누는 공간입니다. <br />
              따뜻한 소통과 건전한 비판을 환영합니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="검색어 입력..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 w-full md:w-64"
              />
            </div>
            {user ? (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 shadow-lg shadow-accent/5 cursor-pointer font-sans"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>글쓰기</span>
              </button>
            ) : (
              <button 
                onClick={() => signInWithGoogle()}
                className="bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer font-sans"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>로그인 후 작성</span>
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-slate-500 text-sm font-light">게시글을 불러오는 중...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#141414] border border-slate-800 p-6 rounded-2xl hover:border-accent/30 transition-all group"
              >
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors capitalize">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm font-light mb-6 line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {post.authorName}</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> 
                      {post.createdAt ? format(post.createdAt.toDate(), 'yyyy.MM.dd', { locale: ko }) : '방금 전'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
            <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-light">작성된 게시글이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Write Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
                <h2 className="text-xl font-bold text-white">새 글 작성</h2>
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
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="제목을 입력하세요"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">내용</label>
                  <textarea 
                    required
                    rows={8}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="여러분의 소중한 의견을 적어주세요"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 resize-none"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    disabled={submitting}
                    type="submit"
                    className="bg-accent text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    글 게시하기
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

export default Board;
