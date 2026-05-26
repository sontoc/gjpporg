import { Post, SiteSettings } from "../types";
import { INITIAL_POSTS, INITIAL_SETTINGS } from "../constants";

const SETTINGS_KEY = "ngo_site_settings";
const POSTS_KEY = "ngo_site_posts";
const AUTH_KEY = "ngo_site_auth";

export const storage = {
  getSettings: (): SiteSettings => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  },
  saveSettings: (settings: SiteSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
  getPosts: (): Post[] => {
    const saved = localStorage.getItem(POSTS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  },
  savePost: (post: Post) => {
    const posts = storage.getPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.unshift(post);
    }
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },
  deletePost: (id: string) => {
    const posts = storage.getPosts().filter(p => p.id !== id);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },
  login: (email: string) => {
    const adminEmails = ['sonfrom@gmail.com', 'son3u@daum.net'];
    const isAdmin = adminEmails.includes(email.trim().toLowerCase());
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email, isAdmin }));
    return true;
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },
  getUser: () => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  }
};
