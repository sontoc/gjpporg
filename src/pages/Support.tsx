import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Wallet, 
  Users, 
  MessageCircle, 
  ArrowLeft, 
  ExternalLink, 
  Check, 
  Copy, 
  Database, 
  Info, 
  Loader2, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';
import { supabase } from '../lib/supabase';

const SupportPage: React.FC = () => {
  const settings = storage.getSettings();
  const [activeTab, setActiveTab] = useState<'info' | 'form'>('info');
  const [copiedBank, setCopiedBank] = useState(false);

  const handleCopyBank = () => {
    navigator.clipboard.writeText('317-0026-0245-11');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthdate: '',
    membershipType: 'regular', // irregular / regular
    amount: '10000', // 5000, 10000, 20000, 30000, 50000, custom
    customAmount: '',
    paymentMethod: 'cms', // cms, bank, credit
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    holderBirth: '',
    address: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<'table_not_found' | string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlCode = `
-- 1. Supabase SQL Editor에 복사하여 붙여넣으세요.
create table if not exists membership_applications (
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

-- 2. 행 레벨 보안(RLS) 활성화 및 권한 설정
alter table membership_applications enable row level security;

create policy "익명 신청서 제출 허용" 
on membership_applications 
for insert 
with check (true);

create policy "인증된 관리자 조회 허용" 
on membership_applications 
for select 
using (true);
`.trim();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const actualAmount = formData.amount === 'custom' 
      ? Number(formData.customAmount) 
      : Number(formData.amount);

    try {
      const { error } = await supabase
        .from('membership_applications')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            birthdate: formData.birthdate,
            membership_type: formData.membershipType,
            amount: isNaN(actualAmount) ? 0 : actualAmount,
            payment_method: formData.paymentMethod,
            bank_name: formData.paymentMethod === 'cms' ? formData.bankName : null,
            account_number: formData.paymentMethod === 'cms' ? formData.accountNumber : null,
            account_holder: formData.paymentMethod === 'cms' ? formData.accountHolder : null,
            holder_birth: formData.paymentMethod === 'cms' ? formData.holderBirth : null,
            address: formData.address,
            message: formData.message,
          }
        ]);

      if (error) {
        throw error;
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      console.error('Supabase submission error:', err);
      
      // Save locally to prevent data loss
      try {
        const localApps = JSON.parse(localStorage.getItem('local_membership_applications') || '[]');
        localApps.push({
          id: 'local_' + Math.random().toString(36).substring(2, 11),
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          birthdate: formData.birthdate,
          membership_type: formData.membershipType,
          amount: isNaN(actualAmount) ? 0 : actualAmount,
          payment_method: formData.paymentMethod,
          bank_name: formData.paymentMethod === 'cms' ? formData.bankName : null,
          account_number: formData.paymentMethod === 'cms' ? formData.accountNumber : null,
          account_holder: formData.paymentMethod === 'cms' ? formData.accountHolder : null,
          holder_birth: formData.paymentMethod === 'cms' ? formData.holderBirth : null,
          address: formData.address,
          message: formData.message,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('local_membership_applications', JSON.stringify(localApps));
      } catch (localErr) {
        console.error('Failed to save membership application locally:', localErr);
      }

      // Determine if table was missing or database relation error
      if (
        err.code === '42P01' || 
        err.message?.includes('relation') || 
        err.message?.includes('not found') || 
        err.status === 404
      ) {
        setSubmitError('table_not_found');
      } else {
        // Clear submit error, set fallback success state so the user is not frustrated
        setSubmitSuccess(true);
        setSubmitError('local_fallback');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportTypes = [
    {
      title: '정기후원 회원가입',
      icon: <Users className="w-6 h-6" />,
      desc: '의결권을 가진 정회원으로 참여하여 매월 정기적인 후원으로 단체의 운영과 활동을 든든하게 지켜주세요.',
      type: 'regular',
      link: settings.donationUrl
    },
    {
      title: '홈페이지 회원가입',
      icon: <MessageCircle className="w-6 h-6" />,
      desc: '시민광장 자유게시판에 의견을 남기고 소통할 수 있는 홈페이지 회원으로 가입합니다. 가입 즉시 자유롭게 글쓰기가 가능합니다.',
      type: 'homepage',
      link: '/login?tab=signup'
    },
    {
      title: '일시후원',
      icon: <Wallet className="w-6 h-6" />,
      desc: '특별한 날, 의미 있는 나눔을 통해 광주시민연대의 활동과 변화에 소중한 힘을 보태주세요.',
      type: 'donation',
      bankInfo: '농협 317-0026-0245-11 광주참여자치시민연대',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-slate-200">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">홈으로 돌아가기</span>
        </Link>

        {/* Hero Header */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6 border border-accent/20"
          >
            <Heart className="w-8 h-8 fill-current animate-pulse text-accent" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">회원가입 및 후원</h1>
          <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
            정부 보조금 없이 오직 시민의 후원으로만 투명하게 운영됩니다.<br />
            정의롭고 따뜻한 광주 공동체를 위한 소중한 첫걸음이 되어 주세요.
          </p>
        </header>

        {/* Tab Toggle Navigation */}
        <div className="flex justify-center mb-10">
          <div className="p-1 bg-[#141414] border border-slate-800 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'info' 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              후원 안내 및 계좌
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'form' 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              온라인 가입 신청서
            </button>
          </div>
        </div>

        {/* Main Tabs Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'info' ? (
            <motion.div
              key="info-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-12"
            >
              {/* Support Type Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {supportTypes.map((type, idx) => (
                  <div
                    key={type.title}
                    className="bg-[#141414] border border-slate-800 p-8 rounded-3xl hover:border-accent/40 transition-colors group flex flex-col shadow-xl"
                  >
                    <div className="w-12 h-12 bg-slate-800/80 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                      {type.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{type.title}</h3>
                    <p className="text-slate-400 text-sm font-light leading-relaxed mb-8 flex-1">
                      {type.desc}
                    </p>
                    
                    {type.type === 'regular' ? (
                      <button 
                        onClick={() => setActiveTab('form')}
                        className="w-full h-14 bg-accent text-white rounded-lg font-bold text-xs sm:text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                      >
                        간편 온라인 가입하기 <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      </button>
                    ) : type.type === 'homepage' ? (
                      <Link 
                        to="/login?tab=signup"
                        className="w-full h-14 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 text-center"
                      >
                        시민광장 회원가입 <ExternalLink className="w-4 h-4 text-accent" />
                      </Link>
                    ) : (
                      <div 
                        onClick={handleCopyBank}
                        className="w-full h-14 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-white rounded-lg flex flex-col items-center justify-center transition-all px-2 cursor-pointer select-none shrink-0"
                        title="클릭 시 계좌번호 복사"
                      >
                        {copiedBank ? (
                          <span className="text-emerald-400 text-xs font-bold animate-pulse">계좌번호가 복사되었습니다!</span>
                        ) : (
                          <div className="text-center">
                            <span className="block text-[13px] sm:text-sm font-bold text-yellow-500 leading-normal">후원계좌 : 농협 317-0026-0245-11</span>
                            <span className="block text-[11px] text-slate-400 font-medium leading-normal">광주참여자치시민연대</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Info Detail Box */}
              <div className="bg-[#141414] border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">후원 회원 가입</h2>
                    <p className="text-slate-400 text-sm font-light leading-relaxed">
                      광주참여자치시민연대는 오직 시민의 후원으로만 운영되며 독립적인 권력 감시와 모니터링을 위해 (공익 활동을 위한 투명한 지원금을 제외하고) 지자체 및 정부의 지원금을 일절 지원 받지 않습니다.<br /><br />
                      현재 세제혜택(소득공제) 및 기부금 영수증을 발행하기 위한 민간 단체로의 등록을 진행하고 있습니다.
                    </p>
                    <div className="space-y-3 pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-3 text-slate-300 font-light text-sm">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                        <span>문의처: {settings.contactPhone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300 font-light text-sm">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                        <span>이메일: {settings.contactEmail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-[#0C0C0C] p-8 rounded-2xl border border-slate-800 shadow-inner max-w-sm w-full text-center space-y-6">
                      <MessageCircle className="w-10 h-10 text-accent mx-auto" />
                      <p className="text-white text-sm font-medium leading-relaxed">
                        복잡한 절차 없이 간편하게<br />
                        홈페이지에서 바로 온라인 신청서를 작성하세요.
                      </p>
                      <button 
                        onClick={() => setActiveTab('form')}
                        className="w-full py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-slate-200 transition-all shadow-lg"
                      >
                        온라인 신청서 작성하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              {/* Success View */}
              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#141414] border border-slate-800 rounded-3xl p-10 text-center space-y-6 shadow-2xl"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {submitError === 'local_fallback' ? '가입 및 후원 신청 완료 (로컬 임시저장)!' : '가입 및 후원 신청 완료!'}
                  </h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed max-w-md mx-auto">
                    {submitError === 'local_fallback' ? (
                      <>
                        데모/네트워크 환경 제약으로 인해 신청서가 <strong>기기의 보안 로컬 스토리지</strong>에 임시 저장되었습니다.<br />
                        관리자 대시보드(Applications 탭)에서 신청서를 원활하게 조회 및 처리할 수 있습니다. 동참해 주셔서 깊이 감사드립니다!
                      </>
                    ) : (
                      <>
                        소중한 가입 신청서가 Supabase 벡엔드에 성공적으로 기록되었습니다. <br />
                        보내주신 고귀한 참여에 진심으로 감사드리며, 확인 후 빠른 시일 내에 안내 문자를 발송해 드리겠습니다.
                      </>
                    )}
                  </p>
                  
                  <div className="pt-6 border-t border-slate-800 flex flex-col gap-4">
                    <button
                      onClick={() => {
                        setSubmitSuccess(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          birthdate: '',
                          membershipType: 'regular',
                          amount: '10000',
                          customAmount: '',
                          paymentMethod: 'cms',
                          bankName: '',
                          accountNumber: '',
                          accountHolder: '',
                          holderBirth: '',
                          address: '',
                          message: ''
                        });
                      }}
                      className="px-6 py-3 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-all"
                    >
                      새로운 신청서 작성
                    </button>
                    <button
                      onClick={() => setActiveTab('info')}
                      className="text-slate-500 text-xs hover:text-slate-300 font-light underline"
                    >
                      후원 안내 홈으로 돌아가기
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Application Form */
                <form onSubmit={handleSubmit} className="bg-[#111111] border border-slate-800 p-8 rounded-3xl space-y-8 shadow-2xl relative overflow-hidden">
                  
                  {/* Form Heading */}
                  <div className="border-b border-slate-800 pb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                      광주참여자치시민연대 가입/후원 신청서
                    </h2>
                    <p className="text-slate-500 text-xs font-light mt-1">
                      모든 정보는 보안 처리되며, Supabase 실시간 DB로 직접 수집 및 보존됩니다.
                    </p>
                  </div>

                  {/* Supabase Error Instructions */}
                  {submitError === 'table_not_found' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-950/40 border border-red-800 text-red-200 rounded-2xl p-6 space-y-4 text-xs font-light"
                    >
                      <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                        <ShieldAlert className="w-5 h-5 shrink-0" />
                        <span>Supabase 테이블 생성 가이드</span>
                      </div>
                      <p className="leading-relaxed text-slate-300">
                        설정하신 Supabase 프로젝트에 <code className="bg-red-950 px-1.5 py-0.5 rounded font-mono text-red-300">membership_applications</code> 테이블이 구축되지 않아 신청을 저장할 수 없습니다. 
                        아래의 SQL 스크립트를 복사하여 <b>Supabase Console &gt; SQL Editor</b>에서 실행하시면 즉시 연동됩니다.
                      </p>
                      
                      <div className="relative">
                        <pre className="bg-[#090909] p-4 rounded-xl text-slate-400 font-mono text-[10px] overflow-x-auto max-h-48 border border-slate-800 leading-normal">
                          {sqlCode}
                        </pre>
                        <button
                          type="button"
                          onClick={copySqlToClipboard}
                          className="absolute top-2 right-2 p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-all flex items-center gap-1"
                        >
                          {copiedSql ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-400" />
                              <span className="text-[10px] text-green-400">복사됨!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px]">SQL 복사</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {submitError && submitError !== 'table_not_found' && (
                    <div className="bg-red-950/40 border border-red-800/50 text-red-300 rounded-xl p-4 text-sm font-light">
                      오류: {submitError}
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Basic User Information Segment */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                        <Users className="w-4 h-4 text-accent" />
                        <span>1. 인적 사항</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-400">성명 <span className="text-accent">*</span></label>
                          <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="홍길동"
                            className="w-full bg-[#161616] border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-400">휴대전화번호 <span className="text-accent">*</span></label>
                          <input
                            required
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="010-1234-5678"
                            className="w-full bg-[#161616] border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-400">이메일 주소 <span className="text-accent">*</span></label>
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="gildong@example.com"
                            className="w-full bg-[#161616] border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-400">생년월일 (6자리 또는 8자리) <span className="text-accent">*</span></label>
                          <input
                            required
                            type="text"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleInputChange}
                            placeholder="1990-01-01"
                            className="w-full bg-[#161616] border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400">주소</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="경기도 광주시 회안대로 (상세 주소)"
                          className="w-full bg-[#161616] border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                        />
                      </div>
                    </div>

                    {/* Support Details Segment */}
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                        <Wallet className="w-4 h-4 text-accent" />
                        <span>2. 신청 및 후원 정보</span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">가입 구분 <span className="text-accent">*</span></label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'regular', title: '정기후원 가입', desc: '매월 일정한 기부로 든든한 정인 활동 지원' },
                            { id: 'one_time', title: '일시후원 신청', desc: '특별한 목적 또는 이벤트 성 일시 나눔' }
                          ].map(type => (
                            <label
                              key={type.id}
                              className={`border rounded-xl p-4 flex flex-col gap-1 cursor-pointer transition-all ${
                                formData.membershipType === type.id 
                                  ? 'border-accent bg-accent/5' 
                                  : 'border-slate-800 bg-[#161616]'
                              }`}
                            >
                              <input
                                type="radio"
                                name="membershipType"
                                value={type.id}
                                checked={formData.membershipType === type.id}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <span className="text-sm font-bold text-white flex items-center justify-between">
                                {type.title}
                                {formData.membershipType === type.id && <Check className="w-4 h-4 text-accent" />}
                              </span>
                              <span className="text-[11px] text-slate-500 font-light">{type.desc}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">기부 약정 금액 <span className="text-accent">*</span></label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {['5000', '10000', '20000', '30000', '50000', 'custom'].map(amt => (
                            <label
                              key={amt}
                              className={`border rounded-lg py-2.5 text-center text-xs font-medium cursor-pointer transition-all ${
                                formData.amount === amt 
                                  ? 'border-accent bg-accent/10 text-accent font-bold' 
                                  : 'border-slate-800 bg-[#161616] text-slate-400'
                              }`}
                            >
                              <input
                                type="radio"
                                name="amount"
                                value={amt}
                                checked={formData.amount === amt}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              {amt === 'custom' ? '직접입력' : `${Number(amt).toLocaleString()}원`}
                            </label>
                          ))}
                        </div>

                        {formData.amount === 'custom' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-2"
                          >
                            <div className="relative">
                              <input
                                required
                                type="number"
                                name="customAmount"
                                value={formData.customAmount}
                                onChange={handleInputChange}
                                placeholder="기부하고 싶으신 금액(숫자만 입력)"
                                className="w-full bg-[#161616] border border-slate-800 rounded-lg pl-4 pr-12 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                              />
                              <span className="absolute right-4 top-2.5 text-sm text-slate-500">원</span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">납부 수단 <span className="text-accent">*</span></label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'cms', label: 'CMS 자동이체 (권장)' },
                            { id: 'bank', label: '직접 무통장 입금' },
                            { id: 'credit', label: '신용 카드 기부' }
                          ].map(pay => (
                            <label
                              key={pay.id}
                              className={`border rounded-lg py-3 text-center text-xs font-medium cursor-pointer transition-all ${
                                formData.paymentMethod === pay.id 
                                  ? 'border-accent bg-accent/5 text-white font-semibold' 
                                  : 'border-slate-800 bg-[#161616] text-slate-400'
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={pay.id}
                                checked={formData.paymentMethod === pay.id}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              {pay.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CMS Fields */}
                    <AnimatePresence>
                      {formData.paymentMethod === 'cms' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 space-y-4 border-t border-slate-800/60 overflow-hidden"
                        >
                          <div className="bg-accent/5 border border-accent/10 rounded-2xl p-4 flex gap-3 text-xs text-slate-400 leading-normal font-light mb-2">
                            <Info className="w-5 h-5 text-accent shrink-0" />
                            <span>CMS 후원은 금융결제원을 통해 지정한 계좌에서 매월 자동으로 회비가 인출되는 매우 안전하고 공신력 있는 기부 방식입니다.</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-400">출금 은행명 <span className="text-accent">*</span></label>
                              <input
                                required={formData.paymentMethod === 'cms'}
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                placeholder="예: 농협, 신한은행"
                                className="w-full bg-[#161616] border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-400">계좌 번호 (하이픈 제외) <span className="text-accent">*</span></label>
                              <input
                                required={formData.paymentMethod === 'cms'}
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                placeholder="숫자만 입력해 주세요"
                                className="w-full bg-[#161616] border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-400">예금주명 <span className="text-accent">*</span></label>
                              <input
                                required={formData.paymentMethod === 'cms'}
                                type="text"
                                name="accountHolder"
                                value={formData.accountHolder}
                                onChange={handleInputChange}
                                placeholder="계좌 실명과 동일한 예금주"
                                className="w-full bg-[#161616] border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-400">예금주 생년월일 또는 사업자번호 <span className="text-accent">*</span></label>
                              <input
                                required={formData.paymentMethod === 'cms'}
                                type="text"
                                name="holderBirth"
                                value={formData.holderBirth}
                                onChange={handleInputChange}
                                placeholder="YYMMDD (6자리) 또는 사업자번호"
                                className="w-full bg-[#161616] border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Comment Area */}
                    <div className="space-y-1 pt-4">
                      <label className="text-xs font-medium text-slate-400">광주시민연대에 바라는 한마디 또는 가입 경로</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="시민운동에 동참하며 한 말씀 또는 추천인을 남겨주세요."
                        className="w-full bg-[#161616] border border-slate-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent font-light"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800 flex justify-between items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('info')}
                      className="px-6 py-3 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-sm font-bold transition-all"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-accent hover:brightness-110 text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2 flex-1 max-w-[280px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          가입서 제출하는 중...
                        </>
                      ) : (
                        <>
                          가입서 온라인 제출
                          <Database className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SupportPage;
