import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Shield, Gavel, ArrowLeft, Users, Layers, Calendar, MapPin, Copy, Check, Map, ExternalLink, Palette, Download, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'declaration' | 'statutes' | 'rules' | 'executives' | 'organization' | 'ci' | 'history' | 'location'>('declaration');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeMap, setActiveMap] = useState<'kakao' | 'google' | 'naver'>('google');
  const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("경기 광주시 양촌길 124-8(3층)");
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error('CORS fetch failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Direct link fallback if CORS blocks direct blob download
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const tabs = [
    { id: 'declaration', name: '창립선언문', icon: <FileText className="w-4 h-4" /> },
    { id: 'statutes', name: '정관', icon: <Shield className="w-4 h-4" /> },
    { id: 'rules', name: '규칙', icon: <Gavel className="w-4 h-4" /> },
    { id: 'executives', name: '임원소개', icon: <Users className="w-4 h-4" /> },
    { id: 'organization', name: '실행조직', icon: <Layers className="w-4 h-4" /> },
    { id: 'ci', name: 'CI소개', icon: <Palette className="w-4 h-4" /> },
    { id: 'history', name: '연혁', icon: <Calendar className="w-4 h-4" /> },
    { id: 'location', name: '오시는길', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">홈으로 돌아가기</span>
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">단체소개</h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed">
            광주참여자치시민연대의 근간이 되는 창립 가치와 운영 원칙을 소개합니다.
          </p>
        </header>

        {/* Tab Navigation - Wrapping nicely on mobile without scrolling */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-4 md:pb-6 mx-0 px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all shrink-0 border cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                  : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800 hover:text-white border-slate-800'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Dynamic Abbreviation notice - Beautifully styled with subtle indicator */}
        <div className="text-slate-400 text-xs sm:text-sm px-2 mb-8 font-light flex items-center gap-2 animate-fade-in">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shrink-0" />
          <span>광주참여자치시민연대는 약칭으로 <strong className="text-accent font-semibold">[광주시민연대]</strong>를 사용합니다.</span>
        </div>

        {/* Content Area - Completely frameless with zero border and padding for maximum readability and density */}
        <div className="bg-transparent p-0 overflow-visible relative">
          
          <AnimatePresence mode="wait">
            {activeTab === 'declaration' && (
              <motion.div
                key="declaration"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="prose prose-invert max-w-none"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">광주참여자치시민연대 창립선언문</h2>
                  <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
                </div>
                
                <div className="text-slate-300 leading-relaxed space-y-4 font-normal text-xs sm:text-sm md:text-sm px-0 mb-8 text-justify">
                  <p>
                    천년을 면면히 이어온 너른고을 광주는, 해공 신익희로 대한민국과 민주공화국의 기초를 다지고 허난설헌과 일제의 반인륜적 성범죄에 맞서 온몸으로 싸워온 할머니들로 여성인권을 세상에 움트게 한 민주주의와 인권의 고장이다.
                  </p>
                  <p>
                    광주는 언제나 대의를 위해 기꺼이 자신의 너른 품을 내주어 왔다. 나라와 국민을 위해 남한산성은 피와 땀을 흘렸고 이웃과 생명을 위해 경안천과 팔당은 세상의 젖줄이 되었다. 정권의 행정편의로 광주 땅 강남, 성남, 하남을 대대로 지켜온 시민들은 천년고향 광주의 이름조차 잃었다. 하지만, 무도한 역사와 권력의 아집 속에서도 광주는 죽지 않았고 광주 시민은 살아있다.
                  </p>
                  <p>
                    오늘날, 광주의 시민은 자식을 위한 어머니의 헌신처럼 한국 민주주의와 천부 인권의 가치를 키워온 이 땅 광주를 지키기 위해 나섰다. 수년 전 직장인, 주부, 미래세대 학생, 청년들은 자발적으로 모여 오직 시민의 힘으로 평화의 소녀상을 세웠고, 우리의 삶을 파괴하는 물류단지 반대 시민행동을 통해 광주의 정신과 시민공동체 운동의 가치를 살려냈다.
                  </p>
                  <p>
                    이러한 시민정신과 행동은 공익을 위한 담대한 여정으로 상설적인 범시민공동체로 함께 발맞추어 굳건한 시민의 힘을 가질 때 시민이 진정한 주인이 된다는 것을 실천적으로 보여 주었다.
                  </p>
                  <p>
                    이제, 참 민주주의와 인권의 고장 광주와 광주 시민은 세상에 고한다. 광주의 정신과 시민 행동의 뜻을 이어받아 새 희망을 여는 시민공동체로서 ‘광주참여자치시민연대’를 세상에 출범시켜 광주와 광주 시민이 마땅히 누려야 할 시민주권, 시민자치, 시민연대를 위한 큰 발걸음을 내딛는다.
                  </p>
                  <p className="font-bold text-white text-sm sm:text-base pt-2 text-center">
                    오직 시민의 참여로, 시민의 연대로, 시민의 힘으로!
                  </p>
                  <p>
                    든든하고 따뜻한 첫 광주 시민공동체가 굳게 서는 날, 광주의 산야와 함께 우리 모두 춤추고 시민이 진정한 이 땅의 주인이 되는 새 역사를 바로 쓰게 될 것이다.
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                  <p className="text-lg font-bold text-white mb-2">2022. 10. 15.</p>
                  <p className="text-slate-400 text-sm mb-1">광주참여자치시민연대 창립 발기인 일동</p>
                  <p className="text-accent font-bold text-xs sm:text-sm">창립 발기인 53명 대표 구 재 이</p>
                </div>

                <div className="mt-8 py-6 border-t border-white/10 relative">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 text-center">Founding Members / 창립 발기인</h4>
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-3 gap-x-2 text-[12px] sm:text-[13px] text-slate-400 font-light text-center">
                    {["강수철", "강용식", "강창성", "고영식", "권재형", "김관양", "김덕임", "김민주", "김보경", "김선명", "김영희", "김진관", "김진필", "김현", "남진우", "노신영", "라순하", "박명옥", "박영민", "박형순", "백남욱", "백영기", "부길만", "손봉호", "손연국", "신부철", "유권신", "윤정숙", "이근배", "이미정", "이운균", "이원석", "이윤섭", "이응권", "이인숙", "이종갑", "이지희", "이현오", "이희월", "장건", "장숙현", "정인수", "정인숙", "정준혜", "조수아", "조연삼", "지재근", "최숭원", "한동윤", "한숙희", "현상순", "홍민희"].map((name, i) => (
                      <span key={i} className="hover:text-accent transition-colors">{name}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-600 mt-6 text-center uppercase tracking-widest font-bold">* 가나다 순 (창립준비위원 별도)</p>
                </div>
              </motion.div>
            )}
            {activeTab === 'executives' && (
              <motion.div
                key="executives"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">광주참여자치시민연대 임원소개</h2>
                  <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { title: "고문단", description: "본회의 운영에 대한 자문과 지도를 담당합니다." },
                    { title: "자문위원회", description: "전문적인 지식과 경험을 바탕으로 정책 자문을 수행합니다." },
                    { title: "공동대표단", description: "본회를 대외적으로 대표하며 회무를 총괄합니다." },
                    { title: "이사회", description: "본회의 주요 운영 사항을 심의하고 의결합니다." }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-transparent py-3 border-b border-white/10 hover:border-accent/30 transition-colors">
                      <h4 className="text-accent font-bold mb-1 text-base">{item.title}</h4>
                      <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'organization' && (
              <motion.div
                key="organization"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">실행조직 구성</h2>
                  <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { title: "집행위원회", description: "본회의 일상적인 사업과 정책을 집행하고 점검합니다." },
                    { title: "정책위원회", description: "주요 사회 현안에 대한 조사, 연구 및 대안을 마련합니다." },
                    { title: "집행기구 (사무처)", description: "실질적인 사무 행정과 실무 사업을 총괄 수행하는 기구입니다." }
                  ].map((group, idx) => (
                    <div key={idx} className="bg-transparent py-4 border-b border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent shrink-0 text-xs font-bold">
                          0{idx + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-bold mb-1 text-base sm:text-lg">{group.title}</h4>
                          <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                            {group.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'ci' && (
              <motion.div
                key="ci"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">CI 소개</h2>
                  <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
                </div>

                <div className="flex flex-col items-center justify-center space-y-6 bg-[#0F0F0F]/60 border border-slate-900 p-6 sm:p-12 rounded-3xl">
                  {/* CI Images Grid Display with hover ring glow */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                    <div 
                      onClick={() => setSelectedImage({
                        src: "https://postfiles.pstatic.net/MjAyNjA1MjhfMjQy/MDAxNzc5OTc0ODE3OTA2.k9EiF1wjYH5FmhK_rvlni7iNEkXKLAy_jKxPMEyp3vcg.HCVlggad--d-8178WsQhIpbUkvA1r6rOsvl_t_L_MpYg.JPEG/KakaoTalk_20260528_222459825.jpg?type=w3840",
                        alt: '광주시민연대 CI 소개 이미지 1'
                      })}
                      className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-transparent ring-1 ring-white/10 hover:border-accent hover:ring-4 hover:ring-accent/40 hover:shadow-[0_0_30px_var(--accent-color,#A855F7)] hover:scale-[1.03] transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group"
                    >
                      <img 
                        src="https://postfiles.pstatic.net/MjAyNjA1MjhfMjQy/MDAxNzc5OTc0ODE3OTA2.k9EiF1wjYH5FmhK_rvlni7iNEkXKLAy_jKxPMEyp3vcg.HCVlggad--d-8178WsQhIpbUkvA1r6rOsvl_t_L_MpYg.JPEG/KakaoTalk_20260528_222459825.jpg?type=w3840" 
                        alt="광주시민연대 CI 소개 이미지 1" 
                        className="max-h-60 object-contain rounded-lg transition-transform duration-300 group-hover:scale-102"
                        style={{ clipPath: 'inset(5px)' }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div 
                      onClick={() => setSelectedImage({
                        src: "https://postfiles.pstatic.net/MjAyNjA1MjhfMTYz/MDAxNzc5OTc0ODE3ODk4.9YVNYlIVXTUTT2F-QZy_88KPlsXS1V06vYq8ckf33xIg.L_JOnTgopMhlnI8OQW2Gp8uPZUW2GEuwtgppKidZvFgg.JPEG/KakaoTalk_20260528_222459825_01.jpg?type=w386",
                        alt: '광주시민연대 CI 소개 이미지 2'
                      })}
                      className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-transparent ring-1 ring-white/10 hover:border-accent hover:ring-4 hover:ring-accent/40 hover:shadow-[0_0_30px_var(--accent-color,#A855F7)] hover:scale-[1.03] transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group"
                    >
                      <img 
                        src="https://postfiles.pstatic.net/MjAyNjA1MjhfMTYz/MDAxNzc5OTc0ODE3ODk4.9YVNYlIVXTUTT2F-QZy_88KPlsXS1V06vYq8ckf33xIg.L_JOnTgopMhlnI8OQW2Gp8uPZUW2GEuwtgppKidZvFgg.JPEG/KakaoTalk_20260528_222459825_01.jpg?type=w386" 
                        alt="광주시민연대 CI 소개 이미지 2" 
                        className="max-h-60 object-contain rounded-lg transition-transform duration-300 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div 
                      onClick={() => setSelectedImage({
                        src: "https://postfiles.pstatic.net/MjAyNjA1MjhfMjMg/MDAxNzc5OTc0ODE3ODk4.EA3BW1dRIpDDX0lgK-SfO8v6ASf0Ju8kqmpuGZsD-1Ig.uHb4IZbv3I5arjuxcl-UEOyoB2JNJp_2VQw29VzOjqQg.JPEG/KakaoTalk_20260528_222459825_02.jpg?type=w3840",
                        alt: '광주시민연대 CI 소개 이미지 3'
                      })}
                      className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-transparent ring-1 ring-white/10 hover:border-accent hover:ring-4 hover:ring-accent/40 hover:shadow-[0_0_30px_var(--accent-color,#A855F7)] hover:scale-[1.03] transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group"
                    >
                      <img 
                        src="https://postfiles.pstatic.net/MjAyNjA1MjhfMjMg/MDAxNzc5OTc0ODE3ODk4.EA3BW1dRIpDDX0lgK-SfO8v6ASf0Ju8kqmpuGZsD-1Ig.uHb4IZbv3I5arjuxcl-UEOyoB2JNJp_2VQw29VzOjqQg.JPEG/KakaoTalk_20260528_222459825_02.jpg?type=w3840" 
                        alt="광주시민연대 CI 소개 이미지 3" 
                        className="max-h-60 object-contain rounded-lg transition-transform duration-300 group-hover:scale-102"
                        style={{ clipPath: 'inset(5px)' }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div 
                      onClick={() => setSelectedImage({
                        src: "https://postfiles.pstatic.net/MjAyNjA1MjhfMjQ2/MDAxNzc5OTc0ODE3OTI2.R4XPZ7en7T-Bs_aoNpdkHUj-yIQgEN-O3c9VoV6PzVgg.xXyPFLznOINNrKerhWdh7r7PkGWF-7CsWGa7ZkHgKDwg.JPEG/KakaoTalk_20260528_222459825_03.jpg?type=w386",
                        alt: '광주시민연대 CI 소개 이미지 4'
                      })}
                      className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-transparent ring-1 ring-white/10 hover:border-accent hover:ring-4 hover:ring-accent/40 hover:shadow-[0_0_30px_var(--accent-color,#A855F7)] hover:scale-[1.03] transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group"
                    >
                      <img 
                        src="https://postfiles.pstatic.net/MjAyNjA1MjhfMjQ2/MDAxNzc5OTc0ODE3OTI2.R4XPZ7en7T-Bs_aoNpdkHUj-yIQgEN-O3c9VoV6PzVgg.xXyPFLznOINNrKerhWdh7r7PkGWF-7CsWGa7ZkHgKDwg.JPEG/KakaoTalk_20260528_222459825_03.jpg?type=w386" 
                        alt="광주시민연대 CI 소개 이미지 4" 
                        className="max-h-60 object-contain rounded-lg transition-transform duration-300 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="w-full space-y-6 text-center max-w-xl">
                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-light">
                      (이 로고 디자인은 소수의 시민이 함께 한 방향을 향해 걸어가는 사람의 모습을 시각화한 것으로 푸르고 푸른 시민 운동이 전진하고 확장되는 모습을 담았습니다.)
                    </p>

                    <div className="pt-6 border-t border-white/5 space-y-2">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Logo Creator / 제작자</p>
                      <p className="text-[15px] font-bold text-white">
                        고 추응식 교수
                      </p>
                      <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                        (전 신구대 교수, 시각디자인학과장, 전 사회적협동조합 착한장터 이사장)
                      </p>
                    </div>

                    <div className="pt-4 text-xs font-semibold text-accent/90 tracking-wide bg-accent/5 py-3.5 px-4 rounded-xl border border-accent/10">
                      “평생 풀뿌리 민주주의의 가치를 꿈꾸시며 이 로고를 디자인해주신 고(故) 추응식 교수님께 깊은 감사와 존경의 마음을 전합니다.”
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'statutes' && (
              <motion.div
                key="statutes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">광주참여자치시민연대 정관</h2>
                  <p className="text-slate-500 text-sm font-light mb-4">2022. 10. 15. 제정</p>
                  <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
                </div>
                
                <div className="space-y-8 text-slate-300">
                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 1 장 총 칙
                    </h3>
                    <div className="space-y-6 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <p className="text-accent font-bold mb-1">제1조〔명칭〕</p>
                        <p>이 모임은 ‘광주참여자치시민연대’라 하고, 약칭으로 ‘광주시민연대’(이하에서 ‘본회’라 한다)라 한다.</p>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제2조〔목적〕</p>
                        <p>본회는 각계각층 시민들의 자발적인 참여로 국가 ․ 지방권력을 감시하고, 구체적인 정책과 대안을 제시하며, 실천적인 시민행동을 통하여 자유와 정의, 인권과 환경, 문화와 복지가 바르게 실현되는 참여민주사회를 건설하는 것을 목적으로 한다.</p>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제3조〔구성〕</p>
                        <p>본회는 제2조의 목적에 찬동하여 가입한 회원으로 구성하며, 회원들의 자발적 참여로 운영한다.</p>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제4조〔사업〕</p>
                        <p className="mb-2">① 본회는 제2조의 목적을 달성하기 위해 아래의 활동과 사업을 전개한다.</p>
                        <ul className="list-none space-y-1 pl-4 text-slate-400">
                          <li>1. 민주사회를 바르게 세우며 구체적으로 실현하기 위한 정책과 방법에 관한 연구와 토론 그리고 시민들의 의사 형성을 위한 사업</li>
                          <li>2. 입법, 사법, 행정 등 국가 ․ 지방자치기관의 활동에 대한 시민들의 감시와 참여</li>
                          <li>3. 인권을 옹호하고 향상시키기 위한 사회적 ․ 제도적 노력</li>
                          <li>4. 정치 ․ 경제 ․ 사회 ․ 문화 등 사회 각 분야의 비리와 부정을 고발하여 사회정의와 공익을 실현하기 위한 시민행동</li>
                          <li>5. 참여민주주의 실현을 확장하기 위한 시민교육</li>
                          <li>6. 환경보전 및 기후변화 대응 등 지속가능 발전을 위한 사업</li>
                          <li>7. 국내 ․ 외 각 단체와 연대한 조직 및 활동</li>
                          <li>8. 그 밖에 본회의 목적에 부합하는 사업</li>
                        </ul>
                        <p className="mt-2">② 본회는 목적 달성을 위한 사업경비를 충당하기 위하여 본질에 반하지 아니하는 범위에서 수익 사업을 할 수 있다.</p>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제5조〔사무소〕</p>
                        <p>본회의 사무소는 경기도 광주시에 두며, 필요에 따라 분 사무소를 둘 수 있다.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 2 장 회 원
                    </h3>
                    <div className="space-y-6 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <p className="text-accent font-bold mb-1">제6조〔회원〕</p>
                        <p>본회의 목적에 찬동하여 소정의 절차에 따라 가입을 신청하여 소정의 절차에 따라 승인된 사람은 회원이 된다.</p>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제7조〔권리〕</p>
                        <p>회원은 다음과 같은 권리를 가진다.</p>
                        <ul className="list-none space-y-1 pl-4 text-slate-400">
                          <li>1. 본회의 운영과 의사 결정에 참여할 권리</li>
                          <li>2. 본회에서 선거권과 피선거권을 행사할 권리</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제8조〔의무〕</p>
                        <p>회원은 다음과 같은 의무를 가진다.</p>
                        <ul className="list-none space-y-1 pl-4 text-slate-400">
                          <li>1. 본회의 정관과 내규를 지킬 의무</li>
                          <li>2. 본회의 목적 실현을 위한 사업과 활동에 적극적으로 참여할 의무</li>
                          <li>3. 소정의 회비를 납부할 의무</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제9조〔상벌〕</p>
                        <p>본회 발전에 지대한 공헌을 한 회원은 표창하거나 다른 기관에 표창을 상신할 수 있으며, 회원으로서 의무를 다하지 않거나 본회의 명예를 실추시킨 회원에 대해서는 내규에서 정한 절차에 따라 징계할 수 있다.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 3 장 기 구
                    </h3>
                    <div className="space-y-8 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <h4 className="text-white border-b border-white/5 pb-2 mb-4 font-bold text-xs uppercase tracking-widest text-slate-500">제1절 총회</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-accent font-bold mb-1">제11조〔지위〕</p>
                            <p>총회는 본회의 최고 의결기구로서 정기총회와 임시총회로 나뉜다.</p>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제12조〔소집〕</p>
                            <p>정기총회는 연 1회 열며, 임시총회는 재적회원 1/10 이상의 요구나 이사회의 결의가 있을 때 소집할 수 있다.</p>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제13조〔의결과 권한〕</p>
                            <div className="space-y-2">
                              <p>① 총회는 본회의 조직과 운영에 관한 중요 사항들을 토의하고 결정하며, 출석회원 과반수의 찬성으로 의결한다.</p>
                              <p>② 총회에서는 다음 사항을 결정한다.</p>
                              <ul className="list-none space-y-1 pl-4 text-slate-400">
                                <li>1. 정관의 제정 및 개정</li>
                                <li>2. 공동대표 및 상임대표의 선출</li>
                                <li>3. 이사의 선출</li>
                                <li>4. 감사의 선출</li>
                                <li>5. 예산, 결산과 사업계획의 승인</li>
                                <li>6. 그 밖에 총회에 부의된 사항의 심의</li>
                              </ul>
                              <p>③ 필요한 경우 인터넷을 이용한 총회를 병행하여 진행할 수 있다.</p>
                              <p>④ 인터넷을 이용한 총회에서의 토의, 의결 등 구체적인 운영방법은 내규로 정한다.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white border-b border-white/5 pb-2 mb-4 font-bold text-xs uppercase tracking-widest text-slate-500">제2절 이사회</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-accent font-bold mb-1">제14조〔지위〕</p>
                            <p>이사회는 총회의 위임을 받아 본회의 조직과 운영, 사업과 활동에 관한 중요한 사항들을 토의하고 결정하는 상설 의결기구이다.</p>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제15조〔구성〕</p>
                            <div className="space-y-2">
                              <p>① 이사는 회원의 피선거권이 보장되도록 내규에 따라 선출하고, 공동대표, 집행기구의 장 등 임원을 포함하여 30명 이내로 구성한다.</p>
                              <p>② 이사회는 상임대표가 의장으로서 소집하고 주관하며, 집행위원장은 간사로 참여한다.</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제16조〔임기〕</p>
                            <p>이사의 임기는 2년으로 연임할 수 있다.</p>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제17조〔소집〕</p>
                            <p>이사회는 매 분기마다 소집하는 정기이사회와 재적이사 1/4 이상의 요구나 상임대표가 필요한 경우 소집하는 임시이사회로 구분한다.</p>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제18조〔의결〕</p>
                            <p>이사회는 재적이사 과반수의 출석으로 개회하며 출석위원 과반수의 찬성으로 의결한다.</p>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제19조〔권한〕</p>
                            <p>이사회의 권한은 다음과 같다.</p>
                            <ul className="list-none space-y-1 pl-4 text-slate-400">
                              <li>1. 공동대표 및 상임대표, 이사의 추천</li>
                              <li>2. 집행위원장 및 정책위원장의 인준</li>
                              <li>3. 각 활동기구 및 부설기관의 장의 인준</li>
                              <li>4. 결산서의 심의</li>
                              <li>5. 사업계획안 및 예산안의 심의</li>
                              <li>6. 내규의 제정, 개정 및 폐지</li>
                              <li>7. 총회에 부의할 안건의 심의</li>
                              <li>8. 그밖에 이사회에 부의된 사항의 심의</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white border-b border-white/5 pb-2 mb-4 font-bold text-xs uppercase tracking-widest text-slate-500">제3절 공동대표 등</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-accent font-bold mb-1">제20조〔공동대표〕</p>
                            <div className="space-y-2">
                              <p>① 본회를 대표하기 위해 6명 이내의 공동대표를 두며, 공동대표 중에서 1명은 청년대표로 한다.</p>
                              <p>② 상임대표는 상시적으로 사업 및 활동 등 회무 집행을 총괄하며 대외적으로 본회를 대표하며 공동대표 중 1명이 맡는다.</p>
                              <p>③ 상임대표를 포함한 공동대표는 회원의 피선거권이 보장될 수 있도록 내규에 따라 이사회의 추천으로 총회에서 선출하며, 임기는 2년으로 연임 할 수 있다.</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제21조〔감사〕</p>
                            <div className="space-y-2">
                              <p>① 본회의 사업과 재정을 감사하기 위해 사업 및 재정을 담당하는 2명의 감사를 둔다.</p>
                              <p>② 감사는 총회에서 선출하며, 임기는 2년으로 연임할 수 있다.</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제22조〔고문 및 자문위원〕</p>
                            <div className="space-y-2">
                              <p>① 본회의 임원으로 활동하거나 사회적 신망이 두터워 본회의 발전에 기여할 수 있는 인사는 이사회 결의로 고문으로 위촉할 수 있다.</p>
                              <p>② 본회의 사업 및 활동을 원활히 하기 위하여 전문지식과 활동 연대 등에 필요한 경우 이사회 결의로 자문위원을 둘 수 있다.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white border-b border-white/5 pb-2 mb-4 font-bold text-xs uppercase tracking-widest text-slate-500">제4절 집행위원회</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-accent font-bold mb-1">제23조〔지위〕</p>
                            <p>집행위원회는 총회와 이사회의 의결사항을 집행하며, 정관에 명시된 사업과 활동을 추진하는 상설 기구이다.</p>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제24조〔구성〕</p>
                            <div className="space-y-2">
                              <p>① 집행위원회는 집행위원장, 정책위원장, 각 활동기구의 장, 각 부설기관의 장으로 구성한다. 각 활동기구와 부설기관에 대한 기준과 범위는 내규로 정한다.</p>
                              <p>② 집행위원회는 집행위원장이 소집하고 주관한다.</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제25조〔임면〕</p>
                            <p>집행위원장 및 정책위원장과 각 활동기구의 장 및 각 부설기관의 장 등 집행위원은 상임대표가 임면한다.</p>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제26조〔권한〕</p>
                            <div className="space-y-2">
                              <p>① 집행위원회는 본회의 사업과 활동을 추진하기 위해 필요한 기구를 조직 ․ 관리하며, 사업과 예산 편성안을 이사회에 제안 상정하고, 결의사항을 집행한다.</p>
                              <p>② 집행위원회는 정책위원회 및 각 활동기구, 각 부설기관의 활동을 지원하며 이를 위해 사무처를 둘 수 있다.</p>
                              <p>③ 집행위원회의 운영에 관한 사항은 내규로 정한다.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white border-b border-white/5 pb-2 mb-4 font-bold text-xs uppercase tracking-widest text-slate-500">제5절 활동기구 등</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-accent font-bold mb-1">제27조〔정책위원회〕</p>
                            <div className="space-y-2">
                              <p>① 본회가 추진할 사업과 정책 연구를 위해 정책위원회를 둔다.</p>
                              <p>② 정책위원회는 정책연구에 시민과 전문가의 다양한 의견과 여론이 반영될 수 있도록 정책자문위원을 둘 수 있다.</p>
                              <p>③ 정책위원회의 구성과 운영에 관한 사항은 내규로 정한다.</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제28조〔활동기구〕</p>
                            <div className="space-y-2">
                              <p>① 본회의 목적을 원활하게 수행하고 달성하기 위해 이사회 의결에 따라 필요한 활동기구를 둘 수 있다.</p>
                              <p>② 각 활동기구의 구성과 운영에 관한 사항은 내규로 정한다.</p>
                              <p>③ 각 활동기구는 본회의 목적과 내규에서 정하는 사업을 효율적으로 수행하기 위하여 이사회의 승인을 얻어 별도의 추진조직을 둘 수 있다.</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제29조〔지역조직〕</p>
                            <p>본회의 각 활동기구의 사업을 원활하게 수행하기 위하여 필요한 경우 이사회 의결에 따라 읍 ․ 면 ․ 동 등 행정단위 별로 지역조직을 둘 수 있다.</p>
                          </div>
                          <div>
                            <p className="text-accent font-bold mb-1">제30조〔부설기관〕</p>
                            <p>본회의 사업과 관련한 시민 교육 및 연구 용역을 수행하거나 시민 일반에 대한 홍보와 참여를 유도하기 위해 필요한 경우 이사회 의결에 따라 부설기관을 둘 수 있다.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 4 장 재 정
                    </h3>
                    <div className="space-y-6 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <p className="text-accent font-bold mb-1">제31조〔회계연도〕</p>
                        <p>본회의 회계연도는 매년 1월 1일부터 12월 31일까지로 한다.</p>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제32조〔예산과 결산〕</p>
                        <div className="space-y-2">
                          <p>① 집행위원장은 다음 해 사업계획에 따른 예산안을 이사회에 제출하여 심의하고 총회에서 승인받아야 한다.</p>
                          <p>② 집행위원장은 본회의 감사로부터 회계연도 경과 1개월 내에 감사를 받은 전년도 결산서를 이사회에 제출하여 심의하고 총회에서 승인받아야 한다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제33조〔수입〕</p>
                        <div className="space-y-2">
                          <p>① 본회의 수입은 회원의 회비, 후원금, 특별 모금, 그 밖의 사업수익으로 한다.</p>
                          <p>② 집행위원장은 본회 인터넷 홈페이지를 통해 수입과 지출내용을 매 분기별로 공개해야 한다.</p>
                          <p>③ 집행위원장은 본회 및 국세청의 인터넷 홈페이지를 통해 연간 기부금 모금액 및 활용실적을 공개해야 한다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제34조〔재정위원회〕</p>
                        <div className="space-y-2">
                          <p>① 본회는 본회의 사업과 활동에 필요한 재정수요 등을 고려하여 재정위원회를 둘 수 있다.</p>
                          <p>② 재정위원회의 구성과 운영에 관한 사항은 내규로 정한다.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 5 장 해 산
                    </h3>
                    <div className="space-y-6 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <p className="text-accent font-bold mb-1">제35조〔해산〕</p>
                        <p>본회는 아래의 사유가 있을 때 해산된다.</p>
                        <ul className="list-none space-y-1 pl-4 text-slate-400">
                          <li>① 재적회원의 2/3 이상의 요구에 의해 소집된 총회에서 해산을 의결한 경우</li>
                          <li>② 법원의 해산판결이 있는 경우</li>
                          <li>③ 권한있는 기관의 인허가 취소 및 해산명령 등이 있는 경우</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제36조〔해산 절차〕</p>
                        <div className="space-y-2">
                          <p>① 전조에 해당하는 경우 본회는 관계법령 및 내규에 따른 해산절차를 밟는다.</p>
                          <p>② 청산에 필요한 업무 처리를 위해 총회에서 청산위원회를 구성한다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제37조〔잔여재산의 처리〕</p>
                        <p>본회가 해산하는 경우 잔여재산은 총회 의결에 따라 국가, 지방자치단체 또는 본회의 설립취지와 유사한 목적을 가진 비영리단체에 귀속시킨다.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 6 장 보 칙
                    </h3>
                    <div className="space-y-6 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <p className="text-accent font-bold mb-1">제38조〔정치적 중립〕</p>
                        <div className="space-y-2">
                          <p>① 공동대표, 이사, 감사, 집행위원장, 각 활동기구의 장, 부설기관의 장 등 임원은 공직에 취임하거나 공직 선거에 입후보할 경우 즉시 사임하여야 한다.</p>
                          <p>② 공직선거에 출마하기 위하여 선거관리위원회에 후보자 또는 예비후보자로 등록했던 자는 해당 공직선거일부터 4년간 회원가입과 임원선임을 제한할 수 있다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제39조〔준용규정〕</p>
                        <div className="space-y-2">
                          <p>① 정관에 명시되지 않은 사항은 내규 또는 이사회 결의에 따른다.</p>
                          <p>② 내규는 이사회에서 제정, 개정 및 폐지할 수 있고 그 내용은 다음 총회에 보고한다.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="pt-8 border-t border-white/5">
                    <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-slate-700 rounded-full" />
                      부 칙
                    </h3>
                    <div className="space-y-4 text-sm leading-relaxed pl-3 font-light text-slate-400 italic">
                      <div>
                        <p className="mb-1">(2022. 10. 15. 제정)</p>
                        <p><strong className="text-slate-300 font-medium whitespace-nowrap">제1조〔시행일〕</strong> 이 정관은 창립총회에서 의결되는 때부터 효력을 발생하며, 즉시 시행된다.</p>
                        <p><strong className="text-slate-300 font-medium whitespace-nowrap">제2조〔창립준비위원회〕</strong> 창립총회에서 본 정관이 의결되기 전에 임원 추천, 총회 의결 및 회원 가입 등을 위한 이사회 및 집행위원회의 권한은 본회 창립준비위원회가 갖으며, 총회에서 정관제정이 의결된 경우 이를 추인한 것으로 본다.</p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="flex justify-center mt-8">
                  <a 
                    href="https://cafe.naver.com/gjpp2022" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent text-sm hover:underline flex items-center gap-2"
                  >
                    원문 출처 보기 (Naver Cafe) <Shield className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}

            {activeTab === 'rules' && (
              <motion.div
                key="rules"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">광주참여자치시민연대 규칙</h2>
                  <p className="text-slate-500 text-sm font-light mb-4">2022. 11. 02. 제정</p>
                  <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
                </div>

                <div className="space-y-8 text-slate-300">
                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 1 장 총 칙
                    </h3>
                    <div className="space-y-6 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <p className="text-accent font-bold mb-1">제1조〔목적〕</p>
                        <p>이 규칙은 ‘광주참여자치시민연대’(이하 “본회”라 한다)의 활동 및 운영에 관한 세부적인 사항을 정해 원활한 운영과 목적사업에 관한 활동을 지원하는 것을 목적으로 한다.</p>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제2조〔약칭과 영문명칭〕</p>
                        <p>본회의 약칭으로는 ‘광주시민연대’ 또는 ‘광주참여연대’, 영문명칭으로는 ‘Gwangju People power’ 또는 ‘Solidarity of Participants for Gwangju Community’로 하며, 이 중 하나를 선택하거나 병기할 수 있다.</p>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제3조〔효력〕</p>
                        <p>이 규칙은 본회의 운영에 있어서 임원 및 회원들이 성실히 준수하여야 하며, 본회의 정관과 이 규칙에 따른 방법과 절차에 위반된 각 기관의 의결과 활동은 총회의 결의가 없는 한 효력이 없다.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 2 장 회 원
                    </h3>
                    <div className="space-y-6 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <p className="text-accent font-bold mb-1">제4조〔회원 가입〕</p>
                        <div className="space-y-2">
                          <p>① 본회의 목적에 찬동하여 회비납부를 포함한 가입신청서를 제출한 개인 및 단체는 회원이 될 수 있다.</p>
                          <p>② 가입신청서를 제출한 개인 및 단체에 대해 일정한 기간별로 이사회에서 회원의 적격여부 등을 심사하여 승인하면 가입신청을 한 날부터 소급하여 회원의 자격이 부여된다.</p>
                          <p>③ 회원가입신청에 대하여 이사회에서 회원의 자격이 거부되거나 제한되는 경우에는 그 사실을 신청자에게 통보해야한다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제5조〔회원의 권리와 의무〕</p>
                        <div className="space-y-2">
                          <p>① 정관에서 정한 선거권 및 피선거권 등 회원의 권리는 개인이 아닌 단체인 회원에게 제한된다.</p>
                          <p>② 정관에서 정한 회비납부 등 일정한 의무를 다하지 않은 경우에는 회원의 권리를 제한할 수 있다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제6조〔회비 등〕</p>
                        <div className="space-y-2">
                          <p>① 본회 회원은 다음과 같이 월 회비를 납부한다.</p>
                          <ul className="list-none space-y-1 pl-4 text-slate-400">
                            <li>1. 일반 회원 : 1만원, 2만원, 3만원, 5만원, 10만원(선택)</li>
                            <li>2. 청소년, 아동 : 3천원, 5천원(선택)</li>
                          </ul>
                          <p>② 본회는 조직력 강화 및 재정사정 등을 고려하여 임원들에 대해 다음과 같이 분담금을 정할 수 있다. 다만 청년인 임원은 제외하거나 따로 정할 수 있다.</p>
                          <ul className="list-none space-y-1 pl-4 text-slate-400">
                            <li>1. 각 활동기구의 장, 부설기관의 장, 이사, 감사 : 월 5만원</li>
                            <li>2. 공동대표 : 월 10만원</li>
                          </ul>
                          <p>③ 회비(제2항에 따른 분담금을 포함한다)는 금융결제원 통합결제시스템(CMS), 자동이체등록 방식 등 본회에서 정한 방식으로 납부하여야 한다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제7조〔회원의 상벌〕</p>
                        <div className="space-y-2">
                          <p>① 이사회는 가입 이후 회비를 성실하게 납부하고 본회 발전에 지대한 공헌을 한 회원에 대하여 본회 상임대표 표창대상으로 삼거나 정부 및 지방자치단체 등 다른 기관에 표창을 상신할 수 있다.</p>
                          <p>② 이사회는 회원으로서 의무를 상당기간 이행하지 않거나 대내외적으로 본회의 명예를 실추시킨 회원 및 제11조에 따른 정치적 중립의무를 위반한 임원에 대해서는 다음과 같이 징계할 수 있다.</p>
                          <ul className="list-none space-y-1 pl-4 text-slate-400">
                            <li>1. 제명 / 2. 회원권리 정지 / 3. 경고 / 4. 주의 / 5. 직위해제(임원에 한한다) / 6. 해임(임원에 한한다)</li>
                          </ul>
                          <p>③ 회원의 상벌사항에 대한 사전준비 및 조사활동을 위해 상임대표, 집행위원장, 사무처장 등으로 구성되는 상벌조사위원회를 구성하여 심의자료를 준비하고 이를 이사회에 상신한다.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 3 장 임 원
                    </h3>
                    <div className="space-y-6 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <p className="text-accent font-bold mb-1">제8조〔임원〕</p>
                        <div className="space-y-2">
                          <p>① “임원”은 상임대표를 포함한 공동대표, 이사, 감사, 집행위원장, 정책위원장, 각 활동기구의 장, 부설기관의 장을 말한다.</p>
                          <p>② 임원은 회원으로서 권한있는 기관에서 선출 또는 선임되는 때부터 임원의 자격을 가지며, 임기의 만료일 및 자진사퇴의 승인, 제7조에 따른 해임이 의결된 날에 임기가 종료된다.</p>
                          <p>③ 임원이 사퇴하고자 하는 경우에는 본회에 사퇴서를 제출해야 하며 이에 대하여 이사회에서 의결된 경우 임원의 퇴임이 확정된다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제9조〔공동대표 및 이사의 추천〕</p>
                        <div className="space-y-2">
                          <p>① 이사회는 상임대표를 포함한 공동대표와 이사의 임기가 만료되거나 사퇴 등으로 결원이 발생한 경우 총회에 후보를 추천하기 위하여 상임대표를 위원장으로 하는 임원추천위원회를 구성하여 전 회원을 대상으로 후보를 공모해야 한다.</p>
                          <p>② 임원추천위원회는 공모결과와 심사자료를 이사회에 보고하고 이사회는 그 내용을 바탕으로 심의하여 최종 후보를 총회에 추천한다.</p>
                          <p>③ 공동대표 및 이사를 새로 공모하거나 심사할 때는 본회 회원으로서의 활동, 본회에 대한 기여도, 업무추진력, 전문성, 청렴성, 대외적인 평판과 정치적 중립성 등을 반영한 객관적인 평가자료에 따라야 하며, 후보자에게는 업무수행계획 등 청문의 기회를 공정하게 부여해야 한다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제10조〔임원의 임면〕</p>
                        <div className="space-y-2">
                          <p>① 상임대표의 자리가 빈 경우(궐위)에는 공동대표의 자격이 있는 자 중에서 호선하여 전임자의 잔여임기 동안 상임대표를 맡되총회에서 인준받아야 하며, 공동대표 및 이사 등 선출직 임원의 자리가 빈 경우에는 이사회의 추천으로 총회에서 추가로 선임될 때까지는 결원으로 본다.</p>
                          <p>② 상임대표는 집행위원장, 정책위원장, 재정위원장, 각 활동기구의 장, 각 부설기관의 장 등 집행위원회 구성원을 선임한다.</p>
                          <p>③ 공동대표로 선출되거나 제2조에 따라 집행위원회의 구성원으로 선임되어 이사회에서 인준된 경우 당연직 이사로 이사회의 구성원이 된다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제11조〔임원 회비〕</p>
                        <p>임원은 선출 또는 선임된 날이 속하는 달부터 제6조 제1항 및 제2항에서 정한 회비 및 임원 분담금을 납부하여야 한다.</p>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제12조〔임원의 정치중립〕</p>
                        <div className="space-y-2">
                          <p>① 임원은 이사회에서 승인받는 경우를 제외하고는 당적을 가지거나 특정 정당이나 후보를 위해 선거운동을 할 수 없다.</p>
                          <p>② 공동대표는 어떠한 경우도 당적을 가질 수 없으며, 취임한 경우 활동을 개시하기 전에 사퇴해야 한다.</p>
                          <p>③ 이사회 승인 없이 임원이 당적을 갖거나 선거운동을 하고자 하는 경우에는 임원을 사퇴하여야 한다.</p>
                          <p>④ 임원이 제1항부터 제3항까지를 위반한 경우 제7조에 따른 징계 대상이 된다.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 4 장 고문 및 자문위원
                    </h3>
                    <div className="space-y-6 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <p className="text-accent font-bold mb-1">제13조〔고문〕</p>
                        <div className="space-y-2">
                          <p>① 이사회는 본회의 임물으로 성실하게 활동하고 퇴임하였거나, 사회적 신망이 두터워 본회의 발전에 기여할 수 있는 인사를 대상으로 10명 이내에서 고문을 추대할 수 있다.</p>
                          <p>② 상임대표는 고문으로 구성된 고문위원회를 구성하여 대외교섭 및 홍보 등 회무를 지원하게 할 수 있다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제14조〔자문위원〕</p>
                        <div className="space-y-2">
                          <p>① 이사회는 국제, 법률, 세무, 노동, 인권, 공동체, 청년 등 전문성 및 본회의 발전에 도움이 되는 분야의 전문가를 자문위원을 위촉할 수 있다.</p>
                          <p>② 상임대표는 자문위원으로 구성된 자문위원회를 구성하여 회원 및 시민상담 등 회무를 지원하게 할 수 있다.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-base mb-6 flex items-center gap-2 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md py-2 z-10">
                      <span className="w-1 h-4 bg-accent rounded-full" />
                      제 5 장  집행위원회 및 사무처
                    </h3>
                    <div className="space-y-6 text-sm leading-relaxed pl-3 font-light">
                      <div>
                        <p className="text-accent font-bold mb-1">제15조〔소집〕</p>
                        <p>집행위원회는 매월 1회 이상 일정한 날을 정해 개최하며, 부득이한 경우에는 사전에 고지하여 변경할 수 있다.</p>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제16조〔회의〕</p>
                        <div className="space-y-2">
                          <p>① 집행위원회는 집행위원장, 정책위원장, 재정위원장, 각 활동기구의 장, 각 부속기관의 장으로 구성되며, 사무처장이 간사가 된다.</p>
                          <p>② 집행위원장은 위원회 3일 전까지 각 활동기구 등 집행위원으로부터 보고 및 심의사항을 수집하고 이를 참고하여 회의자료를 준비하여야 한다.</p>
                          <p>③ 집행위원회의 안건은 재적위원 과반 이상의 참석에 참석위원 과반 이상의 찬성으로 의결된다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제17조〔확대회의〕</p>
                        <div className="space-y-2">
                          <p>① 상임대표를 비롯한 공동대표는 집행위원회의 안건이 중대하다고 판단되는 경우에는 집행위원회에 참여하여 의견을 개진할 수 있다.</p>
                          <p>② 집행위원장은 회의 및 의결에 참고하고자 필요한 경우 지방의회 및 지방정부 등 유관기관 관계인 및 관련 회원의 참가를 요청할 수 있다.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-accent font-bold mb-1">제18조〔회의록〕</p>
                        <div className="space-y-2">
                          <p>① 집행위원장은 집행위원회의 회의내용을 녹취하거나 속기록을 통해 소정의 회의록을 작성하여야 한다.</p>
                          <p>② 회의록은 의장을 비롯해 참석한 집행위원 2인 이상이 서명 또는 기명날인하고 사무처에 보관한다.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="pt-8 border-t border-white/5">
                    <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-slate-700 rounded-full" />
                      부 칙
                    </h3>
                    <div className="space-y-4 text-sm leading-relaxed pl-3 font-light text-slate-400 italic">
                      <div>
                        <p className="mb-1">(2022. 11. 02. 제정)</p>
                        <p><strong className="text-slate-300 font-medium whitespace-nowrap">제1조〔시행일〕</strong> 이 규칙은 이사회에서 의결한 날부터 효력을 발생하며, 즉시 시행된다.</p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="flex justify-center mt-8">
                  <a 
                    href="https://cafe.naver.com/gjpp2022" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent text-sm hover:underline flex items-center gap-2"
                  >
                    원문 출처 보기 (Naver Cafe) <Gavel className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">광주참여자치시민연대 연혁</h2>
                  <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
                  <p className="text-slate-500 text-sm font-light mt-4">
                    시민의 주권과 참여자치를 가치로 삼고 걸어온 광주참여자치시민연대의 역사입니다.
                  </p>
                </div>

                <div className="relative border-l border-slate-850 ml-2 md:ml-24 py-1 space-y-8">
                  {[
                    {
                      year: "2026",
                      events: [
                        { date: "03월", title: "아동 복지 행정 지체 개혁 촉구 및 아동권리보장원 관련 성명 발표" },
                        { date: "01월", title: "제4회 광주시민연대 생태걷기 행사 성료" }
                      ]
                    },
                    {
                      year: "2025",
                      events: [
                        { date: "12월", title: "위례~삼동선 복선전철 기재부 예타 통과 및 조기 착공 촉구 공동 결의" },
                        { date: "11월", title: "독립 환경다큐 <종이 울리는 순간> 특별상영회 및 GV 대시민 문화행사 성료" },
                        { date: "09월", title: "상수도 재정 투명 집행 및 광주시 물 행정 총체적 재정비 촉구 성명 발표" },
                        { date: "08월", title: "평화의 소녀상 건립 기념 및 윤미향 전의원 초청 '시민과 평화' 토크콘서트 개최" },
                        { date: "06월", title: "광주시민연대 고문단과 시민·회원 합동 대토론 차담회 개최" },
                        { date: "02월", title: "헌정 수호와 정의 실천을 위한 경기광주시민촛불 광장 행동 동정" }
                      ]
                    },
                    {
                      year: "2024",
                      events: [
                        { date: "11월", title: "수도요금 대폭 인상 철회 요구 범시민 가두 2차 서명운동 지속 전개" },
                        { date: "11월", title: "창립 2주년 기념 '시민다방' 행사 및 후원의 밤 사랑방 개최" },
                        { date: "10월", title: "경기도 광주시 수도요금 기습 인상 조례 유예 촉구 연대 시민 집회 및 서명" },
                        { date: "06월", title: "지방의회 투명성 감시를 위한 광주시의회 정례회 정식 의정모니터링 평가 및 보고서 배포" },
                        { date: "05월", title: "참다운 소통을 위한 시민 합동 '독립다큐영화 시사회' 및 간담회 개최" },
                        { date: "03월", title: "제22대 총선 정치개혁 후보 초청 토론회 추진 및 대시민 공약가이드 제공" }
                      ]
                    },
                    {
                      year: "2023",
                      events: [
                        { date: "12월", title: "시의회 수도요금 인상안 심의 보류 및 재검토 유도 공식 성과" },
                        { date: "11월", title: "경기 광주시 기습 수도요금 인상 계획 즉각 철회 요구 성명 및 반대 집회 주도" },
                        { date: "10월", title: "광주 시민사회 합동 '수도요금 대폭 인상 철회' 범시민 서명 운동 전개" },
                        { date: "09월", title: "도심 빌라촌 주민생활 주거환경 개선 및 자치참여 확대 현장 활동 전개" },
                        { date: "08월", title: '“광주는 시민이 주인인가” 행정 관료주의 권위 혁파 촉구 성명서 발표' },
                        { date: "07월", title: "시청 스피드게이트 출입통제 시스템 강행 반대 규탄 및 투명 행정 요구 투쟁" }
                      ]
                    },
                    {
                      year: "2022",
                      events: [
                        { date: "12월", title: "(사)한국농아인협회 경기도협회 광주시지회 사랑의 이웃돕기 성금 전달" },
                        { date: "12월", title: "창립 이후 최초 시의회 정례회 정식 의정모니터링 무정파 완수 및 공표" },
                        { date: "11월", title: "예산 검시 및 행정 투명성 보장 차원의 광주시 핵심 도시 개발 사업 정보공개 청구" },
                        { date: "11월 02일", title: "본회 회칙 및 실행 자치 운영에 관한 규칙 공식 제정" },
                        { date: "10월 18일", title: "경향신문 외 다수 언론에 경기 광주 첫 시민주도 무정파 시민단체 출범 일자 대대적 보도" },
                        { date: "10월 15일", title: "광주참여자치시민연대(약칭 광주시민연대) 역사적 창립 정식 총회 성료 (창립 발기인 53인, 대표 구재이)" },
                        { date: "10월 12일", title: "참자치 교두보 마련 and 예산 감시 전문화를 위한 단체 설립 선포" }
                      ]
                    }
                  ].map((group, groupIdx) => (
                    <div key={groupIdx} className="relative">
                      {/* Year bubble on the left desktop, top on mobile */}
                      <div className="absolute -left-2 md:-left-24 top-0 flex items-center md:justify-end w-16 md:w-20 text-left md:text-right">
                        <span className="text-lg md:text-xl font-black text-accent font-sans md:pr-2">{group.year}</span>
                      </div>

                      {/* Timeline dot */}
                      <div className="absolute -left-[6px] top-2.5 w-3 h-3 bg-accent rounded-full border border-slate-950 shadow-lg shadow-accent/40" />

                      <div className="pl-6 md:pl-8 space-y-4 pt-1">
                        {group.events.map((event, eventIdx) => (
                          <div key={eventIdx} className="group/item">
                            <span className="inline-block text-[10px] md:text-xs font-bold text-slate-500 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded-full mb-1">
                              {event.date}
                            </span>
                            <p className="text-slate-300 group-hover/item:text-white text-sm md:text-base font-light transition-colors duration-200">
                              {event.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'location' && (
              <motion.div
                key="location"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">오시는 길</h2>
                  <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
                  <p className="text-slate-500 text-xs font-light mt-3">
                    광주참여자치시민연대 찾아주시는 길과 대중교통 이용 안내입니다.
                  </p>
                </div>

                {/* Main Info */}
                <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-accent">Office Location</span>
                    <h4 className="text-lg font-bold text-white">사무국 주소</h4>
                    <p className="text-slate-400 font-light text-sm">
                      경기 광주시 양촌길 124-8(3층)
                    </p>
                  </div>
                  <button 
                    onClick={handleCopyAddress}
                    className="bg-slate-800 hover:bg-slate-750 border border-slate-705 hover:border-slate-600 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAddress ? '주소 복사 완료!' : '주소 전체 복사'}</span>
                  </button>
                </div>

                {/* Maps Integration */}
                <div className="space-y-4">
                  {/* Dynamic Map Platform Selector */}
                  <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 self-start max-w-sm">
                    <button 
                      onClick={() => setActiveMap('kakao')}
                      className={`flex-1 py-2 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeMap === 'kakao' ? 'bg-[#FFE812] text-[#3D2005] shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      카카오맵
                    </button>
                    <button 
                      onClick={() => setActiveMap('naver')}
                      className={`flex-1 py-2 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeMap === 'naver' ? 'bg-[#03C75A] text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      네이버 지도
                    </button>
                    <button 
                      onClick={() => setActiveMap('google')}
                      className={`flex-1 py-2 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeMap === 'google' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      구글 지도
                    </button>
                  </div>

                  <div className="h-[280px] sm:h-[350px] md:h-[400px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-950">
                    {activeMap === 'google' ? (
                      <iframe 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent('경기 광주시 양촌길 124-8')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : activeMap === 'kakao' ? (
                      <div className="w-full h-full flex flex-col justify-between p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white relative">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFE812]/5 blur-[120px] rounded-full -mr-20 -mt-20" />
                        
                        <div className="space-y-4 relative z-10">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#FFE812] text-[#3D2005] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">Kakao Map</span>
                            <span className="text-slate-500 text-xs">| 실시간 길찾기 & 최신 정보</span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">광주참여자치시민연대</h3>
                            <p className="text-slate-400 font-light text-xs md:text-sm">경기 광주시 양촌길 124-8(3층)</p>
                          </div>
                          
                          <div className="pt-2 flex flex-col sm:flex-row gap-y-1 gap-x-6 text-xs text-slate-400">
                            <div>• <strong className="text-slate-300 font-semibold">경기광주역</strong>에서 버스/택시 이용 양촌마을 방면</div>
                          </div>
                        </div>

                        <div className="space-y-2 relative z-10">
                          <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                            ※ 카카오맵은 브라우저 보안 규제에 따른 오류 발생을 방지하기 위해, 원클릭 모바일 앱 또는 공식 전용 지도로 이동하여 실시간 최적 대중교통 경로를 즉시 검색해줍니다.
                          </p>
                          <a 
                            href={`https://map.kakao.com/?q=${encodeURIComponent('경기 광주시 양촌길 124-8')}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#FFE812] text-[#3D2005] hover:brightness-105 active:scale-[0.99] px-6 py-3.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/5 cursor-pointer"
                          >
                            <Map className="w-4 h-4 shrink-0" />
                            <span>카카오맵에서 빠른 길찾기 실행</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col justify-between p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white relative">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#03C75A]/5 blur-[120px] rounded-full -mr-20 -mt-20" />
                        
                        <div className="space-y-4 relative z-10">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#03C75A] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">Naver Map</span>
                            <span className="text-slate-500 text-xs">| 고해상도 위성뷰 & 상세 자차 내비 지원</span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">광주참여자치시민연대</h3>
                            <p className="text-slate-400 font-light text-xs md:text-sm">경기 광주시 양촌길 124-8(3층)</p>
                          </div>
                          
                          <div className="pt-2 flex flex-col sm:flex-row gap-y-1 gap-x-6 text-xs text-slate-400">
                            <div>• <strong className="text-slate-300 font-semibold">내비게이션</strong> '양촌길 124-8' 검색</div>
                            <div>• 건물 주차 공간 이용 가능</div>
                          </div>
                        </div>

                        <div className="space-y-2 relative z-10">
                          <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                            ※ 네이버지도 앱 또는 공식 사이트를 통해 선명한 로드뷰 사진과 상세 도보 전용 네비게이션을 이용하실 수 있습니다.
                          </p>
                          <a 
                            href={`https://map.naver.com/v5/search/${encodeURIComponent('경기 광주시 양촌길 124-8')}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#03C75A] text-white hover:brightness-105 active:scale-[0.99] px-6 py-3.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/5 cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4 shrink-0" />
                            <span>네이버 지도로 빠른 길찾기 실행</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Public Transportation Guides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-slate-900/10 p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-white text-sm">대중교통 (버스)</h4>
                    </div>
                    <div className="text-slate-400 text-xs font-light space-y-2 leading-relaxed">
                      <p>
                        <strong className="text-slate-300 font-medium">[밀목.광주시청삼거리] 정류장 하차</strong> (도보 2분)
                      </p>
                      <p>• 간선/일반 버스: 32, 320, 660, 31-3, 33-2</p>
                      <p>• 광역 버스: 1113-1, 1113-2, 500-1</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/10 p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-white text-sm">지하철 연계 및 자차</h4>
                    </div>
                    <div className="text-slate-400 text-xs font-light space-y-2 leading-relaxed">
                      <p>
                        <strong className="text-slate-300 font-medium">• 경강선 경기광주역 이용 시:</strong><br />
                        경기광주역에서 버스로 환승하여 약 10분 소요 (시청 방면 버스 탑승)
                      </p>
                      <p>
                        <strong className="text-slate-300 font-medium">• 자가용 이용 시:</strong><br />
                        도로명 주소 '양촌길 124-8' 검색, 건물 주차 공간 이용 가능
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Lightbox Modal */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                onClick={() => setSelectedImage(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                  className="relative max-w-4xl w-full bg-[#161616] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full transition-colors cursor-pointer"
                    title="닫기"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Modal Header */}
                  <div className="text-center w-full px-8">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                      {selectedImage.alt}
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      클릭하여 닫거나 아래 버튼으로 원본 이미지를 다운로드 하실 수 있습니다.
                    </p>
                  </div>

                  {/* Large Image Preview */}
                  <div className="bg-white p-6 rounded-2xl border border-white/5 shadow-inner max-h-[60vh] overflow-auto flex items-center justify-center">
                    <img
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      className="max-h-[50vh] object-contain rounded-lg shadow-md"
                      style={
                        selectedImage.src.includes('222459825.jpg') || selectedImage.src.includes('222459825_02.jpg')
                          ? { clipPath: 'inset(5px)' }
                          : undefined
                      }
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleDownload(selectedImage.src, `${selectedImage.alt}.jpg`)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:brightness-110 active:scale-98 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-accent/20 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      원본 이미지 다운로드
                    </button>
                    
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-xl text-sm transition-all cursor-pointer"
                    >
                      닫기
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
