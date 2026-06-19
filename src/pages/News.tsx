import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, ExternalLink, Calendar, ArrowLeft, Loader2, PenTool, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { storage } from '../services/storage';

export const newsItems = [
    {
      id: 45,
      title: "[성명서] 아동권리보장원의 행정은 멈출 수 있어도, 아이의 시간은 멈출 수 없습니다",
      source: "교차로저널",
      date: "2026-03-03",
      url: "",
      excerpt: "아동 복지 행정의 지체에 대해 우려를 표하며, 실효성 있고 신속한 아동 권리 보장 행동 촉구를 담은 광주시민연대의 성명서입니다."
    },
    {
      id: 44,
      title: "[광주] 광주시민연대, 제4회 생태걷기 행사 '성료'",
      source: "교차로저널",
      date: "2026-01-05",
      url: "",
      excerpt: "지역 생태 환경 보존과 시민 공동체 가치 강화를 위해 개최된 제4회 광주시민연대 생태 걷기 행사가 많은 시민의 참여 속에 성공적으로 마무리되었습니다."
    },
    {
      id: 43,
      title: "[광주] ‘위례~삼동 철도사업 조기 착공하라’",
      source: "교차로저널",
      date: "2025-12-17",
      url: "https://www.kocus.com/news/articleView.html?idxno=437963",
      excerpt: "위례~삼동선 철도사업의 성공적인 기획재정부 예타 심사 통과와 조기 완공 착공을 촉구하며, 경기 광주 을·갑 권역의 간선 철도망 불균형 치유에 관한 지역사회의 목소리를 담았습니다."
    },
    {
      id: 42,
      title: "[광주] 환경다큐멘터리 대상 수상작 〈종이 울리는 순간〉 특별상영 및 GV 개최",
      source: "교차로저널",
      date: "2025-11-30",
      url: "",
      excerpt: "기후 위기와 환경 오염의 현실을 조명하는 화제작 상영 및 감독과의 대화(GV) 자리를 광주 시민들에게 선사한 환경다큐 문화활동 소식입니다."
    },
    {
      id: 41,
      title: "[광주] “광주시 물 행정, 총체적 재정비 시급”",
      source: "교차로저널",
      date: "2025-09-24",
      url: "",
      excerpt: "일관성을 상실한 시의 상수도 재정 집행과 물 공급 정책의 허점을 낱낱이 파헤치고, 효율적이고 깨끗한 급수 보증 제도를 세워갈 것을 경고했습니다."
    },
    {
      id: 40,
      title: "윤미향 전의원 초청 시민과평화 토크콘서트(광주시민연대)",
      source: "오마이컴퍼니",
      date: "2025-08-03",
      url: "https://www.ohmycompany.com/reward/986448274",
      excerpt: "평화와 자주 자치 비전 아래 윤미향 전 국회의원을 특별 패널로 모셔 광주시민연대가 함께한 '시민과 평화' 토크 콘서트 개최 소식과 평화의 소녀상 건립 연대 실천 소식을 전합니다."
    },
    {
      id: 39,
      title: "[광주] “기억이 평화를 만든다”",
      source: "교차로저널",
      date: "2025-08-04",
      url: "",
      excerpt: "경기 광주시 평화의 소녀상 건립 기념 및 온정 넘치는 시민 평화 대토론을 기획 전개하여, 화합과 치유의 역사를 이어 나가는 광주시민들의 소식입니다."
    },
    {
      id: 38,
      title: "[광주] 광주시민연대, 고문단과 함께하는 시민&회원 차담회 ‘성료’",
      source: "교차로저널",
      date: "2025-06-10",
      url: "http://m.kocus.com/news/articleView.html?idxno=435496",
      excerpt: "광주시민연대가 경기 광주 송정동 등 유관 고문단과 시민, 단체 유대 회원들을 모시고 함께하는 차담회를 성황리에 마무리하며 조직 내실을 공고화하는 계기를 마련했습니다."
    },
    {
      id: 37,
      title: "[성명서] 윤석열 대통령 파면은 민주주의 승리와 빛의 혁명의 시작",
      source: "교차로저널",
      date: "2025-04-05",
      url: "",
      excerpt: "헌정 규율의 훼손을 종식한 국민의 파면 결정을 깊이 환영하고, 경기 광주의 일선 현장에서도 정의와 완전한 민주의정을 튼튼히 보강할 것을 강령하는 선언 전문입니다."
    },
    {
      id: 36,
      title: "[광주] 윤석열 즉각 파면 요구하는 ‘경기광주시민촛불’ 행사 개최",
      source: "교차로저널",
      date: "2025-02-09",
      url: "https://m.kocus.com/news/articleView.html?idxno=434020",
      excerpt: "경기 광주시 행정타운 앞 광장에서 헌법 수호와 정의 실천을 결의하기 위해 추진된 광주 시민들의 자발적 촛불 광장 집회 및 평화 행진의 열기를 주도적으로 보도했습니다."
    },
    {
      id: 35,
      title: "[광주] 광주시민연대, 창립 2주년 ‘시민다방' 개최",
      source: "교차로저널",
      date: "2024-11-26",
      url: "",
      excerpt: "광주시민연대 창립 2주년을 기하기 위해 동지들과 시민들을 한곳에 초청하고, 후원 및 나눔 차를 통하며 정식으로 창립 성과를 공고히 결의한 사랑의 시민다담 소식입니다."
    },
    {
      id: 34,
      title: "광주시민연대, 수도요금 대폭 인상 철회 요구 서명운동",
      source: "프레시안뉴스",
      date: "2024-11-18",
      url: "https://pressiannews.net/58547",
      excerpt: "주변 도시들에 비해 갑작스럽게 단행된 수도 요금 부담 폭탄의 부작용을 통감하고, 시 행정의 정식 철회를 강력히 요구하는 광주시민연대의 민생 중심 실천 소식입니다."
    },
    {
      id: 33,
      title: "[광주] 광주시민연대 수도요금 인상 반대 서명운동 전개",
      source: "교차로저널",
      date: "2024-10-25",
      url: "https://www.kocus.com/news/articleView.html?idxno=432751",
      excerpt: "광주시민연대가 경기 광주 시장과 시의회에 보조금 투명 집행과 수도 인상 조례 유예를 건의하며 대대적으로 전개한 범시민 가계 서명 운동 기록입니다."
    },
    {
      id: 32,
      title: "[광주] 광주시민연대, 수도요금 반대운동 '지속'",
      source: "교차로저널",
      date: "2024-09-03",
      url: "",
      excerpt: "일방적으로 개진된 수도 요금 유용 행정을 바로잡기 위한 지속 구제 움직임을 이끌며 시민들의 권익보호에 힘쓰는 모습입니다."
    },
    {
      id: 31,
      title: "[성명서] “광주시민에 ‘수도요금 폭탄’ 안겨준 광주시·의회 규탄”",
      source: "교차로저널",
      date: "2024-08-05",
      url: "https://www.kocus.com/news/articleView.html?idxno=431787",
      excerpt: "광주시 가계의 경제적 안전망을 무시하고 소통 없는 요금제 합의에 임한 광주시 주무 당국 및 시의원 군의 직무유기를 강력 규탄하는 공식 성명 결의안 전문입니다."
    },
    {
      id: 30,
      title: "경기 광주시민연대, 광주시의회 모니터링... ‘투명성·공정성 평가’",
      source: "오마이뉴스",
      date: "2024-06-12",
      url: "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0003035812",
      excerpt: "지방의회 정례회 기간 동안 시의원들의 안건 토론, 성실 의정 태도, 그리고 예산 승인의 주도성을 다각도로 검토 분석한 시민사회의 객관적 모니터링 보고서입니다."
    },
    {
      id: 29,
      title: "[광주] 광주시민연대 모니터링단, 광주시의회 정례회 모니터링 시작",
      source: "교차로저널",
      date: "2024-06-04",
      url: "https://www.kocus.com/news/articleView.html?idxno=430961",
      excerpt: "의정 활동의 진정성 확보와 조례 심사의 정당성 담보를 위해 결성된 광주시민연대 시민 모니터링단이 제1차 정례회 개막과 동시에 감시 활동을 시작했습니다."
    },
    {
      id: 28,
      title: "[광주] 광주시민연대, 시민과 함께하는 ‘다큐영화시사회’ 개최",
      source: "교차로저널",
      date: "2024-05-31",
      url: "https://www.kocus.com/news/articleView.html?idxno=430913",
      excerpt: "공동체 윤리와 연대 정신을 전하는 참다운 독립 가치 예술 작품을 선정하여 광주 시민들과 정서적 연대를 맺고 토의를 벌인 고품격 다큐영화 시사회 관련 보도입니다."
    },
    {
      id: 27,
      title: "[성명서] 광주시민연대, 후보자 토론회 무산 관련 반박 성명서",
      source: "교차로저널",
      date: "2024-04-02",
      url: "",
      excerpt: "총선 후보 초청 토론 무산의 이면을 진솔하게 대변하고 거짓 유인에 떳떳하게 반박하여 건강한 광주 선거 공익을 지키려 한 성명 내용입니다."
    },
    {
      id: 26,
      title: "[광주] 광주시민연대 후보자 초청 토론회 '논란'",
      source: "교차로저널",
      date: "2024-03-30",
      url: "https://www.kocus.com/news/articleView.html?idxno=430001",
      excerpt: "총선 출마 후보 세력의 지역 공약 실효성 검증과 객관적인 대국민 토론 자리를 기획하는 과정에서 유관 정파들 간의 이견 조율 논란 실태를 객관적으로 기술한 보도입니다."
    },
    {
      id: 25,
      title: "광주시민연대, 총선 앞두고 지역 정치개혁 활동 본격화",
      source: "중부일보",
      date: "2024-03-15",
      url: "https://www.joongboo.com/news/articleView.html?idxno=363643999",
      excerpt: "유권자가 단순 관망자가 아닌, 투명 행정 및 제도 개혁을 견인하는 참다운 주권자가 될 수 있도록 다채로운 총선 정책 개혁 가이드를 제공하기 시작했습니다."
    },
    {
      id: 24,
      title: "광주시민연대, 광주시 주요 정책 시민 감시 강화",
      source: "시티뉴스",
      date: "2024-02-10",
      url: "http://www.ctnews.co.kr/43052",
      excerpt: "일방적인 개발 중심에서 생태, 교육, 교통 주권 친화 위주의 균형 잡힌 광주시 발전을 유도하겠다는 포부 하에 시정 감사 행동을 전면 혁신하는 어젠다 소식입니다."
    },
    {
      id: 23,
      title: "[광주] 시의회, 수도 요금 인상안 심사 '다음에'",
      source: "교차로저널",
      date: "2023-12-12",
      url: "",
      excerpt: "과도하게 설계된 복량 인상으로 질타를 부른 인하 조례안에 대해 광주시의회가 한발 물러서 심사유예를 선언케 한 성과 보도입니다."
    },
    {
      id: 22,
      title: "[광주] 수도요금 인상 반대 서명부 시의회 제출",
      source: "교차로저널",
      date: "2023-12-12",
      url: "",
      excerpt: "갑작스러운 수도세 인상의 규탄 목소리를 모아 자필 날인 서명본을 시의회 대책 의원단에 정식 양도한 현장 소식입니다."
    },
    {
      id: 21,
      title: "[광주] 수도 요금 인상은 필요한데…의회 ‘신중론’ 고개",
      source: "교차로저널",
      date: "2023-12-06",
      url: "",
      excerpt: "적절한 재원 마련 목적이어야 하나, 민가 압력을 고려해 조례안 의회 심의 유보와 면밀 검토로 전환된 분위기 분석입니다."
    },
    {
      id: 20,
      title: "[광주] 광주시민연대 \"수도요금 인상계획 철회하라\"",
      source: "교차로저널",
      date: "2023-11-13",
      url: "https://www.kocus.com/news/articleView.html?idxno=427692",
      excerpt: "물가 고조 시국 속 서민의 기본 공공 수급권인 상수 요금을 갑작스레 올리려는 시 계획의 독단성을 비판하며, 시청 정문 등지에서 격앙된 요금 유예 결의안을 개진했습니다."
    },
    {
      id: 19,
      title: "광주, 시민단체 “수도요금 인상 철회” 집회",
      source: "씨티뉴스",
      date: "2023-10-26",
      url: "https://www.ctnews.co.kr/sub_read.html?uid=37404&section=sc9&section2=%BB%E7%C8%B8",
      excerpt: "광주시민연대 등 공동체들이 수도요금 대폭 인상 계획의 철회를 엄격히 요구하며 시민설명회 촉구 및 서진 가두 서명을 격발하였습니다."
    },
    {
      id: 18,
      title: "[광주] \"일방적 수도요금 대폭인상 즉각 철회하라”",
      source: "교차로저널",
      date: "2023-10-26",
      url: "",
      excerpt: "납득하기 어려운 기형적 수도율 단행 절차를 전격 철회하고, 시민 민생을 존엄 보듬을 것을 당당 요구 및 결의하는 가두 동정입니다."
    },
    {
      id: 17,
      title: "광주시민연대, 지역 현안 해결 위한 시민참여 확대",
      source: "광주뉴스",
      date: "2023-09-10",
      url: "http://www.gjnews.net/news/articleView.html?idxno=41027",
      excerpt: "빌라가 주거환경 개선, 대지정화, 남한산성 거주 문제 등 경기 광주시 구석구석의 애로사항을 생활 거시적으로 풀기 위해 시민이 직접 참여하는 행동 소식입니다."
    },
    {
      id: 16,
      title: "[성명서] “광주시는 공무원이 주인인가, 시민이 주인인가?”",
      source: "교차로저널",
      date: "2023-08-12",
      url: "",
      excerpt: "민생 행정에 군림하지 않고 참 하인으로서 봉사해야 할 공직 의무 해이 및 위압을 엄포 비판하는 자립시민연대의 정칙 선언입니다."
    },
    {
      id: 15,
      title: "[광주] “스피드게이트, 출입통제가 아닌 안전게이트다”",
      source: "교차로저널",
      date: "2023-08-05",
      url: "",
      excerpt: "민의에 빗장을 거는 청사 방벽 도입 논란 속에 스피드 게이트의 존재 사유와 시민 거부 충돌 이야기를 깊이 있게 파헤친 기사입니다."
    },
    {
      id: 14,
      title: "[광주] 광주시의회, 외유성 해외연수 '논란'",
      source: "교차로저널",
      date: "2023-07-26",
      url: "",
      excerpt: "내실 부족한 해외 외교 일정을 조율 불량으로 외유 시비에 직면시킨 광주 의원 군을 상대로, 시민단체가 진솔한 규명을 촉구하며 일갈하였습니다."
    },
    {
      id: 13,
      title: "[광주] 시청 출입관리시스템 ‘뜨거운감자’",
      source: "교차로저널",
      date: "2023-07-17",
      url: "",
      excerpt: "청사 내부 스피드게이트 개폐 관리 시스템 도입이 구색 좋은 편의 대비 시민 배제 및 폐쇄 행정 우려물로 등극해 마찰이 빚어지는 보도입니다."
    },
    {
      id: 12,
      title: "[광주] “출입관리시스템, 즉각 철거하라”",
      source: "교차로저널",
      date: "2023-06-30",
      url: "",
      excerpt: "스피드게이트 출입통제를 즉시 부수고 시민 주권을 투명하게 복원하도록 기습 저지 행동을 벌이는 진솔한 시민연대의 기획입니다."
    },
    {
      id: 11,
      title: "[광주] 광주시민연대, (사)한국농아인협회경기도협회 광주시지회에 이웃돕기 성금 기탁",
      source: "교차로저널",
      date: "2022-12-23",
      url: "",
      excerpt: "경기 광주시 사각지대 이웃인 농아인들을 위해 온정을 보태며 개혁 운동 이상으로 사회 나눔 가치 실현도 꾸물 없이 동참한 미담입니다."
    },
    {
      id: 10,
      title: "[광주] 광주시민연대, 시의회 정례회 의정모니터링 '완주'",
      source: "교차로저널",
      date: "2022-12-15",
      url: "",
      excerpt: "지방 자치의 내밀한 조례 심율을 정석 모니터하여 성실 완주로 일갈 감시한 광주시민연대의 고유 지성 의정 활동 보고서입니다."
    },
    {
      id: 9,
      title: "[광주] 광주시민연대, 광주시 핵심사업 정보공개 청구",
      source: "교차로저널",
      date: "2022-11-21",
      url: "https://www.kocus.com/news/articleView.html?idxno=422356",
      excerpt: "개발 이익이 밀착 공익 인프라로 온전히 귀속되도록, 행정 투명성 보장 차원의 광주시 핵심 도시 토건 전 영역의 비용 청원 정보공개를 공식적으로 청구했습니다."
    },
    {
      id: 8,
      title: "경기 광주에도 시민연대가 생겼다, 마침내",
      source: "경향신문",
      date: "2022-10-18",
      url: "https://www.khan.co.kr/article/202210182211015",
      excerpt: "경기도 광주 역사상 전무후무했던 순수 무정파 가치 추구의 시민 행동 권리망이 수서-삼동선, 세금 누수 감시 등을 기치로 성공리에 출범했음을 주목하는 기사입니다."
    },
    {
      id: 7,
      title: "광주에 첫 시민주도 시민운동단체 ‘광주시민연대’ 창립",
      source: "아시아뉴스통신",
      date: "2022-10-18",
      url: "https://m.anewsa.com/article_sub3.php?mobile=&number=2704007&type=",
      excerpt: "경기 광주시 송정동에서 53인의 창립 발기인과 함께 다수의 시민들을 초청하여 개최된 광주 첫 시민주도 시민운동단체 '광주시민연대' 창립 소식입니다."
    },
    {
      id: 6,
      title: "[광주] \"시민의 힘으로 ‘광주병’ 뜯어 고치겠다\"",
      source: "교차로저널",
      date: "2022-10-17",
      url: "https://www.kocus.com/news/articleView.html?idxno=421704",
      excerpt: "교통 고립, 난개발, 주민 소외라는 고질적인 '광주병'을 치유하기 위해, 시민 스스로 실질적인 개혁 운동을 펼쳐나갈 것임을 당차게 선언했습니다."
    },
    {
      id: 5,
      title: "광주, 시민단체 ‘광주시민연대’ 창립",
      source: "씨티뉴스",
      date: "2022-10-14",
      url: "https://www.ctnews.co.kr/sub_read.html?uid=36001&section=sc9&section2=%BB%E7%C8%B8",
      excerpt: "시민 및 각계 전문가들로 구성된 순수 비정파 공익단체인 '광주시민연대'가 난개발 및 물류단지 교통 체증 등 고착된 난제 해결을 위해 송정동에서 정식 출범했다는 심층 보도입니다."
    },
    {
      id: 4,
      title: "구재이 전 세무사고시회장, ‘(경기)광주시민연대’ 만들었다",
      source: "세정일보",
      date: "2022-10-12",
      url: "https://www.sejungilbo.com/news/articleView.html?idxno=39835",
      excerpt: "조세 및 공공 예산 분야 지성을 겸비한 구재이 대표가 경기도 광주 자치와 예산 견제의 선진화를 실증적으로 성취하고자 시민단체를 태동시켰습니다."
    },
    {
      id: 3,
      title: "[국세신문] 구재이 세무사, 경기 광주 첫 시민운동 단체 ‘광주시민연대’ 창립",
      source: "국세신문",
      date: "2022-10-12",
      url: "https://www.goodtax.kr/board/view/goodtax/408",
      excerpt: "시 행정 전반의 회계 회람 감시 체계와 주민참여 투명 예산을 성공적으로 실현하기 위해 전문 지성까지 참여한 건강무쌍한 시민단체의 고유한 지평을 알렸습니다."
    },
    {
      id: 2,
      title: "[광주] 시민 주도 ‘광주시민연대’ 창립 '새바람'",
      source: "교차로저널",
      date: "2022-10-14",
      url: "https://www.kocus.com/news/articleView.html?idxno=421675",
      excerpt: "어떤 외압이나 편향된 정치 노선에 속박되지 않고 떳떳이 성장하겠다는 강령을 품은 경기 광주시 대표 자치 역군 단체의 참신하고 세련된 활기찬 출생 현장입니다."
    },
    {
      id: 1,
      title: "공익·자주 내세운 ‘광주시민연대’ 창립... ‘시민 주도’",
      source: "오마이뉴스",
      date: "2022-10-15",
      url: "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0002872897",
      excerpt: "편향과 편의적 정계 시비를 타개하고 자주적 공익 수호를 주민 직접 모임으로 이끌어낸 광주시민연대 창립 소식 보도 전문입니다."
    },
    {
      id: 101,
      title: "[광주] “국민참여경선제, 국회의원이 관철해 달라”",
      source: "교차로저널",
      date: "2022-04-24",
      url: "",
      excerpt: "시민들의 정당 지지 선택권 보증과 대의 의사 합당 실천을 위해, 지역구 중심 국민 참여 경선을 정계에서 성서 공고히 책임질 것을 촉구하는 목소리입니다."
    },
    {
      id: 102,
      title: "[종합] 日 수출규제 보복 ‘규탄’...시민 ‘한목소리’",
      source: "교차로저널",
      date: "2019-08-05",
      url: "",
      excerpt: "일본 정부의 독단적 반도체 수출 제약 무역 공격에 맞서 주권국의 자부와 지성을 담아 일방적인 조치 철회를 강력 성토한 경기도 광주 시민들의 의지입니다."
    },
    {
      id: 103,
      title: "전국최초, 교육환경개선 추진위 발대",
      source: "교차로저널",
      date: "2013-11-29",
      url: "",
      excerpt: "낙후된 지역 교육 복지와 취약 시설 극복을 기치로 전국에서 소외된 아이들을 위해 출범했던 조례 및 환경 개선 구제 활동 사료 보도입니다."
    },
    {
      id: 104,
      title: "국정원 정치개입 규명, 촛불집회 열려",
      source: "교차로저널",
      date: "2013-08-09",
      url: "",
      excerpt: "국가 정보 조직의 선거 관여와 탈법을 묵과하지 않겠다는 참 지성을 담아 광주 지역 전역에서 소박하고 성스럽게 타올랐던 시민들의 민주 수호 촛불 현장입니다."
    },
    {
      id: 105,
      title: "“산지개발 경사도 기준 완화 반대”",
      source: "교차로저널",
      date: "2013-07-16",
      url: "",
      excerpt: "무분별한 환경 훼손 야기와 보상성 도시 허가를 촉발하는 산지 개발 완화 실태의 무리함을 지지 않고 고발 규탄하는 환경권 수호 보도입니다."
    },
    {
      id: 106,
      title: "산지경사도 25도 완화, '동상이몽'",
      source: "교차로저널",
      date: "2013-07-15",
      url: "",
      excerpt: "개발 이속을 탐하는 측과 자연 보호 및 정주 안전을 도모하는 다수의 민초들 사이 교차하는 조례 변경 찬반 논란 실황을 심도 있게 투영했습니다."
    },
    {
      id: 107,
      title: "산지경사도 완화, “말도 안돼”",
      source: "교차로저널",
      date: "2013-07-02",
      url: "",
      excerpt: "안전 산사태 방지와 기후 조해 극복을 중시하는 주민들의 우직하고 올바른 결사 반대 항의의 강도 높은 울림을 담은 교차로 보도 기사입니다."
    },
    {
      id: 108,
      title: "졸속통합반대하남시민대책위, 국회 기자회견",
      source: "교차로저널",
      date: "2010-02-01",
      url: "",
      excerpt: "주민 합의에 기반하지 않은 채 행정 편의를 목적으로 밀어붙여지는 억대 억압 졸속 도시 통합을 국회 차원에서 저지 조력하고자 전개된 기자단 공고입니다."
    },
    {
      id: 109,
      title: "3개시 시민단체, 통합반대 기자회견 가져",
      source: "교차로저널",
      date: "2009-09-25",
      url: "",
      excerpt: "과밀 통폐합에 따른 무분별한 지방 소외와 실익 누수 극복을 목표로 공동 연대를 구성한 삼개시 자치단체 연대의 튼실한 협동 고발 모습입니다."
    }
  ];

const NewsPage: React.FC = () => {
  const user = storage.getUser();
  const isAdmin = user?.isAdmin === true || ['sonfrom@gmail.com', 'son3u@daum.net'].includes(user?.email?.toLowerCase() || '');

  const getArticleUrl = (newsItem: { url: string; title: string }) => {
    if (!newsItem.url || newsItem.url === '#' || newsItem.url === '') {
      return `https://search.naver.com/search.naver?query=${encodeURIComponent(newsItem.title)}`;
    }
    return newsItem.url;
  };

  const [allNews, setAllNews] = React.useState<any[]>(() => {
    // Initializer to display sorted static news items with 0 second latency
    return [...newsItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  const [loading, setLoading] = React.useState(false); // False by default so page displays instantly
  const [isSyncing, setIsSyncing] = React.useState(false); // Background syncing tracker
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredNews = allNews.filter((news) => {
    const q = searchTerm.toLowerCase();
    return (
      (news.title || '').toLowerCase().includes(q) ||
      (news.excerpt || '').toLowerCase().includes(q) ||
      (news.source || '').toLowerCase().includes(q)
    );
  });

  React.useEffect(() => {
    const fetchNewsPosts = async () => {
      setIsSyncing(true);
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .eq('category', 'news')
          .order('id', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const dbNews = data.map((p: any) => ({
            id: p.id,
            title: p.title || '',
            source: p.source || '참여자치연대',
            date: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            url: p.post_url || '#',
            excerpt: p.excerpt || p.content || ''
          }));
          
          const merged = [...dbNews, ...newsItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setAllNews(merged);
        } else {
          const sorted = [...newsItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setAllNews(sorted);
        }
      } catch (err) {
        console.error('Error fetching news posts:', err);
        // Fail-safe falls back to initial initialized list
      } finally {
        setIsSyncing(false);
      }
    };

    fetchNewsPosts();
  }, []);

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
                <Newspaper className="w-5 h-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">언론기사</h1>
            </div>
            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-xl">
              광주시민연대의 활동이 언론에 보도된 소식들을 모았습니다. <br />
              객관적인 시선으로 기록된 시민연대의 발자취를 확인해 보세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="기사 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 w-full md:w-64"
              />
            </div>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 shadow-lg shadow-accent/5 cursor-pointer font-sans"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>기사 작성</span>
              </Link>
            )}
          </div>
        </header>

        <div className="space-y-6">
          {filteredNews.length === 0 && isSyncing ? (
            <div className="py-24 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="text-sm font-light">최신 언론 보도 수집 중...</span>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="py-24 text-center text-slate-500 font-light border border-slate-900 rounded-3xl bg-[#0F0F0F] text-sm">
              보도기사가 존재하지 않습니다.
            </div>
          ) : (
            filteredNews.map((news, idx) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => window.open(getArticleUrl(news), '_blank')}
                className="bg-[#141414] border border-slate-800 p-6 md:p-8 rounded-2xl hover:border-accent/50 transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full group-hover:bg-accent/10 transition-colors" />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    <span className="bg-slate-800 px-2 py-1 rounded text-accent">{news.source}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {news.date}</span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-accent transition-colors leading-tight mb-4">
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
            ))
          )}
        </div>

        <div className="mt-16 pt-12 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm mb-6 font-light">더 많은 기사와 시민 활동 보고는 네이버 카페에서 확인하실 수 있습니다.</p>
          <a 
            href="https://cafe.naver.com/gjpp2022" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all border border-slate-700"
          >
            네이버 카페 전체보기 <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
