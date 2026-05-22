import { Post, SiteSettings } from "./types";

export const INITIAL_SETTINGS: SiteSettings = {
  name: "광주참여자치시민연대",
  description: "시민의 참여로 권력을 감시하고 평화와 인권의 가치를 실현하며, 역사적 진실을 계승하여 지속가능한 평화공동체를 만드는 시민단체입니다.",
  accentColor: "#A855F7", // Purple-500
  homepageHeroTitle: "시민의 참여로\n시민의 연대로\n시민의 힘으로",
  homepageHeroSub: "우리는 더 나은 광주, 투명한 사회를 위해 행동합니다.",
  socialLinks: {
    facebook: "https://www.facebook.com/gjpp21",
    youtube: "https://www.youtube.com/@gjpp",
    instagram: "https://www.instagram.com/gjpp21",
    twitter: "https://x.com/gjpp4u",
    naverBlog: "https://blog.naver.com/gjct21"
  },
  seoKeywords: "광주참여자치시민연대, 광주시민연대, 권력감시, 평화교육, 인권보호, 역사계승",
  contactEmail: "gjpp4u@gmail.com",
  contactPhone: "010-2519-0010",
  donationUrl: "https://link.donationbox.co.kr/donationBoxList.jsp?campaignuid=us9t8o5ak9"
};

export const INITIAL_POSTS: Post[] = [
  {
    id: "3",
    title: "2026 정기총회 결과 및 공지",
    excerpt: "정기 총회 결과를 보고드립니다. 함께해주신 모든 분들께 감사드립니다.",
    content: "총회 결과 공지 상세 내용입니다. 앞으로의 활동 계획과 결의 사항을 확인하실 수 있습니다.",
    category: "활동보고",
    date: "2024-04-20",
    author: "관리자",
    imageUrl: "https://cdn.litt.ly/images/sTf7jd1Q5hsMa0O8seqfrnEnARV8FR7Z",
    url: "https://blog.naver.com/gjct21/224251764110"
  },
  {
    id: "1",
    title: "2026 광주참여자치시민연대 정기총회",
    excerpt: "2026년 새로운 도약을 다짐하는 정기 총회가 개최되었습니다.",
    content: "2026년 정기 총회 상세 내용입니다. 시민들의 목소리를 담아 더 투명하고 정의로운 사회를 향해 나아갑니다.",
    category: "공지사항",
    date: "2024-04-13",
    author: "관리자",
    imageUrl: "https://postfiles.pstatic.net/MjAyNjA0MDhfMiAg/MDAxNzc1NjAxMzk4OTQ5.t5fVguRy1vU6v1Qk6Hd-J4JISYvSgQFzYHxgguWuITcg.qfhLPB0a5OMGbkcj6oIhU-y_C2qgOfhXYBjOnnAcHzgg.PNG/2026_%EA%B4%91%EC%A3%BC%EC%8B%9C%EB%AF%BC%EC%97%B0%EB%8C%80_%EC%B4%9D%ED%9A%8C.png?type=w773",
    url: "https://blog.naver.com/gjct21/224244740416"
  },
  {
    id: "2",
    title: "“기억과 미래” 시민/미래세대 인권 평화 시민교육",
    excerpt: "인권과 평화의 가치를 미래 세대와 함께 나누는 교육 프로그램을 진행합니다.",
    content: "기억과 미래 시민교육 상세 내용입니다. 시민들과 미래세대의 인권 감수성을 높이고 역사 인식을 제고하는 시간입니다.",
    category: "시민교육",
    date: "2024-04-15",
    author: "관리자",
    imageUrl: "https://cdn.litt.ly/images/RFD8lmckgdVLiJ4g6MQEvhiPPqOTJHHr",
    url: "https://blog.naver.com/gjct21/224215148610"
  }
];
