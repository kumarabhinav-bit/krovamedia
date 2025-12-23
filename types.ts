
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  image?: string; // Optional custom image URL or Base64
  longDescription?: string; // Detailed description for the specific page
  features?: string[]; // List of key features/benefits
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string; // Main thumbnail
  gallery?: string[]; // Array of additional images
  description: string; // Short description
  client?: string;
  timeline?: string;
  challenge?: string;
  solution?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  serviceOfInterest: string;
  message: string;
  date: string;
}

// --- LMS / Course Types ---

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'live';
  videoUrl?: string; // URL to mp4 or youtube embed
  meetingUrl?: string; // Zoom/Meet link for live classes
  isFreePreview?: boolean;
  comments?: Comment[];
  resources?: Resource[]; // Notes, PDFs, Links
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  price: number;
  instructor: string;
  modules: Module[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In real app, this is hashed. Storing plain for demo only.
  avatar?: string;
  bio?: string;
  purchasedCourseIds: string[];
  completedLessonIds: string[]; // Track progress
}

export interface PaymentVerification {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  name: string;
  email: string;
  mobile: string;
  amount: string;
  transactionId: string;
  screenshot: string; // Base64 string
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SiteData {
  general: {
    agencyName: string;
    logoText: string;
    logoImage?: string; 
    contactEmail: string;
    contactPhone: string;
    whatsappNumber: string;
    ctaText: string;
    paymentQrImage?: string; // Custom uploaded QR code image
  };
  hero: {
    headline: string;
    subheadline: string;
    backgroundImage: string;
  };
  whyUs: {
    title: string;
    subtitle: string;
    points: Array<{ title: string; description: string; icon: string }>;
  };
  services: Service[];
  portfolio: PortfolioItem[];
  courses: Course[]; // Moved courses here to be manageable by Admin
  faqs: FAQItem[];
  footer: {
    description: string;
    copyrightText: string;
    socials: SocialLink[];
    logoImage?: string; 
  };
  messages: ContactMessage[];
  paymentVerifications: PaymentVerification[];
}
