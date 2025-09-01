export interface ServiceItem {
  id: string
  label: string
  description?: string
  days: {
    nocode: number
    cms: number
    custom: number
  }
  price: {
    nocode: number
    cms: number
    custom: number
  }
  recurring?: {
    monthly: number
  }
  category: string
  essential?: boolean
}

export interface ServiceCategory {
  id: string
  name: string
  description: string
  services: ServiceItem[]
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "core-website",
    name: "Core Website Development",
    description: "Essential website foundation and core functionality",
    services: [
      {
        id: "discovery",
        label: "Discovery & Strategy",
        description: "Business analysis, user research, and digital strategy planning",
        days: { nocode: 3, cms: 3, custom: 7 },
        price: { nocode: 400, cms: 800, custom: 1500 },
        category: "core-website",
        essential: true
      },
      {
        id: "uiux-design",
        label: "UI/UX Design",
        description: "Beautiful, responsive design with smooth animations and micro-interactions",
        days: { nocode: 4, cms: 7, custom: 14 },
        price: { nocode: 800, cms: 1500, custom: 3500 },
        category: "core-website",
        essential: true
      },
      {
        id: "core-pages",
        label: "Core Pages Development",
        description: "Home, About, Menu, Contact, and essential landing pages",
        days: { nocode: 7, cms: 14, custom: 28 },
        price: { nocode: 1000, cms: 1400, custom: 5000 },
        category: "core-website",
        essential: true
      },
      {
        id: "multilingual",
        label: "Multilingual Support",
        description: "Dutch (NL) + English (EN) with language switching",
        days: { nocode: 2, cms: 3, custom: 7 },
        price: { nocode: 250, cms: 500, custom: 1000 },
        category: "core-website"
      },
      {
        id: "responsive",
        label: "Mobile-First Responsive Design",
        description: "Optimized for all devices with touch-friendly interactions",
        days: { nocode: 3, cms: 3, custom: 7 },
        price: { nocode: 400, cms: 800, custom: 1500 },
        category: "core-website",
        essential: true
      }
    ]
  },
  {
    id: "ecommerce",
    name: "E-commerce & Ordering",
    description: "Online ordering, payments, and delivery management",
    services: [
      {
        id: "online-ordering",
        label: "Online Ordering System",
        description: "Pickup and delivery ordering with real-time menu management",
        days: { nocode: 4, cms: 8, custom: 20 },
        price: { nocode: 500, cms: 1500, custom: 4500 },
        category: "ecommerce",
        essential: true
      },
      {
        id: "reservations",
        label: "Table Reservations",
        description: "Booking system with calendar integration and confirmation",
        days: { nocode: 3, cms: 4, custom: 7 },
        price: { nocode: 500, cms: 800, custom: 1800 },
        category: "ecommerce"
      },
      {
        id: "qr-ordering",
        label: "QR Code Table Ordering",
        description: "In-store ordering via QR codes for faster service",
        days: { nocode: 3, cms: 4, custom: 7 },
        price: { nocode: 500, cms: 900, custom: 2000 },
        category: "ecommerce"
      },
      {
        id: "pos-integration",
        label: "POS Integration",
        description: "Connect with existing POS systems (Lightspeed, Square, etc.)",
        days: { nocode: 2, cms: 4, custom: 10 },
        price: { nocode: 500, cms: 1000, custom: 3000 },
        category: "ecommerce"
      },
      {
        id: "inventory",
        label: "Inventory Management",
        description: "Real-time stock tracking and menu availability",
        days: { nocode: 2, cms: 4, custom: 7 },
        price: { nocode: 500, cms: 800, custom: 2000 },
        category: "ecommerce"
      }
    ]
  },
  {
    id: "payments-delivery",
    name: "Payments & Delivery",
    description: "Secure payment processing and delivery management",
    services: [
      {
        id: "payment-gateway",
        label: "Payment Gateway Integration",
        description: "iDEAL, credit cards, Apple Pay, Google Pay, and local payment methods",
        days: { nocode: 2, cms: 3, custom: 7 },
        price: { nocode: 300, cms: 500, custom: 1500 },
        category: "payments-delivery",
        essential: true
      },
      {
        id: "delivery-management",
        label: "Delivery Management",
        description: "Dispatch system, driver app, and delivery tracking",
        days: { nocode: 2, cms: 3, custom: 7 },
        price: { nocode: 400, cms: 800, custom: 2000 },
        category: "payments-delivery"
      },
      {
        id: "delivery-zones",
        label: "Delivery Zone Management",
        description: "Configure delivery areas, fees, and time estimates",
        days: { nocode: 1, cms: 1, custom: 2 },
        price: { nocode: 200, cms: 200, custom: 500 },
        category: "payments-delivery"
      }
    ]
  },
  {
    id: "marketplaces",
    name: "Marketplace Integration",
    description: "Connect with major food delivery platforms",
    services: [
      {
        id: "uber-eats",
        label: "Uber Eats Integration",
        description: "Menu sync, order management, and analytics dashboard",
        days: { nocode: 0.5, cms: 0.5, custom: 0.5 },
        price: { nocode: 250, cms: 250, custom: 250 },
        category: "marketplaces"
      },
      {
        id: "thuisbezorgd",
        label: "Thuisbezorgd.nl Integration",
        description: "Just Eat Takeaway platform integration and management",
        days: { nocode: 0.5, cms: 0.5, custom: 0.5 },
        price: { nocode: 250, cms: 250, custom: 250 },
        category: "marketplaces"
      },
      {
        id: "google-business",
        label: "Google Business Profile",
        description: "Setup, optimization, and integration with Google services",
        days: { nocode: 0.5, cms: 0.5, custom: 0.5 },
        price: { nocode: 200, cms: 200, custom: 200 },
        category: "marketplaces"
      },
      {
        id: "thefork",
        label: "TheFork Integration",
        description: "Reservation platform integration and widget",
        days: { nocode: 0.5, cms: 0.5, custom: 0.5 },
        price: { nocode: 250, cms: 250, custom: 250 },
        category: "marketplaces"
      }
    ]
  },
  {
    id: "marketing-crm",
    name: "Marketing & CRM",
    description: "Customer relationship management and marketing automation",
    services: [
      {
        id: "email-marketing",
        label: "Email Marketing Setup",
        description: "Klaviyo/Mailchimp integration with 3 automated email flows",
        days: { nocode: 2, cms: 2, custom: 3 },
        price: { nocode: 500, cms: 500, custom: 1000 },
        category: "marketing-crm"
      },
      {
        id: "loyalty-program",
        label: "Loyalty & Rewards",
        description: "Points system, coupons, and customer retention tools",
        days: { nocode: 2, cms: 4, custom: 7 },
        price: { nocode: 500, cms: 800, custom: 1500 },
        category: "marketing-crm"
      },
      {
        id: "social-media",
        label: "Social Media Setup",
        description: "Facebook, Instagram, TikTok profiles + 10 branded assets",
        days: { nocode: 2, cms: 2, custom: 2 },
        price: { nocode: 200, cms: 200, custom: 200 },
        category: "marketing-crm"
      },
      {
        id: "customer-database",
        label: "Customer Database",
        description: "Customer profiles, order history, and preferences tracking",
        days: { nocode: 1, cms: 2, custom: 4 },
        price: { nocode: 300, cms: 500, custom: 1000 },
        category: "marketing-crm"
      }
    ]
  },
  {
    id: "seo-analytics",
    name: "SEO, Analytics & Compliance",
    description: "Search optimization, performance tracking, and legal compliance",
    services: [
      {
        id: "local-seo",
        label: "Local SEO Optimization",
        description: "Google My Business, local listings, and schema markup",
        days: { nocode: 2, cms: 2, custom: 5 },
        price: { nocode: 300, cms: 800, custom: 1500 },
        category: "seo-analytics"
      },
      {
        id: "analytics-dashboard",
        label: "Analytics & Reporting",
        description: "Google Analytics 4, Meta pixels, and custom dashboards",
        days: { nocode: 1, cms: 1, custom: 2 },
        price: { nocode: 300, cms: 300, custom: 500 },
        category: "seo-analytics"
      },
      {
        id: "gdpr-compliance",
        label: "GDPR & Privacy Compliance",
        description: "Cookie consent, privacy policies, and data protection",
        days: { nocode: 1, cms: 1, custom: 2 },
        price: { nocode: 200, cms: 200, custom: 500 },
        category: "seo-analytics"
      },
      {
        id: "performance-optimization",
        label: "Performance Optimization",
        description: "Speed optimization, Core Web Vitals, and mobile performance",
        days: { nocode: 2, cms: 2, custom: 7 },
        price: { nocode: 300, cms: 500, custom: 1200 },
        category: "seo-analytics"
      }
    ]
  },
  {
    id: "content-production",
    name: "Content Production",
    description: "Professional photography, video, and copywriting services",
    services: [
      {
        id: "food-photography",
        label: "Food Photography",
        description: "Half-day shoot with 10 professionally retouched images",
        days: { nocode: 0.5, cms: 0.5, custom: 0.5 },
        price: { nocode: 200, cms: 200, custom: 200 },
        category: "content-production"
      },
      {
        id: "promo-video",
        label: "Promotional Video",
        description: "1-minute restaurant promo video (shoot + professional editing)",
        days: { nocode: 1, cms: 1, custom: 1 },
        price: { nocode: 500, cms: 500, custom: 500 },
        category: "content-production"
      },
      {
        id: "copywriting",
        label: "Professional Copywriting",
        description: "Website content, menu descriptions, and marketing copy (up to 1000 words)",
        days: { nocode: 1, cms: 1, custom: 1 },
        price: { nocode: 200, cms: 200, custom: 200 },
        category: "content-production"
      },
      {
        id: "brand-identity",
        label: "Brand Identity Design",
        description: "Logo design, color palette, Typography, and brand guidelines",
        days: { nocode: 5, cms: 5, custom: 5 },
        price: { nocode: 500, cms: 500, custom: 500 },
        category: "content-production"
      }
    ]
  },
  {
    id: "maintenance",
    name: "Ongoing Maintenance & Support",
    description: "Monthly hosting, maintenance, and support services",
    services: [
      {
        id: "hosting-platform",
        label: "Hosting & Platform",
        description: "Monthly hosting, SSL certificates, and platform fees",
        days: { nocode: 0, cms: 0, custom: 0 },
        price: { nocode: 0, cms: 0, custom: 0 },
        recurring: { monthly: 100 },
        category: "maintenance"
      },
      {
        id: "maintenance-support",
        label: "Maintenance & Support",
        description: "Monthly updates, security patches, and technical support",
        days: { nocode: 0, cms: 0, custom: 0 },
        price: { nocode: 0, cms: 0, custom: 0 },
        recurring: { monthly: 600 },
        category: "maintenance"
      },
      {
        id: "content-updates",
        label: "Content Updates",
        description: "Monthly menu updates, content changes, and minor modifications",
        days: { nocode: 0, cms: 0, custom: 0 },
        price: { nocode: 0, cms: 0, custom: 0 },
        recurring: { monthly: 300 },
        category: "maintenance"
      }
    ]
  }
]

export const DEVELOPMENT_APPROACHES = [
  {
    key: "nocode",
    label: "No-Code Platform",
    subtitle: "Webflow / Wix / Squarespace",
    description: "Fastest & most budget-friendly approach. Perfect for validation and lean operations.",
    pros: [
      "Fastest development time",
      "Lowest upfront cost",
      "Easy to maintain",
      "Built-in hosting & security"
    ],
    cons: [
      "Limited customization",
      "Monthly platform fees",
      "Vendor lock-in",
      "Less unique branding"
    ],
    bestFor: "Startups, budget-conscious businesses, quick market entry"
  },
  {
    key: "cms",
    label: "CMS Platform",
    subtitle: "WordPress + WooCommerce",
    description: "Flexible, owns content & plugins. Great value with long-term control.",
    pros: [
      "Full content ownership",
      "Highly customizable",
      "Large plugin ecosystem",
      "Cost-effective long-term"
    ],
    cons: [
      "Longer development time",
      "Requires technical maintenance",
      "Security considerations",
      "Performance optimization needed"
    ],
    bestFor: "Growing businesses, content-heavy sites, long-term projects"
  },
  {
    key: "custom",
    label: "Custom Development",
    subtitle: "React/Next.js + Headless CMS",
    description: "Maximum performance & unique UX. Best for complex workflows and branding.",
    pros: [
      "Maximum customization",
      "Best performance",
      "Unique user experience",
      "Full technical control"
    ],
    cons: [
      "Highest development cost",
      "Longest development time",
      "Requires technical expertise",
      "Ongoing development costs"
    ],
    bestFor: "Established brands, complex requirements, premium positioning"
  }
] as const

export type DevelopmentApproach = typeof DEVELOPMENT_APPROACHES[number]["key"]

interface SampleWebsite {
  name: string
  url: string
  features: string[]
  image: string
  description?: string
}

export const SAMPLE_WEBSITES: Record<string, SampleWebsite[]> = {
  nocode: [
    {
      name: "Webflow Restaurant Templates",
      url: "https://webflow.com/templates/subcategory/restaurant-websites",
      features: ["Rich animation options", "Modern design", "Mobile-first", "Fast loading"],
      image: "/samples/nocode-1.jpg",
      description: "Professional restaurant templates with advanced animations and interactions"
    },
    {
      name: "Webflow Food & Drink Category",
      url: "https://webflow.com/templates/category/food-and-drink-websites",
      features: ["Specialized food templates", "E-commerce ready", "Responsive design", "SEO optimized"],
      image: "/samples/nocode-2.jpg",
      description: "Comprehensive collection of food and beverage website templates"
    },
    {
      name: "Webflow Made-in-Webflow Restaurants",
      url: "https://webflow.com/made-in-webflow/restaurant",
      features: ["Cloneable inspiration", "Real client examples", "Custom designs", "Advanced features"],
      image: "/samples/nocode-3.jpg",
      description: "Real restaurant websites built with Webflow for inspiration"
    },
    {
      name: "Squarespace Restaurant Templates",
      url: "https://www.squarespace.com/templates/browse/topic/restaurants/type/memberships%26online-store%26portfolio",
      features: ["Elegant aesthetics", "Online store integration", "Portfolio features", "Easy management"],
      image: "/samples/nocode-4.jpg",
      description: "Beautiful restaurant templates with e-commerce and portfolio capabilities"
    },
    {
      name: "Wix Restaurants & Food Templates",
      url: "https://www.wix.com/website/templates/html/restaurants-food",
      features: ["Professional layout", "Easy navigation", "Responsive design", "Food-focused"],
      image: "/samples/nocode-5.jpg",
      description: "Specialized templates designed specifically for restaurants and food businesses"
    },
    {
      name: "Squarespace Restaurant Tour",
      url: "https://www.squarespace.com/tour/restaurant-websites",
      features: ["Feature overview", "Interactive demos", "Mobile optimized", "Professional branding"],
      image: "/samples/nocode-6.jpg",
      description: "Comprehensive tour of restaurant website features and capabilities"
    }
  ],
  cms: [
    {
      name: "Rosa 2 - Pixelgrade Restaurant Theme",
      url: "https://pixelgrade.com/themes/rosa/",
      features: ["Restaurant-specific theme", "Beautiful design", "WooCommerce ready", "Mobile optimized"],
      image: "/samples/cms-1.jpg",
      description: "Premium restaurant theme with elegant design and full e-commerce capabilities"
    },
    {
      name: "Delicio - WPZOOM WooCommerce Theme",
      url: "https://wpzoom.com/themes/delicio/",
      features: ["WooCommerce ready", "Food-focused design", "Online ordering", "Responsive layout"],
      image: "/samples/cms-2.jpg",
      description: "Specialized theme designed for restaurants with WooCommerce integration"
    },
    {
      name: "Astra Restaurant Starter Sites",
      url: "https://wpastra.com/starter-sites/",
      features: ["Multiple restaurant templates", "Fast performance", "Customizable", "SEO friendly"],
      image: "/samples/cms-3.jpg",
      description: "Collection of restaurant starter sites built with the Astra theme framework"
    },
    {
      name: "Neve Theme - ThemeIsle",
      url: "https://themeisle.com/themes/neve/",
      features: ["Fast loading", "WooCommerce compatible", "Lightweight", "Developer friendly"],
      image: "/samples/cms-4.jpg",
      description: "High-performance theme optimized for speed and WooCommerce compatibility"
    },
    {
      name: "WooCommerce Restaurant Ordering Plugin",
      url: "https://woocommerce.com/products/restaurant-order-management/",
      features: ["Online ordering system", "Menu management", "Order tracking", "Payment integration"],
      image: "/samples/cms-5.jpg",
      description: "Specialized plugin for restaurant ordering and menu management"
    },
    {
      name: "Food Menu / WooCommerce Plugin",
      url: "https://wordpress.org/plugins/food-menu/",
      features: ["Food menu display", "WooCommerce integration", "Category management", "Custom styling"],
      image: "/samples/cms-6.jpg",
      description: "WordPress plugin for displaying restaurant menus with WooCommerce support"
    }
  ],
  custom: [
    {
      name: "The Avocado Show - Amsterdam",
      url: "https://www.theavocadoshow.com",
      features: ["Brand storytelling", "Sustainable messaging", "Multi-language", "Beautiful animations"],
      image: "/samples/custom-1.jpg",
      description: "Amsterdam-based restaurant with stunning brand site featuring sustainable avocados and beautiful UX"
    },
    {
      name: "Restaurant De Kas - Amsterdam",
      url: "https://restaurantdekas.com",
      features: ["Reservation system", "Storytelling design", "Farm-to-table concept", "Elegant typography"],
      image: "/samples/custom-2.jpg",
      description: "Amsterdam restaurant with farm-to-table concept and beautiful storytelling website design"
    },
    {
      name: "Vapiano NL - Multi-City",
      url: "https://vapiano.nl/en",
      features: ["Multi-location", "Modern flows", "Italian cuisine", "Responsive design"],
      image: "/samples/custom-3.jpg",
      description: "Multi-city Italian restaurant chain with modern website flows and excellent user experience"
    },
    {
      name: "Dishoom - UK",
      url: "https://www.dishoom.com/menu/all-day-main",
      features: ["Beautiful UX", "Interactive menus", "Motion design", "Advanced animations"],
      image: "/samples/custom-4.jpg",
      description: "UK restaurant with exceptional UX, beautiful motion design, and interactive menu experiences"
    },
    {
      name: "Top Restaurant Website Inspirations 2025",
      url: "https://www.sitebuilderreport.com/inspiration/restaurant-websites",
      features: ["Curated examples", "Latest trends", "Design inspiration", "Best practices"],
      image: "/samples/custom-5.jpg",
      description: "Curated collection of the best restaurant website designs and trends for 2025"
    },
    {
      name: "Webflow Community Showcases",
      url: "https://webflow.com/made-in-webflow/restaurants",
      features: ["Custom animations", "Webflow examples", "Community showcases", "Animation inspiration"],
      image: "/samples/custom-6.jpg",
      description: "Webflow community showcases featuring custom animations without full custom development stack"
    }
  ]
}
