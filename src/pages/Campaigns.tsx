import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Users, 
  Link2, 
  Facebook, 
  Twitter, 
  ArrowLeft,
  Flame,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { storage } from '../services/storage';
import { eventService, Event, Rsvp } from '../services/events';
import { auth } from '../lib/firebase';

export default function Campaigns() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'scheduled' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'event' | 'campaign'>('all');

  // Modal and Action States
  const [selectedEventForRsvp, setSelectedEventForRsvp] = React.useState<Event | null>(null);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = React.useState(false);
  const [rsvpForm, setRsvpForm] = React.useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [rsvpCompleted, setRsvpCompleted] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [userRsvps, setUserRsvps] = React.useState<string[]>(() => {
    const saved = localStorage.getItem('user_rsvp_events');
    return saved ? JSON.parse(saved) : [];
  });

  const settings = storage.getSettings();

  // Load SEO headers & fetch raw items
  React.useEffect(() => {
    document.title = `캠페인 | ${settings.name}`;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${settings.name}에서 기획하는 실시간 참여 캠페인 정보 목록입니다. 시민의 손으로 행동주의를 이끕니다.`);
    }

    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEvents();
        setEvents(data);

        // Check if an event ID is in url search parameter
        const urlEventId = searchParams.get('id');
        if (urlEventId && data.length > 0) {
          const matched = data.find(e => e.id === urlEventId);
          if (matched) {
            setSelectedEventForRsvp(matched);
          }
        }
      } catch (err: any) {
        console.error('Error fetching events:', err);
        setError('행사 및 캠페인을 불러오는 도중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [searchParams]);

  // Auth synchronization for RSVP form prefilling
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setRsvpForm(prev => ({
          ...prev,
          name: user.displayName || '',
          email: user.email || ''
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = (event: Event, platform: 'facebook' | 'twitter' | 'kakao' | 'copy') => {
    const shareUrl = `${window.location.origin}/campaigns?id=${event.id}`;
    const text = `[${event.type === 'campaign' ? '캠페인' : '행사'}] ${event.title} - ${event.location}`;

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      triggerToast('페이스북 공유 창을 열었습니다.');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank');
      triggerToast('트위터 공유 창을 열었습니다.');
    } else if (platform === 'kakao') {
      window.open(`https://story.kakao.com/s/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank');
      triggerToast('카카오스토리 공유 창을 열었습니다.');
    } else if (platform === 'copy') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          triggerToast('참여 URL 링크 주소가 클립보드에 복사되었습니다.');
        }).catch(() => {
          fallbackCopyText(shareUrl);
        });
      } else {
        fallbackCopyText(shareUrl);
      }
    }
  };

  const fallbackCopyText = (text: string) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      triggerToast('참여 URL 링크 주소가 클립보드에 복사되었습니다.');
    } catch (err) {
      triggerToast('직접 주소를 복사해 주세요: ' + text);
    }
    document.body.removeChild(tempInput);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForRsvp) return;

    // Contact number regex validation (Korean phone or simple global format)
    const phoneRegex = /^[0-9\-\+\s]{9,18}$/;
    if (!phoneRegex.test(rsvpForm.phone.replace(/\s/g, ''))) {
      alert('올바른 연락처 번호를 입력해 주세요. (예: 010-1234-5678)');
      return;
    }

    setIsSubmittingRsvp(true);
    try {
      const rsvpData: Omit<Rsvp, 'id' | 'createdAt'> = {
        eventId: selectedEventForRsvp.id,
        name: rsvpForm.name.trim(),
        phone: rsvpForm.phone.trim(),
        email: rsvpForm.email.trim(),
        message: rsvpForm.message.trim(),
        userId: auth.currentUser?.uid || undefined
      };

      await eventService.submitRsvp(selectedEventForRsvp.id, rsvpData);
      
      // Update RSVPs stored in localStorage
      const nextRsvps = [...userRsvps, selectedEventForRsvp.id];
      setUserRsvps(nextRsvps);
      localStorage.setItem('user_rsvp_events', JSON.stringify(nextRsvps));

      setRsvpCompleted(true);
      triggerToast('신청 완료! 본 행사/캠페인에 참여 명단으로 제출되었습니다.');

      // Clear params and reset states after a brief delay
      setTimeout(() => {
        setRsvpCompleted(false);
        setSelectedEventForRsvp(null);
        setSearchParams({});
      }, 2500);

    } catch (err: any) {
      console.error('RSVP system failed:', err);
      alert('신청 처리 중 문제가 발생했습니다. 관리자에게 문의바랍니다.');
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchType = typeFilter === 'all' || event.type === typeFilter;
    return matchStatus && matchType;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-24 text-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Goback Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">홈으로 돌아가기</span>
        </Link>

        {/* Head Intro */}
        <header className="mb-14 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-accent rounded-full animate-ping" />
            <span className="text-xs uppercase tracking-widest text-accent font-bold font-mono">Participatory Action</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
            시민 참여 <span className="text-accent">캠페인</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed max-w-3xl">
            {settings.name}이 이끄는 행동 중심의 캠페인과 온·오프라인 시민 참여 소통 광장입니다. 
            시민 여러분의 소중한 동행이 세상을 더욱 투명하고 조화롭게 변화시킵니다!
          </p>
        </header>

        {/* Filters Panel */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#0F0F0F]/90 border border-slate-800 p-5 rounded-2xl mb-12">
          {/* Status Buttons */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'scheduled', 'completed'] as const).map((status) => {
              const labels = { all: '전체', active: '진행중', scheduled: '대기/예정', completed: '종료' };
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all border ${
                    statusFilter === status 
                      ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {labels[status]}
                </button>
              );
            })}
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
            {(['all', 'event', 'campaign'] as const).map((type) => {
              const labels = { all: '모든 분류', event: '행사 전용', campaign: '캠페인 전용' };
              return (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 text-xs rounded transition-all uppercase font-semibold ${
                    typeFilter === type 
                      ? 'bg-purple-900/40 text-accent border border-accent/30' 
                      : 'bg-transparent text-slate-500 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {labels[type]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-sm font-light">활성 캠페인 및 목록 조회 중...</span>
          </div>
        ) : error ? (
          <div className="py-16 text-center border border-red-950 bg-red-950/10 rounded-2xl p-6 text-red-400 flex flex-col items-center justify-center gap-4">
            <AlertCircle className="w-8 h-8" />
            <p className="text-xs font-mono">{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-24 text-center border border-slate-900 rounded-3xl bg-[#0F0F0F] text-slate-500 font-light flex flex-col items-center gap-4">
            <Bookmark className="w-8 h-8 text-slate-700" />
            <p className="text-sm">현재 분류된 조건에 알맞은 행사 또는 캠페인이 없습니다.</p>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((event) => {
              const isAlreadyRsvp = userRsvps.includes(event.id);
              const isCompleted = event.status === 'completed';

              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#0F0F0F] border border-slate-850 hover:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all hover:translate-y-[-2px] group"
                >
                  <div>
                    {/* Event Promo Image or Ambient Cover */}
                    <div className="aspect-[21/9] w-full relative bg-slate-900 overflow-hidden border-b border-slate-900">
                      <div className="absolute inset-0 bg-[#000]/40 z-10" />
                      <img 
                        src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000"} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 z-20 flex gap-1.5 items-center">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          event.type === 'campaign' ? 'bg-indigo-600 text-white' : 'bg-[#7C3AED] text-white'
                        }`}>
                          {event.type === 'campaign' ? '캠페인' : '행사'}
                        </span>
                        
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          event.status === 'active' ? 'bg-emerald-600 text-white' :
                          event.status === 'scheduled' ? 'bg-amber-600 text-white' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {event.status === 'active' ? '진행중' :
                           event.status === 'scheduled' ? '예정됨' :
                           '종료됨'}
                        </span>
                      </div>
                    </div>

                    {/* Meta and content details */}
                    <div className="p-7 space-y-4">
                      <h2 className="text-xl font-extrabold text-white group-hover:text-accent transition-colors leading-snug">
                        {event.title}
                      </h2>
                      <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed line-clamp-3 whitespace-pre-line">
                        {event.description}
                      </p>

                      <div className="pt-4 border-t border-slate-900 space-y-2.5 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>기간: {event.startDate} ~ {event.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>시간: {event.time || '일정 확인 필요'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">국가/장소: {event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="p-6 border-t border-slate-900/60 bg-[#121212]/50 flex items-center justify-between gap-4">
                    {/* Share Button Group */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleShare(event, 'copy')}
                        className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
                        title="URL 복사"
                      >
                        <Link2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleShare(event, 'facebook')}
                        className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
                        title="Facebook 공유"
                      >
                        <Facebook className="w-4 h-4 text-[#1877F2]" />
                      </button>
                      <button 
                        onClick={() => handleShare(event, 'twitter')}
                        className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
                        title="X (Twitter) 공유"
                      >
                        <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                      </button>
                    </div>

                    {/* RSVP Trigger Button */}
                    {isCompleted ? (
                      <span className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-500 rounded text-xs px-5 py-2.5 font-bold cursor-not-allowed select-none">
                        종료된 행사
                      </span>
                    ) : isAlreadyRsvp ? (
                      <span className="px-4 py-2 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded text-xs px-5 py-2.5 font-bold flex items-center gap-1.5 select-none">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 신청완료
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedEventForRsvp(event);
                          setSearchParams({ id: event.id });
                        }}
                        className="bg-accent text-white px-5 py-2.5 rounded font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accent/15"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>참여 신청 (RSVP)</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* RSVP Submission Modal */}
      <AnimatePresence>
        {selectedEventForRsvp && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#111111] border border-slate-850 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-850/80 flex items-center justify-between bg-[#151515]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-accent uppercase tracking-widest font-bold">ONLINE RSVP</span>
                  <h3 className="text-sm font-bold text-slate-300 truncate max-w-xs">{selectedEventForRsvp.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEventForRsvp(null);
                    setSearchParams({});
                  }}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all"
                >
                  취소 ✕
                </button>
              </div>

              {/* Form Content */}
              {rsvpCompleted ? (
                <div className="p-10 space-y-4 text-center py-16">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>
                  <h4 className="text-xl font-bold text-white">행사 신청서 제출 완료!</h4>
                  <p className="text-slate-400 font-light text-xs leading-relaxed max-w-sm mx-auto">
                    참여해 주셔서 진심으로 감사드립니다.<br />
                    작성해 주신 연락처로 주최측에서 모임 관련 상세 안내 문자와 위치 알림을 전송해 드리겠습니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="p-6 overflow-y-auto space-y-5">
                  <div className="p-4 bg-purple-950/20 border border-accent/20 rounded-xl space-y-1.5 text-xs text-accent">
                    <h5 className="font-bold flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5" /> 행사 참여 안내
                    </h5>
                    <p className="opacity-90 font-light leading-relaxed">
                      연락처(핸드폰)는 주회 안내 문자 및 노쇼 방지를 위해 수집하며, 행사 종료 후 개인정보보호법에 의거하여 즉각 소멸 처리됨을 약속드립니다.
                    </p>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-medium">참가자 성명 *</label>
                    <input
                      type="text"
                      required
                      placeholder="홍길동"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#181818] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors font-light"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-medium">연락처 번호 (휴대폰) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="010-1234-5678"
                      value={rsvpForm.phone}
                      onChange={(e) => setRsvpForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-[#181818] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors font-light font-mono"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-medium">이메일 주소 *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={rsvpForm.email}
                      onChange={(e) => setRsvpForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-[#181818] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors font-light"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-medium">전하고 싶은 질문 또는 한마디 (선택)</label>
                    <textarea
                      placeholder="기타 참관 시 문의사항이나 응원의 한마디를 적어주세요."
                      value={rsvpForm.message}
                      onChange={(e) => setRsvpForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      className="w-full bg-[#181818] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors font-light resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className="w-full bg-accent text-white font-bold py-3.5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
                    >
                      {isSubmittingRsvp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          참여 신청 진행 중...
                        </>
                      ) : (
                        '행사 및 캠페인 참여 신청서 제출'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating dynamic toast for clipboard sharing or successes */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 px-5 py-3.5 bg-[#0F0F0F] border border-accent text-slate-200 text-xs rounded-xl shadow-2xl flex items-center gap-3 select-none"
          >
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span className="font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
