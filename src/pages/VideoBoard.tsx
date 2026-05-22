import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  X, 
  Upload,
  Loader2,
  ArrowLeft,
  Youtube,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface VideoPost {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string | null;
  authorName: string;
  authorId: string;
  createdAt: any;
}

const VideoBoard: React.FC = () => {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', description: '', youtubeUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = user?.email === 'sonfrom@gmail.com';

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const unsubscribeVideos = onSnapshot(q, (snapshot) => {
      const videosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoPost[];
      setVideos(videosData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching videos:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeVideos();
    };
  }, []);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !newVideo.title || !newVideo.youtubeUrl) return;

    const videoId = getYoutubeId(newVideo.youtubeUrl);
    if (!videoId) {
      alert("올바른 유튜브 URL을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'videos'), {
        title: newVideo.title,
        description: newVideo.description,
        youtubeUrl: newVideo.youtubeUrl,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        authorName: user?.displayName || 'Admin',
        authorId: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewVideo({ title: '', description: '', youtubeUrl: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding video:", error);
      alert("영상 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin || !window.confirm("정말 이 영상을 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
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
              <h1 className="text-4xl font-bold text-white tracking-tight">영상자료실</h1>
            </div>
            <p className="text-slate-400 text-lg font-light max-w-xl">
              광주참여자치시민연대의 활동 모습과 <br />
              다양한 교육 및 강연 영상을 한곳에 모았습니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="영상 검색..."
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
                영상 등록
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-slate-500 text-sm font-light">영상 자료를 불러오는 중...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video, idx) => {
              const vId = getYoutubeId(video.youtubeUrl);
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#141414] border border-slate-800 rounded-3xl overflow-hidden group hover:border-accent/30 transition-all"
                >
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img 
                      src={video.thumbnail || `https://img.youtube.com/vi/${vId}/hqdefault.jpg`} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <a 
                      href={video.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                        <Play className="w-8 h-8 fill-current" />
                      </div>
                    </a>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className="text-lg font-bold text-white leading-tight group-hover:text-accent transition-colors">
                        {video.title}
                      </h3>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(video.id)}
                          className="text-slate-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm font-light mb-6 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 font-bold text-[10px] uppercase tracking-widest text-slate-600">
                      <span className="flex items-center gap-1.5"><Youtube className="w-3 h-3" /> YouTube</span>
                      <span>{video.createdAt ? format(video.createdAt.toDate(), 'yyyy.MM.dd', { locale: ko }) : ''}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
            <Play className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-light">등록된 영상이 없습니다.</p>
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
                <h2 className="text-xl font-bold text-white">새 영상 등록</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">영상 제목</label>
                  <input 
                    required
                    type="text" 
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    placeholder="영상 제목을 입력하세요"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">유튜브 URL</label>
                  <div className="relative">
                    <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                    <input 
                      required
                      type="url" 
                      value={newVideo.youtubeUrl}
                      onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">설명</label>
                  <textarea 
                    rows={4}
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    placeholder="영상에 대한 설명을 입력하세요"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/50 resize-none"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    disabled={submitting}
                    type="submit"
                    className="bg-accent text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    영상 등록하기
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

export default VideoBoard;
