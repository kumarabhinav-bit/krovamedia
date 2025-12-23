
import { SiteData, Course } from './types';

const DEFAULT_COURSES: Course[] = [
  {
    id: 'c1',
    title: "Complete Digital Marketing Masterclass",
    shortDescription: "Master SEO, Social Media, and Ads in one comprehensive course.",
    description: "This course takes you from beginner to expert in digital marketing. Learn how to build a brand, run profitable ad campaigns on Facebook and Google, and master SEO to rank #1.",
    thumbnail: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 4999,
    instructor: "Abhinav Kumar",
    modules: [
      {
        id: 'm1',
        title: "Introduction to Marketing",
        lessons: [
          { 
            id: 'l1', 
            title: "What is Digital Marketing?", 
            duration: "10:05", 
            type: 'video', 
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", 
            isFreePreview: true, 
            comments: [],
            resources: [
                { id: 'r1', title: 'Course Syllabus PDF', url: '#' },
                { id: 'r2', title: 'Marketing Cheat Sheet', url: '#' }
            ]
          },
          { id: 'l2', title: "Understanding the Funnel", duration: "15:30", type: 'video', videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", comments: [], resources: [] }
        ]
      },
      {
        id: 'm2',
        title: "Social Media Strategy",
        lessons: [
          { id: 'l3', title: "Instagram Algorithm Hacked", duration: "12:00", type: 'video', videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", comments: [], resources: [] },
          { id: 'l4', title: "Live Q&A Session", duration: "60:00", type: 'live', meetingUrl: "https://zoom.us/j/123456789", comments: [], resources: [] }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: "Web Development Bootcamp",
    shortDescription: "Build modern websites using React, Tailwind, and TypeScript.",
    description: "Learn to code by building real projects. This bootcamp covers HTML, CSS, JavaScript, React, and modern UI libraries like Tailwind CSS.",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 3499,
    instructor: "Krova Dev Team",
    modules: [
      {
        id: 'm1',
        title: "HTML & CSS Basics",
        lessons: [
          { id: 'l1', title: "Setting up VS Code", duration: "05:00", type: 'video', videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", isFreePreview: true, comments: [], resources: [{id: 'r1', title: 'VS Code Shortcuts', url: '#'}] },
          { id: 'l2', title: "Flexbox & Grid", duration: "20:00", type: 'video', videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", comments: [], resources: [] }
        ]
      }
    ]
  }
];

export const INITIAL_SITE_DATA: SiteData = {
  general: {
    agencyName: "Krova Media",
    logoText: "KROVA.",
    logoImage: "",
    contactEmail: "hello@krovamedia.com",
    contactPhone: "+91 93052 98053",
    whatsappNumber: "919305298053",
    ctaText: "Let's Scale Your Brand",
    paymentQrImage: ""
  },
  hero: {
    headline: "We Build Brands That People Love.",
    subheadline: "Premium digital marketing solutions designed to convert leads into loyal customers.",
    backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1574&q=80",
  },
  services: [
    {
      id: '1',
      title: "Social Media Marketing",
      description: "Strategic content creation and community management to grow your online presence.",
      icon: "Megaphone",
      longDescription: "We don't just post content; we build communities. Our social media strategies are designed to increase engagement, foster brand loyalty, and drive real traffic to your business. From Instagram Reels to LinkedIn thought leadership, we handle it all.",
      features: ["Content Strategy & Calendar", "Reels & Video Production", "Community Management", "Influencer Collaborations"]
    },
    {
      id: '2',
      title: "Performance Ads",
      description: "High-ROI campaigns on Meta & Google designed to generate qualified leads.",
      icon: "BarChart",
      longDescription: "Stop wasting money on ads that don't convert. Our performance marketing team uses advanced targeting, A/B testing, and data analytics to ensure every rupee spent brings a return. We specialize in Meta Ads (Facebook/Instagram) and Google PPC.",
      features: ["Campaign Setup & Optimization", "A/B Testing Creatives", "Retargeting Strategies", "Detailed ROI Reporting"]
    },
    {
      id: '3',
      title: "Web Development",
      description: "Fast, responsive, and SEO-optimized websites that convert visitors.",
      icon: "Code",
      longDescription: "Your website is your digital storefront. We design and develop custom websites that are not only visually stunning but also lightning-fast and mobile-responsive. Built with modern technologies to ensure scalability and security.",
      features: ["Custom UI/UX Design", "SEO Optimization", "Mobile Responsiveness", "CMS Integration"]
    },
    {
      id: '4',
      title: "Brand Identity",
      description: "Logo design, visual language, and brand positioning for market dominance.",
      icon: "PenTool",
      longDescription: "A brand is more than just a logo. It's a feeling. We help you define your brand's voice, visual identity, and positioning in the market. Create a lasting impression with a cohesive design language.",
      features: ["Logo Design", "Brand Guidelines", "Visual Assets", "Brand Tone & Voice"]
    }
  ],
  whyUs: {
    title: "Why Choose Krova?",
    subtitle: "We don't just execute; we strategize for your long-term growth.",
    points: [
      {
        title: "Data-Driven Strategy",
        description: "Every decision is backed by analytics and market insights.",
        icon: "TrendingUp"
      },
      {
        title: "Creative Excellence",
        description: "Award-winning designs that make your brand stand out.",
        icon: "Star"
      },
      {
        title: "Transparent Pricing",
        description: "No hidden fees. You know exactly what you're paying for.",
        icon: "DollarSign"
      },
      {
        title: "24/7 Support",
        description: "We are always here to help you navigate your digital journey.",
        icon: "Headphones"
      }
    ]
  },
  portfolio: [
    {
      id: '1',
      title: "Neon Horizon",
      category: "Branding",
      image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Complete rebrand for a tech startup.",
      client: "Horizon Tech",
      timeline: "2023 - 3 Months",
      challenge: "The client needed a futuristic identity to match their AI-driven product, but their existing brand felt outdated and corporate.",
      solution: "We created a neon-inspired visual language with bold typography and a dynamic logo system that adapts to different digital surfaces.",
      gallery: [
         "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: '2',
      title: "Urban Coffee",
      category: "Social Media",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Increased footfall by 40% in 3 months.",
      client: "Urban Coffee Co.",
      timeline: "2024 - Ongoing",
      challenge: "A local coffee chain was losing customers to big franchises and needed to engage a younger, local demographic.",
      solution: "We launched an 'Instagrammable' campaign featuring user-generated content, influencer meetups, and a visual menu revamp.",
      gallery: [
         "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: '3',
      title: "TechFlow App",
      category: "Web Design",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "UI/UX design for a fintech mobile application.",
      client: "TechFlow Inc",
      timeline: "2023 - 4 Months",
      challenge: "Complex financial data needed to be presented in a simple, accessible way for non-expert users.",
      solution: "We designed a clean, card-based interface with intuitive data visualization and a dark mode for better readability.",
      gallery: [
         "https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
         "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ]
    }
  ],
  courses: DEFAULT_COURSES,
  faqs: [
    {
      id: '1',
      question: "What industries do you specialize in?",
      answer: "We work primarily with E-commerce brands, Tech Startups, and Service-based businesses looking to scale."
    },
    {
      id: '2',
      question: "Do you offer custom packages?",
      answer: "Yes, we tailor every strategy to fit your specific business goals and budget."
    },
    {
      id: '3',
      question: "How soon can we see results?",
      answer: "While it varies by service, paid ads typically show results within 1-2 weeks, while SEO is a long-term play of 3-6 months."
    }
  ],
  footer: {
    description: "Empowering brands with cutting-edge digital solutions. Your growth is our mission.",
    copyrightText: "© 2024 Krova Media. All rights reserved.",
    logoImage: "",
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/thekrova/" },
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/abhinav-kumar-xa/" },
      { platform: "YouTube", url: "https://www.youtube.com/channel/UCLJ21RMvzL9AJAVxIe8PfNA" }
    ]
  },
  messages: [],
  paymentVerifications: []
};

export const INITIAL_COURSES = [];
