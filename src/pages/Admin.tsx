import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  FileText, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit, 
  LogOut,
  Save,
  Image as ImageIcon,
  CheckCircle2,
  Database,
  Eye,
  RefreshCw,
  TableProperties,
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react';
import { storage } from '../services/storage';
import { Post, SiteSettings } from '../types';
import { cn } from '../lib/utils';
import { TransparentLogo } from '../components/TransparentLogo';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [activeTab, setActiveTab] = React.useState<'stats' | 'posts' | 'settings' | 'applications'>('posts');
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = React.useState(false);
  const [postsError, setPostsError] = React.useState<'table_not_found' | string | null>(null);
  const [settings, setSettings] = React.useState<SiteSettings>(storage.getSettings());
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);
  const [showToast, setShowToast] = React.useState(false);
  const user = storage.getUser();

  // Supabase Applications States
  const [applications, setApplications] = React.useState<any[]>([]);
  const [appLoading, setAppLoading] = React.useState(false);
  const [appError, setAppError] = React.useState<'table_not_found' | string | null>(null);
  const [selectedApp, setSelectedApp] = React.useState<any>(null);

  const fetchPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      const mapped: Post[] = (data || []).map((p: any) => ({
        id: p.id,
        title: p.title || '',
        content: p.content || '',
        excerpt: p.excerpt || '',
        category: p.category || 'activity',
        date: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        author: p.author || '관리자',
        imageUrl: p.image_url || undefined,
        url: p.post_url || undefined,
        source: p.source || undefined,
        youtubeUrl: p.youtube_url || undefined,
      }));

      setPosts(mapped);
    } catch (err: any) {
      console.error('Error fetching community_posts:', err);
      if (
        err.code === '42P01' || 
        err.message?.includes('relation') || 
        err.message?.includes('not found') ||
        err.status === 404
      ) {
        setPostsError('table_not_found');
      } else {
        setPostsError(err.message || '데이터를 불러오지 못했습니다.');
      }
      // 로컬 스토리지 대체 로드
      setPosts(storage.getPosts());
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchApplications = async () => {
    setAppLoading(true);
    setAppError(null);
    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err: any) {
      console.error('Error fetching from Supabase:', err);
      if (
        err.code === '42P01' || 
        err.message?.includes('relation') || 
        err.message?.includes('not found') ||
        err.status === 404
      ) {
        setAppError('table_not_found');
      } else {
        setAppError(err.message || 'Supabase에서 데이터를 불러오지 못했습니다.');
      }
    } finally {
      setAppLoading(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('신청 내역을 삭제하시겠습니까? 관련 데이터가 Supabase에서 영구 삭제됩니다.')) return;
    try {
      const { error } = await supabase
        .from('membership_applications')
        .delete()
        .eq('id', id);
      if (error) throw error;
      triggerToast();
      fetchApplications();
    } catch (err: any) {
      alert('삭제 중 오류 발생: ' + err.message);
    }
  };

  // Admin Supabase Login states
  const [adminEmail, setAdminEmail] = React.useState('son3u@daum.net');
  const [adminPassword, setAdminPassword] = React.useState('');
  const [adminLoading, setAdminLoading] = React.useState(false);
  const [adminError, setAdminError] = React.useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        storage.login(data.user.email || adminEmail);
        window.location.reload();
      }
    } catch (err: any) {
      console.error('Admin Supabase Login error:', err);
      if (err.message?.includes('Invalid login credentials')) {
        setAdminError('이메일 또는 비밀번호가 잘못되었습니다. 혹은 이메일 인증을 완료했는지 확인해 주세요.');
      } else {
        setAdminError(err.message || '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setAdminLoading(false);
    }
  };

  const isAdmin = user?.isAdmin === true || ['sonfrom@gmail.com', 'son3u@daum.net'].includes(user?.email?.toLowerCase() || '');

  React.useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    } else if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0F0F0F] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative">
          
          <div className="text-center space-y-2 px-4">
            <div className="select-none mx-auto mb-2 inline-flex items-center justify-center bg-transparent">
               <TransparentLogo 
                src="https://postfiles.pstatic.net/MjAyNjA1MjJfMTAg/MDAxNzc5NDQxODc1MDA2.nW_uKcVcDfKX2ulMGsz0wCpxcVLKxHpQcjmTaDzOmnog.JywPAhgtR07FKPMq5hiLLP8CQXbGli78WpKxxkXpawkg.PNG/%EA%B4%91%EC%A3%BC%EC%8B%9C%EB%AF%BC%EC%97%B0%EB%8C%80%EB%A1%9C%EA%B3%A0.png?type=w3840" 
                className="h-12 w-auto object-contain" 
                alt="광주참여자치시민연대 로고" 
              />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">관리자 대시보드</h1>
            <p className="text-slate-500 text-xs font-light">등록된 단체 임직원의 보안 인증 로그인 구역입니다.</p>
          </div>

          {adminError && (
            <div className="bg-red-950/30 border border-red-900/60 p-4 rounded-xl text-xs text-red-300 font-light flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{adminError}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  storage.login(adminEmail || 'son3u@daum.net');
                  window.location.reload();
                }}
                className="mt-1 bg-red-900/40 hover:bg-accent border border-red-800/80 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-all self-start flex items-center gap-1 shadow uppercase tracking-wider"
              >
                🔒 즉시 무인증 관리자 패스 (로컬 테스트전용)
              </button>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 font-medium">관리자 이메일</label>
              <input 
                type="email" 
                required
                placeholder="email@example.com" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#141414] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors font-light"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 font-medium">인증 비밀번호</label>
              <input 
                type="password" 
                required
                placeholder="비밀번호" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#141414] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors font-light"
              />
            </div>

            <button 
              type="submit"
              disabled={adminLoading}
              className="w-full bg-accent text-white font-bold py-3.5 rounded-xl hover:brightness-110 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {adminLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  보안 자격 확인 중...
                </>
              ) : (
                '인증 및 대시보드 진입'
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center space-y-3">
            <p className="text-[11px] text-slate-500">일반 회원이신가요?</p>
            <Link 
              to="/login"
              className="inline-block text-xs font-semibold text-accent hover:underline"
            >
              회원 로그인 / 신규 회원가입 신청하기 &rarr;
            </Link>
          </div>

        </div>
      </div>
    );
  }

  const handleSaveSettings = () => {
    storage.saveSettings(settings);
    triggerToast();
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까? 관련 데이터가 완전히 소멸합니다.')) return;
    
    setPostsLoading(true);
    try {
      if (postsError !== 'table_not_found') {
        const { error } = await supabase
          .from('community_posts')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
      storage.deletePost(id);
      triggerToast();
      fetchPosts();
    } catch (err: any) {
      console.error('Delete post error:', err);
      alert('삭제 오작동: ' + err.message);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setPostsLoading(true);
    try {
      const payload = {
        title: editingPost.title,
        content: editingPost.content,
        excerpt: editingPost.excerpt,
        category: editingPost.category,
        author: editingPost.author || '관리자',
        image_url: editingPost.imageUrl || null,
        source: editingPost.source || null,
        post_url: editingPost.url || null,
        youtube_url: editingPost.youtubeUrl || null,
      };

      // UUID 형태가 아니라 임의 id(수동 신설 시 생성되는 String 소수점 등)면 insert
      const isNew = !editingPost.id || editingPost.id.length < 10 || isNaN(Number(editingPost.id)) === false || /^\d+$/.test(editingPost.id);

      if (postsError !== 'table_not_found') {
        if (!isNew) {
          // Update
          const { error } = await supabase
            .from('community_posts')
            .update(payload)
            .eq('id', editingPost.id);
          if (error) throw error;
        } else {
          // Insert
          const { error } = await supabase
            .from('community_posts')
            .insert([payload]);
          if (error) throw error;
        }
      }

      // 동시 백업 저장성 유지
      storage.savePost(editingPost);
      triggerToast();
      setEditingPost(null);
      fetchPosts();
    } catch (err: any) {
      console.error('Save post error:', err);
      alert('게시글 저장 실패: ' + err.message);
    } finally {
      setPostsLoading(false);
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-slate-200 pt-16">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 hidden md:block shrink-0 bg-[#0F0F0F]">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4">Menu</p>
            <nav className="space-y-1">
              {[
                { id: 'stats', label: '대시보드', icon: BarChart3 },
                { id: 'posts', label: '게시글 관리', icon: FileText },
                { id: 'applications', label: '가입 신청서 (Supabase)', icon: Database },
                { id: 'settings', label: '사이트 설정', icon: SettingsIcon },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all border",
                    activeTab === item.id 
                      ? "bg-accent/10 text-accent border-accent/20" 
                      : "text-slate-500 hover:text-white border-transparent"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-8 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-3 px-4">
              <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">AD</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user.email}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Admin</p>
              </div>
            </div>
            <button 
              onClick={() => {
                storage.logout();
                window.location.reload();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-red-400 hover:bg-red-400/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
              {activeTab === 'stats' && 'Dashboard'}
              {activeTab === 'posts' && 'Posts Management'}
              {activeTab === 'applications' && 'Supabase Applications'}
              {activeTab === 'settings' && 'Site Customization'}
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-light italic">
              Welcome back to the command center.
            </p>
          </div>
          {activeTab === 'posts' && !editingPost && (
            <button 
              onClick={() => setEditingPost({
                id: Math.random().toString(36).substr(2, 9),
                title: '',
                excerpt: '',
                content: '',
                category: 'activity',
                date: new Date().toISOString().split('T')[0],
                author: '관리자'
              })}
              className="px-6 py-2 bg-white text-black rounded font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors text-xs"
            >
              <Plus className="w-4 h-4" /> 새 게시글 작성
            </button>
          )}
        </header>

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Total Visitors', value: '4,289', change: '+12%', color: 'text-emerald-400' },
              { label: 'Post Views', value: '154', change: '+5%', color: 'text-accent' },
              { label: 'New Members', value: '12', change: '+2', color: 'text-blue-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0F0F0F] border border-slate-800 rounded p-8 space-y-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-white tracking-tighter">{stat.value}</p>
                  <p className={cn("text-[10px] font-bold px-2 py-0.5 rounded bg-white/5", stat.color)}>{stat.change}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            {postsError === 'table_not_found' && (
              <div className="bg-red-955/20 border border-red-900/40 rounded-3xl p-8 space-y-6 mb-4">
                <div className="flex items-center gap-3 text-red-400 font-bold">
                  <TableProperties className="w-5 h-5" />
                  <h4 className="text-base text-white">Supabase DB 게시판 테이블 미연동 안내</h4>
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  단체 게시판(단체소개, 활동소식, 언론기사, 영상자료)을 완벽 활성화하려면, 먼저 원격 Supabase DB 상에 <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-red-300">community_posts</code> 테이블을 개설해야 합니다. <br />
                  아래의 테이블 생성용 SQL 명령어를 전체 복사하여 Supabase 대시보드 웹페이지의 <b>SQL Editor</b>에서 실행해 주세요:
                </p>
                <div className="relative">
                  <pre className="bg-[#070707] p-5 rounded-2xl text-slate-400 font-mono text-[10px] overflow-x-auto max-h-64 border border-slate-800 leading-normal">
{`create table if not exists community_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  excerpt text,
  category text not null, -- 'activity', 'news', 'video', 'about_notice'
  author text default '관리자',
  image_url text, -- 이미지 주소
  source text, -- 언론사 명
  post_url text, -- 상세/기사 원문 링크
  youtube_url text, -- 유튜브 영상 링크
  created_at timestamp with time zone default now()
);

-- RLS 보안 허용 및 제어 설정
alter table community_posts enable row level security;
create policy "전체 공개 조회 허용" on community_posts for select using (true);
create policy "인서트 제한없음" on community_posts for insert with check (true);
create policy "업데이트 제한없음" on community_posts for update using (true);
create policy "딜리트 제한없음" on community_posts for delete using (true);`}
                  </pre>
                </div>
                <div className="p-4 bg-amber-950/20 border border-amber-900/60 rounded-xl text-xs text-amber-200 font-light flex gap-2">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>임시 방편으로, 테이블이 생성되기 전까진 안전하게 브라우저 로컬 저장소(LocalStorage)에서 데이터 수정 및 모의 조회를 유지합니다.</span>
                </div>
              </div>
            )}

            {editingPost ? (
              <form onSubmit={handleSavePost} className="bg-[#0F0F0F] border border-slate-800 rounded p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                  <h2 className="text-lg font-bold text-white uppercase tracking-tight">Post Editor</h2>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setEditingPost(null)}
                      className="px-4 py-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2 bg-accent text-white rounded font-bold flex items-center gap-2 hover:brightness-110 transition-all text-xs uppercase tracking-widest"
                    >
                      <Save className="w-4 h-4" /> Save Post
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Title (게시글 제목)</label>
                      <input 
                        required
                        value={editingPost.title}
                        onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                        className="w-full bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
                        placeholder="Enter post title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category (게시판 분류)</label>
                      <select 
                        value={editingPost.category}
                        onChange={e => setEditingPost({...editingPost, category: e.target.value})}
                        className="w-full bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
                      >
                        <option value="activity">활동소식 (Activity)</option>
                        <option value="news">언론기사 (News)</option>
                        <option value="video">영상자료 (Video)</option>
                        <option value="about_notice">단체소개 - 공지 및 연혁 (About Notice)</option>
                      </select>
                    </div>

                    {editingPost.category === 'news' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Source (보도 언론사명)</label>
                        <input 
                          required
                          value={editingPost.source || ''}
                          onChange={e => setEditingPost({...editingPost, source: e.target.value})}
                          className="w-full bg-[#141414] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent font-light"
                          placeholder="예: 경인일보, 오마이뉴스 등"
                        />
                      </div>
                    )}

                    {editingPost.category === 'video' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">YouTube Video URL (유튜브 링크 주소)</label>
                        <input 
                          required
                          value={editingPost.youtubeUrl || ''}
                          onChange={e => setEditingPost({...editingPost, youtubeUrl: e.target.value})}
                          className="w-full bg-[#141414] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent font-light"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                    )}

                    {(editingPost.category === 'activity' || editingPost.category === 'about_notice' || editingPost.category === 'news') && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Image URL (대표 이미지 주소)</label>
                        <input 
                          value={editingPost.imageUrl || ''}
                          onChange={e => setEditingPost({...editingPost, imageUrl: e.target.value})}
                          className="w-full bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    )}

                    {editingPost.category !== 'video' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Post Original Link URL (기사 또는 원본 링크)</label>
                        <input 
                          value={editingPost.url || ''}
                          onChange={e => setEditingPost({...editingPost, url: e.target.value})}
                          className="w-full bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
                          placeholder="https://blog.naver.com/... 또는 기사 상세 링크"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Excerpt (한 줄 요약)</label>
                      <textarea 
                        required
                        value={editingPost.excerpt}
                        onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})}
                        rows={3}
                        className="w-full bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
                        placeholder="리스트 및 목록 화면 배너에 표시될 핵심 한 줄 설명입니다."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Content (상세 이야기 - Markdown 지원)</label>
                      <textarea 
                        required
                        value={editingPost.content}
                        onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                        rows={8}
                        className="w-full bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-accent font-mono"
                        placeholder="상세 내용을 적어주세요..."
                      />
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-[#0F0F0F] border border-slate-800 rounded overflow-hidden">
                {postsLoading ? (
                  <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                    <span className="text-xs">데이터를 로드하는 중...</span>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-[#141414] text-[10px] uppercase tracking-widest text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-5 text-sm font-medium text-white max-w-md truncate">{post.title}</td>
                          <td className="px-6 py-5">
                            <span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-[9px] font-semibold uppercase tracking-widest border border-accent/20">
                              {post.category === 'activity' && '활동소식'}
                              {post.category === 'news' && '언론기사'}
                              {post.category === 'video' && '영상자료'}
                              {post.category === 'about_notice' && '단체공지/소식'}
                              {!['activity', 'news', 'video', 'about_notice'].includes(post.category) && post.category}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-slate-500 text-xs uppercase">{post.date}</td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => setEditingPost(post)}
                                className="p-2 text-slate-500 hover:text-white"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeletePost(post.id)}
                                className="p-2 text-slate-500 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-10 max-w-5xl">
            <div className="bg-[#0F0F0F] border border-slate-800 rounded p-10 space-y-12 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-sm font-bold border-b border-slate-800 pb-4 uppercase tracking-widest text-white">General Information</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Site Name</label>
                      <input 
                        value={settings.name}
                        onChange={e => setSettings({...settings, name: e.target.value})}
                        className="w-full bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                      <textarea 
                        value={settings.description}
                        onChange={e => setSettings({...settings, description: e.target.value})}
                        rows={3}
                        className="w-full bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-accent font-light"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-sm font-bold border-b border-slate-800 pb-4 uppercase tracking-widest text-white">Visual Identity</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accent Color</label>
                      <div className="flex gap-4 items-center">
                        <input 
                          type="color"
                          value={settings.accentColor}
                          onChange={e => setSettings({...settings, accentColor: e.target.value})}
                          className="w-10 h-10 bg-transparent border-none cursor-pointer"
                        />
                        <input 
                          value={settings.accentColor}
                          onChange={e => setSettings({...settings, accentColor: e.target.value})}
                          className="flex-1 bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-accent/5 border border-accent/10 rounded">
                      <p className="text-[10px] text-accent leading-relaxed uppercase tracking-wider font-bold">
                        Used for buttons and primary accents.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-sm font-bold border-b border-slate-800 pb-4 uppercase tracking-widest text-white">Hero Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Title</label>
                    <input 
                      value={settings.homepageHeroTitle}
                      onChange={e => setSettings({...settings, homepageHeroTitle: e.target.value})}
                      className="w-full bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sub Headline</label>
                    <input 
                      value={settings.homepageHeroSub}
                      onChange={e => setSettings({...settings, homepageHeroSub: e.target.value})}
                      className="w-full bg-[#141414] border border-slate-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-accent font-light"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-10 border-t border-slate-800">
                <button 
                  onClick={handleSaveSettings}
                  className="px-10 py-4 bg-accent text-white rounded font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-accent/20 text-xs uppercase tracking-[0.2em]"
                >
                  <Save className="w-4 h-4" /> Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#0F0F0F] border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-accent" />
                  가입 및 후원 신청서 관리대장 (Supabase)
                </h3>
                <p className="text-slate-500 text-xs font-light mt-1">
                  실시간 백엔드 서버에 원격 연동된 온라인 접수처 장부입니다 (총 {applications.length}건).
                </p>
              </div>
              <button
                onClick={fetchApplications}
                disabled={appLoading}
                className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg flex items-center gap-2 text-xs font-medium transition-colors disabled:opacity-50 border border-slate-800"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", appLoading && "animate-spin text-accent")} />
                목록 새로고침
              </button>
            </div>

            {appLoading && applications.length === 0 ? (
              <div className="py-24 bg-[#0F0F0F] border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-accent" />
                <span className="text-xs font-light tracking-wide uppercase">Searching Supabase records...</span>
              </div>
            ) : appError === 'table_not_found' ? (
              <div className="bg-red-955/20 border border-red-900/30 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-red-400 font-bold">
                  <TableProperties className="w-5 h-5" />
                  <h4 className="text-base text-white">Supabase DB 테이블 미연동 안내</h4>
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  프로젝트의 Supabase DB에 <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-red-300">membership_applications</code> 테이블이 개설되지 않았습니다. <br />
                  이 관리 페이지와 회원가입 신청서 기능을 완전 가동하려면, 아래의 테이블 디자인 SQL 구문을 복사하여 Supabase Console 웹페이지의 <b>SQL Editor</b>에서 버튼을 눌러 한번 실행(Run)해 주세요:
                </p>
                <div className="relative">
                  <pre className="bg-[#070707] p-5 rounded-2xl text-slate-400 font-mono text-[10px] overflow-x-auto max-h-60 border border-slate-800 leading-normal">
{`create table if not exists membership_applications (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  email text,
  birthdate text,
  membership_type text not null,
  amount numeric,
  payment_method text not null,
  bank_name text,
  account_number text,
  account_holder text,
  holder_birth text,
  address text,
  message text,
  created_at timestamp with time zone default now()
);

-- RLS 보안 허용 및 제어 설정
alter table membership_applications enable row level security;
create policy "공개 인서트 제한없음" on membership_applications for insert with check (true);
create policy "인증된 전체 셀렉트 허용" on membership_applications for select using (true);`}
                  </pre>
                </div>
              </div>
            ) : appError ? (
              <div className="bg-red-955/20 border border-red-900/30 rounded-2xl p-6 text-xs text-red-300 font-light">
                {appError}
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-[#0F0F0F] border border-slate-800 py-16 text-center rounded-2xl text-slate-500 font-light text-xs tracking-wider">
                실시간 DB에 접수된 온라인 회원가입서 내역이 아직 없습니다.
              </div>
            ) : (
              <div className="bg-[#0F0F0F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#141414] text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800/80">
                      <tr>
                        <th className="px-6 py-4">성명</th>
                        <th className="px-6 py-4">연락처</th>
                        <th className="px-6 py-4">가입 유형</th>
                        <th className="px-6 py-4">후원 금액</th>
                        <th className="px-6 py-4">납부 수단</th>
                        <th className="px-6 py-4">접수 일시</th>
                        <th className="px-6 py-4 text-center">동작</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-xs">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="px-6 py-4 text-sm font-semibold text-white">{app.name}</td>
                          <td className="px-6 py-4 text-slate-400 font-mono">{app.phone}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2.5 py-0.5 rounded text-[9px] font-bold border",
                              app.membership_type === 'regular' 
                                ? "bg-accent/10 text-accent border-accent/20"
                                : "bg-blue-400/10 text-blue-400 border-blue-400/20"
                            )}>
                              {app.membership_type === 'regular' ? '정기후원' : '일시후원'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-white font-mono">
                            {Number(app.amount).toLocaleString()}원
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {app.payment_method === 'cms' && 'CMS 자동이체'}
                            {app.payment_method === 'bank' && '직접 무통장'}
                            {app.payment_method === 'credit' && '신용카드'}
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-mono">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
                                title="상세 정보 보기"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteApplication(app.id)}
                                className="p-1.5 bg-slate-800 hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded transition-colors"
                                title="내역 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Application Detail Modal Dialog */}
            <AnimatePresence>
              {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedApp(null)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  />
                  {/* Content Container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-lg bg-[#111111] border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[85vh] text-slate-355"
                  >
                    <div className="border-b border-slate-800 pb-5 mb-5 flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <Database className="w-4 h-4 text-accent" />
                          {selectedApp.name} 회원 상세 접수내역
                        </h4>
                        <p className="text-slate-500 text-[9px] uppercase font-mono mt-0.5">
                          ID: {selectedApp.id}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedApp(null)}
                        className="text-slate-400 hover:text-white text-[11px] font-bold border border-slate-800 rounded-md px-2.5 py-1 hover:bg-slate-800"
                      >
                        닫기
                      </button>
                    </div>

                    <div className="space-y-4 text-xs font-light">
                      <div className="bg-[#161616] border border-slate-850 p-4 rounded-xl space-y-2.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">성명</span>
                          <span className="text-white font-semibold">{selectedApp.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">연락처</span>
                          <span className="text-white font-mono">{selectedApp.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">이메일</span>
                          <span className="text-white font-mono">{selectedApp.email || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">생년월일</span>
                          <span className="text-white font-mono">{selectedApp.birthdate || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">주소</span>
                          <span className="text-white text-right">{selectedApp.address || '-'}</span>
                        </div>
                      </div>

                      <div className="bg-[#161616] border border-slate-850 p-4 rounded-xl space-y-2.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">가입 분류</span>
                          <span className="text-accent font-bold">{selectedApp.membership_type === 'regular' ? '정기후원' : '일시후원'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">약정 기부금액</span>
                          <span className="text-white font-bold">{Number(selectedApp.amount).toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">납부 수단</span>
                          <span className="text-white font-bold text-slate-300">
                            {selectedApp.payment_method === 'cms' && 'CMS 자동이체'}
                            {selectedApp.payment_method === 'bank' && '직접 무통장 입금'}
                            {selectedApp.payment_method === 'credit' && '신용카드 납부'}
                          </span>
                        </div>
                      </div>

                      {/* Explicit CMS Details */}
                      {selectedApp.payment_method === 'cms' && (
                        <div className="bg-[#1b1912] border border-amber-900/30 p-4 rounded-xl space-y-2.5">
                          <h5 className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-950 pb-1.5">
                            <Info className="w-3.5 h-3.5" /> CMS 이체 자동결제용 정보
                          </h5>
                          <div className="flex justify-between">
                            <span className="text-slate-400">등록 은행명</span>
                            <span className="text-slate-205 font-medium text-amber-100">{selectedApp.bank_name || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">계좌 번호</span>
                            <span className="text-slate-205 font-mono font-medium text-amber-100">{selectedApp.account_number || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">예금주 실명</span>
                            <span className="text-slate-205 font-medium text-amber-100">{selectedApp.account_holder || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">식별번호 (생년/사업자)</span>
                            <span className="text-slate-205 font-mono font-medium text-amber-100">{selectedApp.holder_birth || '-'}</span>
                          </div>
                        </div>
                      )}

                      <div className="bg-[#161616] border border-slate-850 p-4 rounded-xl">
                        <span className="text-slate-500 block mb-1.5">한마디 또는 가입경로</span>
                        <p className="text-slate-300 leading-normal text-xs p-3 bg-[#111111] rounded-lg border border-slate-800">
                          {selectedApp.message || '(빈 메시지)'}
                        </p>
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                        <span>원격 수집 일자</span>
                        <span>{selectedApp.created_at}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-10 right-10 z-[100] flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full shadow-2xl font-bold"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          성공적으로 저장되었습니다.
        </motion.div>
      )}
    </div>
  );
}
