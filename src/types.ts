export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl?: string;
  url?: string;
  author: string;
}

export interface SiteSettings {
  name: string;
  description: string;
  accentColor: string;
  logoUrl?: string;
  homepageHeroTitle: string;
  homepageHeroSub: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    naverBlog?: string;
  };
  donationUrl?: string;
  seoKeywords: string;
  contactEmail: string;
  contactPhone: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
}
