export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  featured?: boolean;
  author: string;
  readTime: string;
  content: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title:
      "GreenLunar continues to build technology that moves business forward",
    slug: "greenlunar-technology-moving-business-forward",
    excerpt:
      "GreenLunar continues to develop practical digital solutions designed to improve operations, connect people and accelerate organisational growth.",
    category: "Technology",
    date: "October 2026",
    image: "/images/news/news-1.jpg",
    featured: true,
    author: "GreenLunar Group",
    readTime: "4 min read",

    content: [
      "GreenLunar Group continues to strengthen its commitment to building practical technology solutions designed to improve the way organisations operate, connect with their customers and manage critical business processes.",

      "Through its technology operations, the Group is developing digital platforms that address real operational challenges across multiple sectors. These solutions are designed with a strong focus on usability, efficiency, security and long-term scalability.",

      "GreenLunar's technology portfolio includes solutions for school management, electronic medical records, visitor management, electronic ticketing and digital payment operations. Together, these platforms form part of the Group's broader strategy to support digital transformation across organisations.",

      "Beyond software development, GreenLunar also works with technology partners and original equipment manufacturers to provide hardware solutions including smart boards, access-control turnstiles and boom barriers.",

      "As the Group continues to expand its technology operations, the focus remains on developing solutions that respond to local needs while meeting strong standards for performance, security and reliability.",

      "This approach reflects GreenLunar Group's broader vision of using innovation, strategic partnerships and responsible enterprise to create sustainable value across the sectors in which it operates.",
    ],
  },

  {
    id: 2,
    title:
      "Driving digital transformation through intelligent business solutions",
    slug: "driving-digital-transformation",
    excerpt:
      "Our technology solutions are helping organisations simplify processes, improve visibility and build more efficient operations.",
    category: "Technology",
    date: "September 2026",
    image: "/images/news/news-2.jpg",
    author: "GreenLunar Group",
    readTime: "3 min read",

    content: [
      "Digital transformation continues to reshape the way organisations manage operations, serve customers and make business decisions.",

      "At GreenLunar, our approach focuses on developing practical digital solutions that simplify complex processes and provide organisations with greater visibility across their operations.",

      "By bringing information, people and operational processes together through technology, organisations can reduce manual activities, improve decision-making and create more efficient working environments.",

      "Our technology strategy remains focused on developing scalable systems that can evolve alongside the organisations that use them.",

      "Through continued investment in technology, partnerships and product development, GreenLunar aims to contribute to a more connected and efficient digital ecosystem.",
    ],
  },

  {
    id: 3,
    title: "Building infrastructure designed for long-term value",
    slug: "building-infrastructure-long-term-value",
    excerpt:
      "Across our construction operations, we remain focused on quality delivery, effective project management and sustainable infrastructure.",
    category: "Construction",
    date: "September 2026",
    image: "/images/news/news-3.jpg",
    author: "GreenLunar Group",
    readTime: "3 min read",

    content: [
      "Infrastructure plays an important role in economic development, business growth and the creation of sustainable communities.",

      "Across our construction activities, GreenLunar Group focuses on delivering projects through effective planning, quality execution and disciplined project management.",

      "Our approach considers every stage of project delivery, from planning and procurement through construction, supervision and final delivery.",

      "Quality and long-term value remain central to how projects are approached, with emphasis placed on responsible execution and strong collaboration between project stakeholders.",

      "As our construction operations continue to develop, GreenLunar remains committed to building infrastructure that supports sustainable growth and creates lasting value.",
    ],
  },

  {
    id: 4,
    title:
      "Creating stronger partnerships across our growing businesses",
    slug: "creating-stronger-partnerships",
    excerpt:
      "Strategic partnerships remain central to GreenLunar Group's approach to innovation, market expansion and sustainable growth.",
    category: "Business",
    date: "August 2026",
    image: "/images/news/news-4.jpg",
    author: "GreenLunar Group",
    readTime: "3 min read",

    content: [
      "Strong partnerships are an important part of GreenLunar Group's strategy for building sustainable businesses and expanding into new opportunities.",

      "Across the Group, we work with organisations, technology providers, manufacturers, institutions and other strategic partners whose capabilities complement our own.",

      "These relationships allow our businesses to combine local market understanding with technical expertise, innovative products and international capabilities.",

      "Our partnership strategy is built around long-term value creation, accountability and shared objectives rather than short-term transactions.",

      "As GreenLunar Group continues to grow, strategic partnerships will remain an important part of our approach to innovation, market development and sustainable expansion.",
    ],
  },

  {
    id: 5,
    title:
      "Creating spaces and experiences that deliver lasting value",
    slug: "creating-spaces-lasting-value",
    excerpt:
      "Our real estate and hospitality interests focus on developing spaces that combine functionality, quality and memorable experiences.",
    category: "Real Estate",
    date: "August 2026",
    image: "/images/news/news-5.jpg",
    author: "GreenLunar Group",
    readTime: "3 min read",

    content: [
      "The spaces in which people live, work and interact have a significant influence on their experiences and quality of life.",

      "GreenLunar Group's interests in real estate and hospitality are focused on creating developments that combine functionality, quality and long-term value.",

      "Our approach considers the complete development lifecycle, from identifying opportunities and planning projects through development, management and operations.",

      "Within hospitality, the focus extends beyond physical infrastructure to the quality of the experience delivered to customers and guests.",

      "Through disciplined development and responsible investment, GreenLunar aims to create spaces and experiences capable of delivering sustainable value.",
    ],
  },

  {
    id: 6,
    title:
      "Innovation, wellness and sustainable growth across GreenLunar Group",
    slug: "innovation-wellness-sustainable-growth",
    excerpt:
      "GreenLunar continues to explore opportunities that create measurable impact across technology, wellness and other strategic sectors.",
    category: "Group News",
    date: "July 2026",
    image: "/images/news/news-6.jpg",
    author: "GreenLunar Group",
    readTime: "4 min read",

    content: [
      "GreenLunar Group operates with a long-term vision centred on innovation, responsible enterprise and sustainable value creation.",

      "Across technology, construction, real estate, hospitality, fitness, wellness, media and entertainment, the Group continues to explore opportunities capable of creating measurable impact.",

      "Each business area operates within its own market while benefiting from the wider capabilities, relationships and strategic direction of the Group.",

      "Innovation remains an important part of this strategy, particularly where technology and new operating models can improve efficiency and customer experiences.",

      "As GreenLunar continues its development, the Group remains focused on strengthening its businesses, developing strategic partnerships and identifying opportunities for sustainable growth.",
    ],
  },
];