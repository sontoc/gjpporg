import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  UserPlus, 
  LogIn as LogInIcon, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { storage } from '../services/storage';
import { TransparentLogo } from '../components/TransparentLogo';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tab: 'login' or 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Loading & statuses
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // Synchronize with storage key for legacy/backward compatibility in Admin page and general site components
        storage.login(data.user.email || email);
        
        // Redirect to origin or admin page
        navigate(from === '/login' ? '/' : from, { replace: true });
        window.location.reload();
      }
    } catch (err: any) {
      console.error('Supabase Login Error:', err);
      // Friendly Korean translation for common errors
      if (err.message?.includes('Invalid login credentials')) {
        setErrorMsg('이메일 또는 비밀번호가 잘못 입력되었습니다. 혹은 회원가입 후 이메일 인증이 완료되었는지 확인해 주세요.');
      } else if (err.message?.includes('Email not confirmed')) {
        setErrorMsg('이메일 인증이 아직 완료되지 않았습니다. 메일함을 확인해 주세요.');
      } else {
        setErrorMsg(err.message || '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle SignUp
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSignupSuccess(false);

    if (password !== confirmPassword) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login',
        }
      });

      if (error) {
        throw error;
      }

      // Check if user identity is created either immediately or requires email confirmation
      setSignupSuccess(true);
    } catch (err: any) {
      console.error('Supabase SignUp Error:', err);
      if (err.message?.includes('already registered')) {
        setErrorMsg('이미 해당 이메일로 가입된 계정이 존재합니다.');
      } else if (err.message?.includes('at least 6 characters')) {
        setErrorMsg('비밀번호는 최소 6자 이상이어야 합니다.');
      } else {
        setErrorMsg(err.message || '회원가입에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-28 pb-20 px-6 flex flex-col justify-center items-center text-slate-200">
      <div className="w-full max-w-md">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">홈으로 가기</span>
        </Link>

        {/* Logo and Greeting */}
        <div className="text-center mb-8 px-4">
          <div className="select-none mx-auto mb-4 inline-flex items-center justify-center bg-transparent">
            <TransparentLogo 
              src="https://postfiles.pstatic.net/MjAyNjA1MjJfMTAg/MDAxNzc5NDQxODc1MDA2.nW_uKcVcDfKX2ulMGsz0wCpxcVLKxHpQcjmTaDzOmnog.JywPAhgtR07FKPMq5hiLLP8CQXbGli78WpKxxkXpawkg.PNG/%EA%B4%91%EC%A3%BC%EC%8B%9C%EB%AF%BC%EC%97%B0%EB%8C%80%EB%A1%9C%EA%B3%A0.png?type=w3840" 
              className="h-14 w-auto object-contain" 
              alt="광주참여자치시민연대 로고" 
            />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">시민 광장 참여 커뮤니티</h2>
          <p className="text-slate-400 text-xs mt-1 font-light">소통하고 행동하는 정직한 광주 공동체</p>
        </div>

        {/* Form Container Card */}
        <div className="bg-[#111111] border border-slate-800 p-8 rounded-3xl shadow-2xl relative">
          
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 bg-[#161616] border border-slate-800 p-1 rounded-xl mb-6">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
                setSignupSuccess(false);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'login' 
                  ? 'bg-accent text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg(null);
                setSignupSuccess(false);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'signup' 
                  ? 'bg-accent text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* Status Notifications */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-950/30 border border-red-900/60 p-4 rounded-xl text-xs text-red-300 font-light flex flex-col gap-3 mb-4"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
                {email && (
                  <button
                    type="button"
                    onClick={() => {
                      // Bypass email confirmation for quick development testing
                      storage.login(email);
                      navigate(from === '/login' ? '/' : from, { replace: true });
                      window.location.reload();
                    }}
                    className="mt-1 bg-red-900/40 hover:bg-accent border border-red-800/80 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all self-start flex items-center gap-1 shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    이메일 미인증 상태로 즉시 로그인 (테스트 대시보드 진입)
                  </button>
                )}
              </motion.div>
            )}

            {signupSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-950/30 border border-emerald-900/60 p-4 rounded-xl text-xs text-emerald-300 font-light space-y-2.5 mb-4"
              >
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>인증 메일이 발송되었습니다!</span>
                </div>
                <p className="leading-relaxed text-slate-300 text-[11px]">
                  회원가입 절차를 마치려면 가입하신 이메일(<b className="text-white font-semibold">{email}</b>) 메일함에서 
                  <b> Supabase 인증 확인 링크</b>를 클릭하셔야 합니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    // Instantly let user login bypassing confirmation email
                    storage.login(email);
                    navigate(from === '/login' ? '/' : from, { replace: true });
                    window.location.reload();
                  }}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  인증 무시하고 테스트 계정으로 즉시 진입하기
                </button>
                <div className="text-[10px] text-slate-500 italic pt-1 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>수신함에 메일이 오지 않는다면 스팸 메일함을 체크해 보시기 바랍니다.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content */}
          <form onSubmit={activeTab === 'login' ? handleLogin : handleSignUp} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">이메일 주소</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#161616] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-accent font-light"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 font-light">비밀번호</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력 (6자 이상)"
                  className="w-full bg-[#161616] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-accent font-light"
                />
              </div>
            </div>

            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 font-light">비밀번호 확인</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 동일하게 재입력"
                    className="w-full bg-[#161616] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-accent font-light"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (activeTab === 'signup' && signupSuccess)}
              className="w-full bg-accent hover:brightness-110 text-white rounded-xl py-3 font-bold text-sm shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {activeTab === 'login' ? '로그인 처리 중...' : '회원가입 요청 중...'}
                </>
              ) : activeTab === 'login' ? (
                <>
                  <LogInIcon className="w-4 h-4" />
                  웹사이트 로그인
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  이메일로 가입 신청
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
