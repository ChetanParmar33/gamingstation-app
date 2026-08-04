import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaBolt, FaGamepad, FaShieldAlt, FaStar, FaChevronRight, FaChevronLeft, FaChevronDown,
  FaSearch, FaCheckCircle, FaTimesCircle, FaPlus, FaMotorcycle, FaWhatsapp,
  FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaPhoneAlt, FaEnvelope,
  FaMapMarkerAlt, FaRegFileAlt, FaCheck, FaInfoCircle, FaClock, FaHandsWash,
  FaCalendarAlt, FaCrown, FaGift
} from 'react-icons/fa';

const GAMES_DATA = [
  {
    id: 'wwe2k24',
    title: 'WWE 2K24',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=400&auto=format&fit=crop&q=80',
    rating: '9.0',
    genre: 'Sports / Wrestling',
    release: '2024',
    mode: 'Multiplayer / Co-Op',
    description: 'Experience a gripping retelling of WWE\'s greatest moments in 2K Showcase of the Immortals, featuring some of the most unforgettable, career-defining matches.'
  },
  {
    id: 'spiderman2',
    title: 'Spider-Man 2',
    category: 'Action',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
    rating: '9.8',
    genre: 'Action-Adventure',
    release: '2023',
    mode: 'Single Player',
    description: 'Swing, jump, and utilize the new Web Wings to travel across Marvel\'s New York, quickly switching between Peter Parker and Miles Morales.'
  },
  {
    id: 'godofwar',
    title: 'God of War Ragnarok',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&auto=format&fit=crop&q=80',
    rating: '9.7',
    genre: 'Action-Adventure',
    release: '2022',
    mode: 'Single Player',
    description: 'Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle.'
  },
  {
    id: 'fc24',
    title: 'EA Sports FC 24',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80',
    rating: '8.9',
    genre: 'Sports / Soccer',
    release: '2023',
    mode: 'Multiplayer / Co-Op',
    description: 'EA SPORTS FC 24 welcomes you to The World\'s Game: the most true-to-football experience ever with HyperMotionV and Frostbite Engine.'
  },
  {
    id: 'tekken8',
    title: 'Tekken 8',
    category: 'Fighting',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
    rating: '9.3',
    genre: '3D Fighting',
    release: '2024',
    mode: 'Multiplayer / Co-Op',
    description: 'Get ready for the next chapter in the legendary fighting game franchise. Powered by Unreal Engine 5, Tekken 8 pushes the limits of next-gen hardware.'
  },
  {
    id: 'gtav',
    title: 'GTA V',
    category: 'Action',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&auto=format&fit=crop&q=80',
    rating: '9.5',
    genre: 'Action-Adventure / Open World',
    release: '2021 (PS5 Edition)',
    mode: 'Single Player / Online',
    description: 'Experience the blockbusters Grand Theft Auto V and GTA Online, now upgraded for PlayStation 5 with stunning visuals, faster loading, and more.'
  },
  {
    id: 'horizon',
    title: 'Horizon Forbidden West',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80',
    rating: '9.4',
    genre: 'Action-Adventure',
    release: '2022',
    mode: 'Single Player',
    description: 'Explore distant lands, fight bigger and more awe-inspiring machines, and encounter astonishing new tribes as you return to the far-future world of Horizon.'
  },
  {
    id: 'lastofus',
    title: 'The Last of Us Part I',
    category: 'Action',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    rating: '9.6',
    genre: 'Action-Adventure / Survival',
    release: '2022',
    mode: 'Single Player',
    description: 'Experience the emotional storytelling and unforgettable characters of Joel and Ellie in The Last of Us, rebuilt from the ground up for the PS5.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Jay Shah',
    location: 'Anand',
    text: 'Super fast delivery and setup! PS5 quality was excellent. Loved the experience! 🔥'
  },
  {
    name: 'Meet Patel',
    location: 'Nadiad',
    text: 'Best rental service in town. Zero hassle and amazing support!'
  },
  {
    name: 'Krunal Desai',
    location: 'Petlad',
    text: '2-hour delivery is real! Played with friends all night. Totally worth it.'
  },
  {
    name: 'Dhaval Mehta',
    location: 'Anand',
    text: 'Controllers were clean and games collection is just awesome!'
  }
];

const FAQ_ITEMS = [
  {
    question: 'What documents are required for KYC?',
    answer: 'You will need: 1. Aadhaar Card/Passport, 2. Address proof (utility bill/rent agreement matching delivery location), and 3. Professional proof (work ID card or student ID).'
  },
  {
    question: 'Is there any security deposit?',
    answer: 'No! GamingStation50 requires zero security deposit. We only request basic KYC verification before delivery.'
  },
  {
    question: 'What if the console gets damaged?',
    answer: 'Minor wear and tear is covered under our policy. In case of major physical damage or liquid spills, repair costs will be evaluated and charged based on official Sony service center quotes.'
  },
  {
    question: 'Do you install games according to our choice?',
    answer: 'Yes, absolutely! When our team calls you to confirm your booking, you can request specific games and we will pre-install them from our digital library.'
  },
  {
    question: 'How fast is the delivery?',
    answer: 'We offer super-fast 2-hour express delivery across Anand & Nadiad if booked before 6 PM.'
  },
  {
    question: 'Do you deliver outside Anand & Nadiad?',
    answer: 'Currently we deliver in Anand, Nadiad, Petlad, and nearby regions. For other locations, please contact us on WhatsApp to verify availability.'
  },
  {
    question: 'How do pickup & returns work?',
    answer: 'When your plan ends, our rider will coordinate a convenient time, visit your location, verify the items, and pack them up. Pickup is completely free.'
  },
  {
    question: 'Can I extend my rental period?',
    answer: 'Yes, extensions are subject to availability. You can request an extension through our WhatsApp support at least 12 hours before your scheduled pickup.'
  }
];

const RENTAL_PLANS = [
  { 
    id: 'oneday', 
    name: '1 DAY', 
    period: '24 Hours', 
    price: '999', 
    color: '#3b82f6', 
    icon: 'gamepad',
    features: ['400+ Games Access', '1 DualSense Controller', '2-Hour Delivery Zone', 'Standard Technical Support'],
    desc: 'Perfect for quick gatherings, co-op nights, or testing system exclusives.',
    tag: 'TRIAL RUN'
  },
  { 
    id: 'twodays', 
    name: '2 DAYS', 
    period: '48 Hours', 
    price: '1,899', 
    color: '#a855f7', 
    icon: 'calendar',
    features: ['400+ Games Access', '1 DualSense Controller', '2-Hour Delivery Zone', 'Standard Technical Support'],
    desc: 'Great for an immersive gaming experience over a short break or weekend.',
    tag: 'WEEKEND PASS'
  },
  { 
    id: 'threedays', 
    name: '3 DAYS', 
    period: '72 Hours', 
    price: '2,599', 
    color: '#f97316', 
    icon: 'calendar',
    features: ['400+ Games Access', '1 DualSense Controller', '2-Hour Delivery Zone', 'Priority Technical Support'],
    desc: 'Perfect short term pass to complete deep campaigns or play multiple games.',
    tag: 'MID-WEEK PASS'
  },
  { 
    id: 'fourdays', 
    name: '4 DAYS', 
    period: '96 Hours', 
    price: '2,999', 
    color: '#06b6d4', 
    icon: 'calendar',
    features: ['400+ Games Access', '1 DualSense Controller', '2-Hour Delivery Zone', 'Priority Technical Support'],
    desc: 'Excellent choice for multi-day gaming sessions with absolute comfort.',
    tag: 'PRO GAMER'
  },
  { 
    id: 'fivedays', 
    name: '5 DAYS', 
    period: '120 Hours', 
    price: '3,699', 
    color: '#ec4899', 
    icon: 'gift',
    features: ['400+ Games Access', '1 DualSense Controller + 1 Controller FREE', '2-Hour Delivery Zone', 'Priority Support'],
    desc: 'Maximize your weekly gaming target with your favorite titles and friends.',
    tag: 'ELITE PASS'
  },
  { 
    id: 'sixdays', 
    name: '6 DAYS', 
    period: '144 Hours', 
    price: '3,999', 
    color: '#eab308', 
    icon: 'gift',
    features: ['400+ Games Access', '1 DualSense Controller + 1 Controller FREE', '2-Hour Delivery Zone', 'Priority Support'],
    desc: 'Spend nearly a full week exploring next-gen blockbusters with friends.',
    tag: 'CHAMPION'
  },
  { 
    id: 'sevendays', 
    name: '7 DAYS', 
    period: '1 Week', 
    price: '4,599', 
    color: '#3b82f6', 
    icon: 'crown',
    features: ['400+ Games Access', '1 DualSense Controller + 1 Controller FREE', 'Instant VVIP Delivery', 'Priority 24/7 Support'],
    desc: 'Our complete week-long ultimate unlimited gaming experience. Best value per day.',
    tag: 'BEST VALUE', 
    isRecommended: true 
  }
];

const getPlanIcon = (iconName) => {
  switch (iconName) {
    case 'gamepad': return <FaGamepad />;
    case 'calendar': return <FaCalendarAlt />;
    case 'gift': return <FaGift />;
    case 'crown': return <FaCrown />;
    default: return <FaGamepad />;
  }
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '59, 130, 246';
};

const PS5ConsoleSVG = () => (
  <svg width="60" height="90" viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.2))' }}>
    <path d="M12 5C16 12 18 35 18 55C18 75 16 82 12 85C16 85 20 78 22 55C24 32 20 12 12 5Z" fill="#ffffff"/>
    <path d="M48 5C44 12 42 35 42 55C42 75 44 82 48 85C44 85 40 78 38 55C36 32 40 12 48 5Z" fill="#ffffff" opacity="0.95"/>
    <path d="M18 10C22 15 24 35 24 55C24 72 22 80 18 82C22 82 38 82 42 82C38 80 36 72 36 55C36 35 38 15 42 10H18Z" fill="#0d111a"/>
    <path d="M18 10C22 15 24 35 24 55" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
    <path d="M42 10C38 15 36 35 36 55" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
    <path d="M38 60C38 68 40 75 42 78V60H38Z" fill="#ffffff"/>
  </svg>
);

const ControllerSVG = () => (
  <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.15))' }}>
    <path d="M15 15C22 10 58 10 65 15C72 18 78 32 75 48C73 52 68 55 64 50C60 46 56 36 54 34H26C24 36 20 46 16 50C12 55 7 52 5 48C2 32 8 18 15 15Z" fill="#ffffff"/>
    <path d="M25 15H55V25C55 32 48 38 40 38C32 38 25 32 25 25V15Z" fill="#0e131f"/>
    <circle cx="32" cy="36" r="7" fill="#374151"/>
    <circle cx="48" cy="36" r="7" fill="#374151"/>
    <path d="M13 22H19V28H13V22Z" fill="#d1d5db"/>
    <path d="M16 19H16V31" stroke="#d1d5db" strokeWidth="2"/>
    <circle cx="64" cy="22" r="2.5" fill="#d1d5db"/>
    <circle cx="68" cy="25" r="2.5" fill="#d1d5db"/>
    <circle cx="60" cy="25" r="2.5" fill="#d1d5db"/>
    <circle cx="64" cy="28" r="2.5" fill="#d1d5db"/>
  </svg>
);

const PSPlusDeluxeGold = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 12px rgba(234, 179, 8, 0.4))' }}>
    <path d="M22 10H38V22H50V38H38V50H22V38H10V22H22V10Z" fill="url(#goldGradient)" stroke="#eab308" strokeWidth="2"/>
    <circle cx="30" cy="16" r="2.5" fill="#ffffff" opacity="0.9"/>
    <circle cx="30" cy="44" r="2.5" fill="#ffffff" opacity="0.9"/>
    <circle cx="16" cy="30" r="2.5" fill="#ffffff" opacity="0.9"/>
    <circle cx="44" cy="30" r="2.5" fill="#ffffff" opacity="0.9"/>
    <defs>
      <linearGradient id="goldGradient" x1="10" y1="10" x2="50" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>
  </svg>
);

const HDMICableSVG = () => (
  <svg width="70" height="60" viewBox="0 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.3))' }}>
    <rect x="25" y="10" width="20" height="15" rx="2" fill="#1f2937" stroke="#4b5563" strokeWidth="1"/>
    <rect x="28" y="5" width="14" height="5" fill="#fbbf24"/>
    <line x1="31" y1="5" x2="31" y2="10" stroke="#1f2937" strokeWidth="1"/>
    <line x1="34" y1="5" x2="34" y2="10" stroke="#1f2937" strokeWidth="1"/>
    <line x1="37" y1="5" x2="37" y2="10" stroke="#1f2937" strokeWidth="1"/>
    <line x1="40" y1="5" x2="40" y2="10" stroke="#1f2937" strokeWidth="1"/>
    <path d="M35 25C35 35 45 40 45 55" stroke="#111827" strokeWidth="6" strokeLinecap="round"/>
    <path d="M35 25C35 35 45 40 45 55" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PowerCableSVG = () => (
  <svg width="70" height="60" viewBox="0 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))' }}>
    <rect x="22" y="15" width="26" height="20" rx="4" fill="#1f2937" stroke="#4b5563" strokeWidth="1"/>
    <rect x="27" y="5" width="4" height="10" rx="1" fill="#cbd5e0"/>
    <rect x="39" y="5" width="4" height="10" rx="1" fill="#cbd5e0"/>
    <path d="M35 35C35 42 25 45 25 55" stroke="#111827" strokeWidth="6" strokeLinecap="round"/>
    <path d="M35 35C35 42 25 45 25 55" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LANCableSVG = () => (
  <svg width="70" height="60" viewBox="0 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}>
    <rect x="25" y="12" width="20" height="18" rx="2" fill="#e2e8f0" stroke="#cbd5e0" strokeWidth="1"/>
    <rect x="29" y="5" width="12" height="7" fill="#93c5fd" opacity="0.8"/>
    <path d="M31 15L35 6L39 15H31Z" fill="#cbd5e0"/>
    <path d="M35 30C35 38 45 42 45 55" stroke="#2563eb" strokeWidth="6" strokeLinecap="round"/>
    <path d="M35 30C35 38 45 42 45 55" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const INCLUDED_ITEMS = [
  { id: 'ps5', title: 'PS5 Console', desc: 'Latest Model Disc Edition', visual: <PS5ConsoleSVG /> },
  { id: 'controller', title: 'DualSense Controller', desc: 'Wireless Next-Gen Control', visual: <ControllerSVG /> },
  { id: 'psplus', title: 'PS Plus Deluxe', desc: '400+ Games Included', visual: <PSPlusDeluxeGold /> },
  { id: 'hdmi', title: 'HDMI Cable', desc: 'High Speed HDMI 2.1', visual: <HDMICableSVG /> },
  { id: 'power', title: 'Power Cable', desc: 'Safe & Reliable Power Supply', visual: <PowerCableSVG /> },
  { id: 'lan', title: 'LAN Cable', desc: 'Stable & Fast Internet', visual: <LANCableSVG /> }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const location = useLocation();

  const startSlideShow = () => {
    // slide show handler
  };

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  // Scroll to hash on load
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);


  return (
    <div className="home-root-wrapper">
      {/* 1. HERO SECTION */}
      <section className="hero-section" id="hero">
        <div className="container hero-container-grid">
          <div className="hero-content">
            <span className="section-tag">
              ANAND & NADIAD'S PREMIUM PS5 RENTAL SERVICE
            </span>
            <h1 className="hero-title">
              NEXT-GEN PS5.<br />
              <span className="accent-blue">AT YOUR DOORSTEP.</span>
            </h1>
            <p className="hero-desc">
              Zero Deposit. 2-Hour Delivery. 400+ Games. Bring the Ultimate Gaming Experience Home.
            </p>
            <div className="hero-cta-group">
              <Link to="/book" className="btn btn-primary btn-lg">
                <FaGamepad style={{ marginRight: '0.6rem' }} /> Book Console Now
              </Link>
              <a href="#pricing-plans" className="btn btn-secondary btn-lg">
                View Plans & Details &rarr;
              </a>
            </div>
            
            {/* Gamers Trust Badges */}
            <div className="hero-gamers-trust">
              <div className="happy-avatars-row">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&crop=face&q=80" alt="Gamer 1" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&crop=face&q=80" alt="Gamer 2" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&crop=face&q=80" alt="Gamer 3" />
              </div>
              <span className="gamers-count-text">500+ Happy Gamers</span>
              <div className="gamers-stars-row">
                <span className="stars-icons"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></span>
                <span className="rating-desc">4.9 (120+ Reviews)</span>
              </div>
            </div>
          </div>
          
          {/* Hero Visual Design with Floating Game Covers */}
          <div className="hero-image-wrapper">
            <div className="hero-glow-back"></div>
            
            {/* Floating Covers Stack */}
            <div className="floating-game-cover cover-wwe">
              <img src={GAMES_DATA[0].image} alt="WWE 2K24" />
              <span>WWE 2K24</span>
            </div>
            <div className="floating-game-cover cover-spiderman">
              <img src={GAMES_DATA[1].image} alt="Spider-Man 2" />
              <span>Spider-Man 2</span>
            </div>
            <div className="floating-game-cover cover-gow">
              <img src={GAMES_DATA[2].image} alt="God of War" />
              <span>God of War</span>
            </div>

            <img 
              src="/assets/ps5_hero.png" 
              alt="Sony PlayStation 5 Console & DualSense Controller" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* 2. TRUST VALUE CARDS SECTION */}
      <section className="trust-badges-section">
        <div className="container trust-grid">
          <div className="trust-badge-item glass-card">
            <div className="trust-icon"><FaShieldAlt /></div>
            <div className="trust-texts">
              <h4>Zero Security Deposit</h4>
              <p>Simple KYC Only. No hidden charges</p>
            </div>
          </div>
          <div className="trust-badge-item glass-card">
            <div className="trust-icon"><FaBolt /></div>
            <div className="trust-texts">
              <h4>2-Hour Express Delivery</h4>
              <p>Lightning fast delivery & setup at your door</p>
            </div>
          </div>
          <div className="trust-badge-item glass-card">
            <div className="trust-icon"><FaGamepad /></div>
            <div className="trust-texts">
              <h4>Sanitized Controllers</h4>
              <p>UV Sanitized & Quality checked before delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHOOSE YOUR PLAN SECTION */}
      <section className="plans-section" id="pricing-plans">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title decoration-accent">
              <span className="dec-line">&larr;&larr;</span> CHOOSE YOUR PERFECT PLAN <span className="dec-line">&rarr;&rarr;</span>
            </h2>
          </div>

          {/* Pricing Grid */}
          <div className="plans-list-container">
            {RENTAL_PLANS.map((plan) => (
              <div 
                key={plan.id} 
                className={`collapsible-plan-row ${expandedPlanId === plan.id ? 'expanded' : ''} ${plan.isRecommended ? 'recommended' : ''}`}
                onClick={() => setExpandedPlanId(expandedPlanId === plan.id ? null : plan.id)}
                style={{ '--plan-color': plan.color, '--plan-color-rgb': hexToRgb(plan.color) }}
              >
                <div className="plan-row-main">
                  <div className="plan-row-icon-box">
                    {getPlanIcon(plan.icon)}
                  </div>
                  
                  <div className="plan-row-info">
                    <div className="plan-row-title-row">
                      <h4 className="plan-row-title">{plan.name}</h4>
                      <span className="plan-row-period">({plan.period})</span>
                    </div>
                    <div className="plan-row-bullets">
                      <span>• 400+ Games</span>
                      <span>• {plan.id === 'fivedays' || plan.id === 'sixdays' || plan.id === 'sevendays' ? '+1 Controller FREE' : '1 Controller'}</span>
                    </div>
                  </div>
                  
                  <div className="plan-row-right">
                    <span className="plan-row-price">₹{plan.price}</span>
                    <FaChevronRight className="plan-row-arrow" />
                  </div>

                  {plan.isRecommended && (
                    <span className="plan-row-recommended-badge">BEST VALUE</span>
                  )}
                </div>

                <div className="plan-row-details">
                  <div className="plan-details-content">
                    <p className="plan-details-desc">{plan.desc}</p>
                    <div className="plan-details-features">
                      <h5>Included Features:</h5>
                      <ul>
                        {plan.features.map((feat, idx) => (
                          <li key={idx}><FaCheck className="feature-check-icon" /> {feat}</li>
                        ))}
                      </ul>
                    </div>
                    <Link 
                      to={`/book?plan=${plan.id}`} 
                      className="btn btn-primary plan-book-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Book This Plan
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick value badges bottom bar */}
          <div className="plans-bottom-value-bar">
            <span><FaCheckCircle className="accent-icon" /> Free Delivery & Setup</span>
            <span><FaCheckCircle className="accent-icon" /> COD Available</span>
            <span><FaCheckCircle className="accent-icon" /> Easy Returns</span>
            <span><FaCheckCircle className="accent-icon" /> Trusted by 500+ Gamers</span>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/plans" className="view-all-plans-link">View All Plans &rarr;</Link>
          </div>
        </div>
      </section>

      {/* 4. WHAT'S INCLUDED IN PACKAGE SECTION */}
      <section className="detail-section" id="spec-benefits">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title decoration-accent">
              <span className="dec-line">&larr;&larr;</span> WHAT'S INCLUDED IN EVERY PACKAGE? <span className="dec-line">&rarr;&rarr;</span>
            </h2>
          </div>

          <div className="package-grid">
            {INCLUDED_ITEMS.map((item) => (
              <div key={item.id} className="package-item glass-card">
                <span className="package-checkmark"><FaCheck /></span>
                <div className="package-image-container">
                  {item.visual}
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
            
            {/* Sanitized Bar */}
            <div className="package-item-full glass-card">
              <div className="package-item-full-icon">
                <FaShieldAlt />
              </div>
              <div className="package-item-full-texts">
                <h4>Sanitized & Quality Checked</h4>
                <p>UV Sanitized • 100% Clean</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 6. HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title decoration-accent">
              <span className="dec-line">&larr;&larr;</span> HOW IT WORKS <span className="dec-line">&rarr;&rarr;</span>
            </h2>
          </div>

          <div className="how-works-grid">
            {/* Step 1 */}
            <div className="how-step-card glass-card">
              <div className="step-number-badge">1</div>
              <div className="step-icon-box"><FaRegFileAlt /></div>
              <h3>Select Plan & Verify</h3>
              <p>Choose your plan and complete quick KYC verification.</p>
            </div>
            
            {/* Step 2 */}
            <div className="how-step-card glass-card">
              <div className="step-number-badge">2</div>
              <div className="step-icon-box"><FaMotorcycle /></div>
              <h3>Doorstep Setup</h3>
              <p>We deliver & set up the console at your living room.</p>
            </div>

            {/* Step 3 */}
            <div className="how-step-card glass-card">
              <div className="step-number-badge">3</div>
              <div className="step-icon-box"><FaGamepad /></div>
              <h3>Play & Return</h3>
              <p>Enjoy gaming to the fullest & we\'ll pickup on time.</p>
            </div>
          </div>
        </div>
      </section>


      {/* 8. WHAT OUR GAMERS SAY */}
      <section className="testimonials-section" id="reviews">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title decoration-accent">
              <span className="dec-line">&larr;&larr;</span> WHAT OUR GAMERS SAY <span className="dec-line">&rarr;&rarr;</span>
            </h2>
          </div>

          <div className="testimonials-slider-box">
            <div className="testimonials-flex-container">
              {TESTIMONIALS.map((t, idx) => (
                <div 
                  key={idx}
                  className={`testimonial-card-item glass-card ${currentSlide === idx ? 'active' : ''}`}
                  style={{ display: currentSlide === idx ? 'block' : 'none' }}
                >
                  <div className="testimonial-profile">
                    <img src={`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&crop=face&q=80`} alt={t.name} />
                    <div>
                      <h4>{t.name}</h4>
                      <span className="gamer-city">{t.location}</span>
                      <div className="stars-glow"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                    </div>
                  </div>
                  <p className="testimonial-quote-text">"{t.text}"</p>
                </div>
              ))}
            </div>

            {/* Slider Dots */}
            <div className="slider-navigation-dots">
              {TESTIMONIALS.map((_, idx) => (
                <span 
                  key={idx}
                  className={`slider-dot ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => handleSlideChange(idx)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQs ACCORDION & WHATSAPP SUPPORT */}
      <section className="faq-section" id="faq-desk">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title decoration-accent">
              <span className="dec-line">&larr;&larr;</span> FREQUENTLY ASKED QUESTIONS <span className="dec-line">&rarr;&rarr;</span>
            </h2>
          </div>

          <div className="faq-main-wrapper">
            {/* Left/Main FAQ Accordion Grid */}
            <div className="faq-accordion-container">
              <div className="faq-two-col-layout">
                <div className="faq-column">
                  {FAQ_ITEMS.slice(0, 4).map((faq, idx) => (
                    <div 
                      key={idx} 
                      className={`faq-accordion-item glass-card ${expandedFaq === idx ? 'active' : ''}`}
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    >
                      <div className="faq-accordion-header">
                        <h3>{faq.question}</h3>
                        <span className="faq-toggle-icon">
                          {expandedFaq === idx ? <FaTimesCircle /> : <FaPlus />}
                        </span>
                      </div>
                      <div className={`faq-accordion-body ${expandedFaq === idx ? 'expanded' : ''}`}>
                        <div className="faq-accordion-content">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="faq-column">
                  {FAQ_ITEMS.slice(4, 8).map((faq, idx) => {
                    const realIdx = idx + 4;
                    return (
                      <div 
                        key={realIdx} 
                        className={`faq-accordion-item glass-card ${expandedFaq === realIdx ? 'active' : ''}`}
                        onClick={() => setExpandedFaq(expandedFaq === realIdx ? null : realIdx)}
                      >
                        <div className="faq-accordion-header">
                          <h3>{faq.question}</h3>
                          <span className="faq-toggle-icon">
                            {expandedFaq === realIdx ? <FaTimesCircle /> : <FaPlus />}
                          </span>
                        </div>
                        <div className={`faq-accordion-body ${expandedFaq === realIdx ? 'expanded' : ''}`}>
                          <div className="faq-accordion-content">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky/Floating WhatsApp Support Box */}
            <div className="whatsapp-help-box glass-card text-center">
              <div className="whatsapp-icon-wrapper"><FaWhatsapp /></div>
              <h4>Still have questions?</h4>
              <p>We're here to help!</p>
              <a 
                href="https://wa.me/917900980514?text=Hi,%20I'm%20interested%20in%20renting%20a%20PS5%20console." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp w-100"
              >
                <FaWhatsapp style={{ marginRight: '0.5rem' }} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER VALUE PRESETS */}
      <section className="footer-presets-section">
        <div className="container presets-grid">
          <div className="preset-item">
            <FaShieldAlt className="preset-icon" />
            <div>
              <h5>100% Safe & Secure</h5>
              <p>Your data is protected</p>
            </div>
          </div>
          <div className="preset-item">
            <FaHandsWash className="preset-icon" />
            <div>
              <h5>Hassle-Free Experience</h5>
              <p>We make gaming easy</p>
            </div>
          </div>
          <div className="preset-item">
            <FaGamepad className="preset-icon" />
            <div>
              <h5>Top Quality Consoles</h5>
              <p>Best performance always</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FOOTER */}
      <footer className="footer-layout">
        <div className="container footer-links-grid">
          <div className="footer-brand-col">
            <div className="logo-container" style={{ marginBottom: '1.2rem' }}>
              <span className="logo-gaming-station">
                <span className="logo-gamepad"><FaGamepad /></span>
                <span className="logo-text" style={{ color: 'var(--white)' }}>GAMING<br/>STATION</span>
              </span>
              <span className="logo-box-50">50</span>
            </div>
            <p>Next-Gen Gaming, Delivered. Zero Deposit. 2-Hour Delivery.</p>
            <div className="footer-social-row">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="Youtube"><FaYoutube /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>QUICK LINKS</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><a href="#pricing-plans">Plans</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/about">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>SUPPORT</h4>
            <ul className="footer-contact-details">
              <li><FaPhoneAlt /> +91 79009 80514</li>
              <li><FaEnvelope /> support@gamingstation50.com</li>
              <li><FaClock /> 10:00 AM – 10:00 PM [All Days]</li>
              <li><FaMapMarkerAlt /> Anand & Nadiad, Gujarat</li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>WHY GAMINGSTATION50?</h4>
            <ul className="why-bullet-points">
              <li>&bull; Zero Security Deposit</li>
              <li>&bull; 2-Hour Express Delivery</li>
              <li>&bull; Sanitized & Quality Checked</li>
              <li>&bull; 400+ Games Library</li>
              <li>&bull; Trusted by 500+ Happy Gamers</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-copyright">
          <div className="container bottom-copyright-flex">
            <span>&copy; 2025 GamingStation50. All Rights Reserved.</span>
            <div className="copyright-links">
              <a href="#">Privacy Policy</a>
              <span className="divider">|</span>
              <a href="#">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
