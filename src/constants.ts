import { Post, SiteSettings } from "./types";

export const INITIAL_SETTINGS: SiteSettings = {
  name: "광주시민연대(광주참여자치시민연대)",
  description: "시민의 참여로 경기도 광주시의 권력을 감시하고 참 자치, 평화와 인권의 가치를 실현하며, 건강하고 따뜻한 상생 자치공동체를 만드는 경기도 광주시민의 광장입니다.",
  accentColor: "#A855F7", // Purple-500
  homepageHeroTitle: "시민의 참여로\n시민의 연대로\n시민의 힘으로",
  homepageHeroSub: "우리는 더 나은 경기도 광주시, 자치와 협동의 숨결을 위해 행동합니다.",
  socialLinks: {
    facebook: "https://www.facebook.com/gjpp21",
    youtube: "https://www.youtube.com/@gjpp",
    instagram: "https://www.instagram.com/gjpp21",
    twitter: "https://x.com/gjpp4u",
    naverBlog: "https://blog.naver.com/gjct21",
    naverCafe: "https://cafe.naver.com/gjpp2022"
  },
  seoKeywords: "경기도 광주시민연대, 광주시민연대, 참여자치시민연대, 권력감시, 시민교육, 상생공동체",
  contactEmail: "gjpp4u@gmail.com",
  contactPhone: "010-2519-0010",
  donationUrl: "https://link.donationbox.co.kr/donationBoxList.jsp?campaignuid=us9t8o5ak9"
};

export const INITIAL_POSTS: Post[] = [
  {
    id: "3",
    title: "2026 정기총회 결과 및 공지",
    excerpt: "정기 총회 결과를 보고드립니다. 함께해주신 모든 회원들과 경기도 광주시 시민분들께 감사드립니다.",
    content: "총회 결과 공지 상세 내용입니다. 경기 광주시 발전과 2026년도 신임 계획안, 결의 사항을 확인하실 수 있습니다.",
    category: "활동보고",
    date: "2024-04-20",
    author: "관리자",
    imageUrl: "https://cdn.litt.ly/images/sTf7jd1Q5hsMa0O8seqfrnEnARV8FR7Z",
    url: "https://blog.naver.com/gjct21/224251764110"
  },
  {
    id: "1",
    title: "2026 광주시민연대 정기총회 개최 안내",
    excerpt: "2026년 경기도 광주시민의 다각적 권익과 새로운 한 해 도약을 다짐하는 정기 총회가 안전하게 개최되었습니다.",
    content: "2026년 정기 총회 상세 내용입니다. 자치, 교육, 기후 등 시민들의 절절한 요구를 적극 기획에 조율하여 더 따사로운 광주를 만듭니다.",
    category: "공지사항",
    date: "2024-04-13",
    author: "관리자",
    imageUrl: "https://postfiles.pstatic.net/MjAyNjA0MDhfMiAg/MDAxNzc1NjAxMzk4OTQ5.t5fVguRy1vU6v1Qk6Hd-J4JISYvSgQFzYHxgguWuITcg.qfhLPB0a5OMGbkcj6oIhU-y_C2qgOfhXYBjOnnAcHzgg.PNG/2026_%EA%B4%91%EC%A3%BC%EC%8B%9C%EB%AF%BC%EC%97%B0%EB%8C%80_%EC%B4%9D%ED%9A%8C.png?type=w773",
    url: "https://blog.naver.com/gjct21/224244740416"
  },
  {
    id: "2",
    title: "기억과 미래 인권 평화 시민교육",
    excerpt: "자치분권과 인권 평화의 가치를 미래 세대와 함께 풍성히 소통하는 교육 세미나 프로그램을 개막합니다.",
    content: "기억과 내일 시민교육 상세 내용입니다. 경기도 광주시 주민들의 거대 자치 감수성을 높이고 조화로운 역사 자산을 가꾸는 시간입니다.",
    category: "시민교육",
    date: "2024-04-15",
    author: "관리자",
    imageUrl: "https://cdn.litt.ly/images/RFD8lmckgdVLiJ4g6MQEvhiPPqOTJHHr",
    url: "https://blog.naver.com/gjct21/224215148610"
  }
];

export const DEFAULT_VIDEOS: Post[] = [
  {   
id: "v-live-1",
    title: "[창립총회] 광주참여자치시민연대(광주시민연대) 창립 총회 생중계",
    excerpt: "광주 시민연대는 53명의 창립 발기인과 함께 다수의 시민들을 초청하여 경기 광주시 송정동 소재 굿커피베데스다에서 창립 총회를 열었습니다.",
    content: "광주시민연대 창립 총회 풀영상 입니다. 광주시 시민 자치 실현을 향한 비전을 확인하실 수 있습니다.",
    category: "video",
    date: "2022-10-15",
    author: "관리자",
    imageUrl: "https://img.youtube.com/vi/2tDaO_WXSmI/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/live/2tDaO_WXSmI?si=bLGtdkgm8ULQnFfS"
  },
  {
 id: "v-channel",
    title: "[시민 미디어] 경기 광주시민연대 공식 유튜브 채널 (@gjpp)",
    excerpt: "경기도 광주시민연대의  다양한 동영상 기록을 실시간 시청할 수 있는 공식 미디어 창구입니다. 많은 구독과 좋아요로 지지해 주시기 바랍니다.",
    content: "경기 광주시민연대 공식 유튜브 채널입니다. 구독하여 새로운 활동과 생중계를 놓치지 마세요.",
    category: "video",
    date: "2023-10-01",
    author: "관리자",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800",
    youtubeUrl: "https://www.youtube.com/@gjpp"
  },
  {
    id: "v-video-1",
    title: "[특별강연] “손봉호 교수 특별 강연 세바시(세상을 바꾸는 시민)",
    excerpt: "광주시민연대 창립식에서 시민연대의 고문인 손봉호 교수가 \"세상을바꾸는시민\" 이라는 주제로 특별강연을 한 영상입니다..",
    content: "\"세상을바꾸는시민\" 이라는 주제로 손봉호 교수의 특별 강연 영상.",
    category: "video",
    date: "2022-10-17",
    author: "관리자",
    imageUrl: "https://img.youtube.com/vi/8Be-X9n7MMA/hqdefault.jpg",
    youtubeUrl: "https://youtu.be/8Be-X9n7MMA?si=vuA--TFuC0fLKhNf"
  },
  {
    id: "v-video-2",
    title: "[인터뷰] 구재이 상임대표, 광주시민연대 창립 정신과 실천 방향",
    excerpt: "광주시에 있는 시민공동체들이 시민주권과 자치를 위해 힘을 모으겠다며 광주참여자치시민연대를출범시켰습니다. 이와 관련한 인터뷰 영상입니다.",
    content: "광주참여자치시민연대 구재이 상임대표와 인터뷰 영상입니다.",
    category: "video",
    date: "2022-10-18",
    author: "관리자",
    imageUrl: "https://img.youtube.com/vi/3HLgAWKdjeg/hqdefault.jpg",
    youtubeUrl: "https://youtu.be/3HLgAWKdjeg?si=GwgXe7SKQZJ52num"
  },
  {
    id: "v-video-3",
    title: "[시민단체]광주시 최초 시민주도형 시민운동단체 출범",
    excerpt: "'광주참여자치시민연대'는 지역 마을공동체에서 활동 중인 시민과 전문가들이 참여해 5개월간의 준비과정을 거쳐 공식 출범했습니다..",
    content: "광주시민연대 창립과 관련한 딜라이브뉴스 영상입니다.",
    category: "video",
    date: "2022-10-18",
    author: "관리자",
    imageUrl: "https://img.youtube.com/vi/eHT7epKgo4E/hqdefault.jpg",
    youtubeUrl: "https://youtu.be/eHT7epKgo4E?si=bn7L7m3BFx-YYCoq"
  },
  {
    id: "v-live-2",
    title: "[생중계]광주시민연대 시민과평화 토크콘서트",
    excerpt: "윤미향 전의원을 초청하고 경기 광주 평화의소녀상을 건립했던 학생 및 시민들이 패널로 참여하여 열린 “시민과 평화 토크 콘서트 영상입니다.",
    content: "시민과평화 토크콘서트 생중계 영상입니다.",
    category: "video",
    date: "2025-08-03",
    author: "관리자",
    imageUrl: "https://img.youtube.com/vi/7mkchjPRAW4/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/live/7mkchjPRAW4?si=Gi6ZyNNfiEnKGdS7" 
  }
];

