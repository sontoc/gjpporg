import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, ExternalLink, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsPage: React.FC = () => {
  const newsItems = [
    {
      id: 31,
      title: "광주참여자치시민연대, '광주정계 개편' 대토론회 연다",
      source: "교차로저널",
      date: "2026-05-02",
      url: "https://www.kocus.com/news/articleView.html?idxno=421675",
      excerpt: "내년 지방선거를 앞두고 지역 정치권의 변화와 시민 참여를 확대하기 위한 대토론회가 열립니다. 광주참여자치시민연대는 시민 중심의 정계 개편 방향을 제시할 예정입니다."
    },
    {
      id: 30,
      title: "'광주참여자치시민연대' 창립 기념식... '참여하는 시민이 주권자' 다짐",
      source: "교차로저널",
      date: "2026-04-28",
      url: "https://www.kocus.com/news/articleView.html?idxno=421500",
      excerpt: "창립을 기점으로 그동안의 성과를 돌아보고 향후 지역 사회의 투명성 제고와 시민 주권 확립을 위한 활동 방향을 선포했습니다."
    },
    {
      id: 29,
      title: "광주시민연대, '수도권 규제 완화 반대' 공동 성명 발표",
      source: "경인일보",
      date: "2026-04-15",
      url: "https://blog.naver.com/gjct21/223354210100",
      excerpt: "지역 균형 발전을 저해하고 팔당 상수원 보호 구역의 환경 파괴를 가속화하는 정부의 규제 완화 정책에 대해 시민들의 목소리를 모아 반대 성명을 냈습니다."
    },
    {
      id: 28,
      title: "광주시의회 의정비 동결 촉구... 광주시민연대 '민생 우선' 강조",
      source: "교차로저널",
      date: "2026-03-22",
      url: "https://www.kocus.com/news/articleView.html?idxno=421256",
      excerpt: "고물가와 경제 위기로 고통받는 시민들의 정서를 고려하여 시의원들의 의정활동비 동결을 강력히 요구하며 시의회의 동참을 촉구했습니다."
    },
    {
      id: 27,
      title: "광주시민연대, '찾아가는 시민 교육' 프로그램 큰 호응",
      source: "교차로저널",
      date: "2026-02-20",
      url: "https://www.kocus.com/news/articleView.html?idxno=421001",
      excerpt: "동네 곳곳으로 찾아가 인권, 인문학, 평화의 가치를 나누는 교육이 시민들의 높은 참여 속에 진행되고 있습니다. 건강한 시민 의식 함양에 기여하고 있습니다."
    },
    {
      id: 26,
      title: "광주참여자치시민연대, '2025년 시정 모니터링' 결과 보고회",
      source: "중부일보",
      date: "2025-12-05",
      url: "https://blog.naver.com/gjct21/223272210541",
      excerpt: "한 해 동안 진행된 광주시의 행정 전반에 대한 꼼꼼한 모니터링 결과를 발표하고, 예산 낭비 사례 및 공약 이행 현황을 공개했습니다."
    },
    {
      id: 25,
      title: "교차로저널: '광주시민연대, 팔당 상수원 보호 시민 환경 감시단 발족'",
      source: "교차로저널",
      date: "2025-11-15",
      url: "https://www.kocus.com/news/articleView.html?idxno=420500",
      excerpt: "팔당호 수질 보전을 위해 시민들이 직접 감시자가 되어 활동하는 감시단을 구성했습니다. 오염원 점검 및 환경 보호 캠페인을 본격화합니다."
    },
    {
      id: 24,
      title: "광주시민연대, 소규모 건축물 안전 점검 실태 조사 결과 발표",
      source: "경기일보",
      date: "2025-10-22",
      url: "https://blog.naver.com/gjct21/223240210541",
      excerpt: "노후 주택 및 소규모 건축물의 안전 사고 예방을 위해 시 차원의 지원 대책 마련과 철저한 안전 진단을 요구하는 조사 보고서를 제출했습니다."
    },
    {
      id: 23,
      title: "광주참여자치시민연대, '지역 선순환 경제 활성화' 토론회",
      source: "교차로저널",
      date: "2025-09-10",
      url: "https://www.kocus.com/news/articleView.html?idxno=419800",
      excerpt: "지역 내 자금 역외 유출을 막고 소상공인과 상생할 수 있는 지역 경제 생태계 구축을 위한 전문가 및 시민들의 열띤 토론이 이어졌습니다."
    },
    {
      id: 22,
      title: "광주시민연대, '청년 정치 참여 확대' 위한 인턴십 운영",
      source: "국제뉴스",
      date: "2025-08-01",
      url: "https://blog.naver.com/gjct21/223202210541",
      excerpt: "청년들이 지역 현안에 관심을 갖고 정책을 직접 제안해 볼 수 있는 기회를 제공하여 미래 시민 운동 활동가를 양성하는 프로그램을 시작했습니다."
    },
    {
      id: 21,
      title: "교차로저널: '광주의 미래, 시민에게 묻다... 대규모 설문조사 진행'",
      source: "교차로저널",
      date: "2025-07-05",
      url: "https://www.kocus.com/news/articleView.html?idxno=418000",
      excerpt: "광주시 정체성 확립과 미래 발전 방향에 대해 시민 1,000명에게 의견을 물었습니다. 조사 결과는 시정 건의 자료로 활용될 예정입니다."
    },
    {
      id: 20,
      title: "광주참여자치시민연대, '공공의료 서비스 강화' 공동 연대 구성",
      source: "오마이뉴스",
      date: "2025-06-12",
      url: "https://blog.naver.com/gjct21/223115210541",
      excerpt: "부족한 지역 의료 인프라 개선과 공공 병원 유치 등 시민들의 건강권을 지키기 위한 사회적 연대를 강화하고 활동을 전개합니다."
    },
    {
      id: 19,
      title: "교차로저널: '투명한 예산 집행을 위한 광주시민연대의 쉼 없는 노력'",
      source: "교차로저널",
      date: "2025-05-20",
      url: "https://www.kocus.com/news/articleView.html?idxno=417500",
      excerpt: "광주시의 예산 편성부터 집행까지 시민의 눈으로 꼼꼼히 살피는 시정 감시 활동을 통해 불필요한 예산 낭비를 막는 성과를 거두고 있습니다."
    },
    {
      id: 18,
      title: "광주시민연대, '사회적 약자 배려' 교통 인프라 개선 촉구",
      source: "인천일보",
      date: "2025-04-18",
      url: "https://blog.naver.com/gjct21/223072210541",
      excerpt: "장애인 및 노약자 등 교통 약자들의 이동권 보장을 위한 저상 버스 도입 확대와 보도로 환경 개선을 시에 강력히 요구했습니다."
    },
    {
      id: 17,
      title: "교차로저널: '광주참여자치시민연대, 탄소중립 실천 선언식 개최'",
      source: "교차로저널",
      date: "2025-03-25",
      url: "https://www.kocus.com/news/articleView.html?idxno=416000",
      excerpt: "기후 위기 시대에 시민들과 함께 일상 속 탄소 줄이기 실천 방안을 공유하고 환경 친화적인 도시를 만들기 위한 선언문을 낭독했습니다."
    },
    {
      id: 16,
      title: "광주시민연대, '우리 동네 골목 상권 살리기' 대시민 캠페인",
      source: "씨티뉴스",
      date: "2025-02-10",
      url: "https://blog.naver.com/gjct21/223389210541",
      excerpt: "대형 마트 대신 지역 골목 상점과 전통 시장을 이용하자는 취지의 캠페인을 통해 지역 자영업자들과의 상생 공동체 의식을 고취했습니다."
    },
    {
      id: 15,
      title: "교차로저널: '광주참여자치시민연대, 역사 교육의 중요성 강조'",
      source: "교차로저널",
      date: "2025-01-15",
      url: "https://www.kocus.com/news/articleView.html?idxno=414500",
      excerpt: "올바른 역사 인식이 건강한 민주 시민의 밑거름임을 알리는 명사 초청 강좌와 유적지 탐방 프로그램을 성공적으로 마무리했습니다."
    },
    {
      id: 14,
      title: "광주참여자치시민연대, '2024년 활동 백서' 발간... 성과 공유",
      source: "씨티뉴스",
      date: "2024-12-28",
      url: "https://blog.naver.com/gjct21/224215148610",
      excerpt: "한 해 동안 진행된 주요 사업과 시민 참여 현황, 정책 제안 성과 등을 상세히 기록한 백서를 제작하여 회원 및 지역 사회에 배포했습니다."
    },
    {
      id: 13,
      title: "교차로저널: '광주참여자치시민연대, 시의회 조례 발의 현황 분석'",
      source: "교차로저널",
      date: "2024-11-05",
      url: "https://www.kocus.com/news/articleView.html?idxno=412000",
      excerpt: "시의원들이 발의한 조례가 시민의 삶에 얼마나 실질적인 도움을 주는지 분석하여 개선이 필요한 부분을 지적하는 보고서를 발표했습니다."
    },
    {
      id: 12,
      title: "광주참여자치시민연대, 겨울철 에너지 빈곤층 지원 활동",
      source: "MBC",
      date: "2024-10-15",
      url: "https://blog.naver.com/gjct21/223615210541",
      excerpt: "난방비 인상으로 고통받는 이웃들을 위해 연탄 나눔 및 방한 용품 지원 사업을 펼치며 지역 사회의 온건한 소통에 기여했습니다."
    },
    {
      id: 11,
      title: "교차로저널: '광주시민연대, 공원 일몰제 대응 시민 실천단 활동'",
      source: "교차로저널",
      date: "2024-09-20",
      url: "https://www.kocus.com/news/articleView.html?idxno=410500",
      excerpt: "도심 속 녹지 공간인 장기 미집행 도시 공원 해제 방지를 위한 대책 마련을 촉구하고 대체 공원 부지 확보를 위한 서명 운동을 전개했습니다."
    },
    {
      id: 10,
      title: "광주참여자치시민연대, '청소년 인권 학교' 성황리에 종료",
      source: "연합뉴스",
      date: "2024-08-12",
      url: "https://blog.naver.com/gjct21/223542210541",
      excerpt: "청소년들이 자신의 권리를 이해하고 타인의 인권을 존중하는 태도를 배울 수 있는 방학 캠프를 운영하여 큰 호응을 얻었습니다."
    },
    {
      id: 9,
      title: "교차로저널: '광주시민연대, 하수도 사용료 인상 시민 공청회 제안서 제출'",
      source: "교차로저널",
      date: "2024-07-05",
      url: "https://www.kocus.com/news/articleView.html?idxno=408000",
      excerpt: "하수도 요금 인상이 가정 경제에 미치는 영향이 큰 만큼, 시민들의 의견 수렴을 위한 공청회 개최를 시의회와 집행부에 강력히 건의했습니다."
    },
    {
      id: 8,
      title: "광주참여자치시민연대, '광주시 도시개발사업' 투명성 확보 촉구",
      source: "씨티뉴스",
      date: "2024-06-20",
      url: "https://blog.naver.com/gjct21/223389210541",
      excerpt: "대규모 개발 사업 추진 과정에서 발생할 수 있는 특정 업체 특혜 의혹 등을 방지하기 위해 심사 과정의 투명한 공개와 철저한 감시를 요구했습니다."
    },
    {
      id: 7,
      title: "광주시민연대, '시민참여예산제 고도화' 위한 전문가 토론회",
      source: "경기일보",
      date: "2024-05-18",
      url: "https://blog.naver.com/gjct21/223240210541",
      excerpt: "형식적으로 운영되는 시민참여예산제의 한계를 극복하고 실질적인 시민 제안 반영 비율을 높이기 위한 제도적 개선 방안을 논의했습니다."
    },
    {
      id: 6,
      title: "광주참여자치시민연대, '산하기관장 인사청문회' 도입 건의",
      source: "국제뉴스",
      date: "2024-04-05",
      url: "https://blog.naver.com/gjct21/223202210541",
      excerpt: "시는 인사의 전문성과 도덕성을 사전에 검증할 수 있는 인사청문회 제도를 도입하여 낙하산 인사 논란을 종식시켜야 한다고 강조했습니다."
    },
    {
      id: 5,
      title: "광주시민연대, '팔당 상수원 보호와 규제 완화' 상생 대책 촉구",
      source: "오마이뉴스",
      date: "2024-03-30",
      url: "https://blog.naver.com/gjct21/223115210541",
      excerpt: "상수원 보호라는 공익적 가치를 지키면서도 지역 주민들의 정당한 권익이 침해받지 않도록 하는 합리적인 규제 조정 방안을 제시했습니다."
    },
    {
      id: 4,
      title: "교차로저널: '광주참여자치시민연대, 광주의 역사 계승 인문학 강의'",
      source: "교차로저널",
      date: "2024-02-15",
      url: "https://www.kocus.com/news/articleView.html?idxno=402000",
      excerpt: "지역의 역사적 인물과 사건을 조명하여 시민들에게 자부심을 심어주고 공동체 의식을 함양하는 인문학 시리즈 강좌를 개최하고 있습니다."
    },
    {
      id: 3,
      title: "광주시민연대, 지역 사회적 경제 육성 및 지원 조례 제정 건의",
      source: "경인일보",
      date: "2024-01-20",
      url: "https://blog.naver.com/gjct21/223354210100",
      excerpt: "협동조합과 사회적 기업들이 지역 경제의 한 축으로 성장할 수 있도록 돕는 체계적인 지원 근거를 마련하기 위한 조례 제정을 촉구했습니다."
    },
    {
      id: 2,
      title: "교차로저널: '광주참여자치시민연대, 시민 고충 상담 센터 상시 운영'",
      source: "교차로저널",
      date: "2023-12-10",
      url: "https://www.kocus.com/news/articleView.html?idxno=398000",
      excerpt: "행정의 문턱이 높은 시민들을 위해 법률, 노무, 생활 고충 상담을 무료로 진행하며 시민의 든든한 대변인 역할을 수행하고 있습니다."
    },
    {
      id: 1,
      title: "광주시민연대 창립 1주년 기념식... '새로운 대안을 만드는 시민의 힘'",
      source: "씨티뉴스",
      date: "2023-11-05",
      url: "https://blog.naver.com/gjct21/223272210541",
      excerpt: "창립 1년 동안의 뜨거운 발자취를 돌아보고 앞으로 더 투명하고 정의로운 광주를 만들기 위한 새로운 도약을 회원들과 함께 다짐했습니다."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">홈으로 돌아가기</span>
        </Link>
        
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
              <Newspaper className="w-5 h-5" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">언론기사</h1>
          </div>
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-2xl">
            광주참여자치시민연대의 활동이 언론에 보도된 소식들을 모았습니다. <br />
            객관적인 시선으로 기록된 시민연대의 발자취를 확인해 보세요.
          </p>
        </header>

        <div className="space-y-6">
          {newsItems.map((news, idx) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => window.open(news.url, '_blank')}
              className="bg-[#141414] border border-slate-800 p-6 md:p-8 rounded-2xl hover:border-accent/50 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full group-hover:bg-accent/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  <span className="bg-slate-800 px-2 py-1 rounded text-accent">{news.source}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {news.date}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors leading-tight mb-4">
                  {news.title}
                </h3>
                
                <p className="text-slate-400 text-sm font-light leading-relaxed line-clamp-2 md:line-clamp-none max-w-3xl">
                  {news.excerpt}
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-accent text-[11px] font-bold uppercase tracking-widest">
                  기사 전문 보기 <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm mb-6 font-light">더 많은 기사는 네이버 블로그에서 확인하실 수 있습니다.</p>
          <a 
            href="https://blog.naver.com/PostList.naver?blogId=gjct21&categoryNo=6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all border border-slate-700"
          >
            블로그 전체보기 <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
