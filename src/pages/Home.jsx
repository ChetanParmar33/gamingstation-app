import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaBolt, FaGamepad, FaShieldAlt, FaStar, FaChevronRight, FaChevronLeft, FaChevronDown,
  FaSearch, FaCheckCircle, FaTimesCircle, FaPlus, FaMotorcycle, FaWhatsapp,
  FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaPhoneAlt, FaEnvelope,
  FaMapMarkerAlt, FaRegFileAlt, FaCheck, FaInfoCircle, FaClock, FaHandsWash
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

export default function Home() {
  const [isLongTerm, setIsLongTerm] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);
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

  // Filter games based on category and search
  const filteredGames = GAMES_DATA.filter(game => {
    const matchesCategory = activeTab === 'All' || game.category === activeTab;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

          {/* Toggle Switch */}
          <div className="plan-toggle-buttons">
            <button 
              className={`plan-toggle-btn ${!isLongTerm ? 'active' : ''}`}
              onClick={() => setIsLongTerm(false)}
            >
              Short-Term Plans
            </button>
            <button 
              className={`plan-toggle-btn ${isLongTerm ? 'active' : ''}`}
              onClick={() => setIsLongTerm(true)}
            >
              Long-Term Plans
            </button>
          </div>

          {/* Pricing Grid */}
          <div className="plans-grid">
            {!isLongTerm ? (
              <>
                {/* 1 Day */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">1 Day <span className="duration-label">(24 Hours)</span></h3>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">499</span>
                  </div>
                  <ul className="plan-features">
                    <li><FaCheck /> 400+ Games</li>
                    <li><FaCheck /> 1 Controller</li>
                    <li><FaCheck /> 2-Hour Delivery</li>
                  </ul>
                  <Link to="/book?plan=oneday" className="btn btn-primary w-100">Select Plan</Link>
                </div>

                {/* 2 Days */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">2 Days</h3>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">949</span>
                  </div>
                  <ul className="plan-features">
                    <li><FaCheck /> 400+ Games</li>
                    <li><FaCheck /> 1 Controller</li>
                    <li><FaCheck /> 2-Hour Delivery</li>
                  </ul>
                  <Link to="/book?plan=twodays" className="btn btn-primary w-100">Select Plan</Link>
                </div>

                {/* 3 Days */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">3 Days</h3>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">1,499</span>
                  </div>
                  <ul className="plan-features">
                    <li><FaCheck /> 400+ Games</li>
                    <li><FaCheck /> 1 Controller</li>
                    <li><FaCheck /> 2-Hour Delivery</li>
                  </ul>
                  <Link to="/book?plan=threedays" className="btn btn-primary w-100">Select Plan</Link>
                </div>

                {/* 1 Week */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">1 Week <span className="duration-label">(7 Days)</span></h3>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">2,899</span>
                  </div>
                  <ul className="plan-features">
                    <li><FaCheck /> 400+ Games</li>
                    <li><FaCheck /> 1 Controller</li>
                    <li><FaCheck /> 1 Extra Controller</li>
                  </ul>
                  <Link to="/book?plan=sevendays" className="btn btn-primary w-100">Select Plan</Link>
                </div>
              </>
            ) : (
              <>
                {/* 15 Days */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">15 Days</h3>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">5,499</span>
                  </div>
                  <ul className="plan-features">
                    <li><FaCheck /> 400+ Games</li>
                    <li><FaCheck /> 2 Controllers</li>
                    <li><FaCheck /> Priority Support</li>
                  </ul>
                  <Link to="/book?plan=fifteendays" className="btn btn-primary w-100">Select Plan</Link>
                </div>

                {/* 1 Month */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">1 Month</h3>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">9,999</span>
                  </div>
                  <ul className="plan-features">
                    <li><FaCheck /> 400+ Games</li>
                    <li><FaCheck /> 2 Controllers</li>
                    <li><FaCheck /> Priority Support</li>
                  </ul>
                  <Link to="/book?plan=onemonth" className="btn btn-primary w-100">Select Plan</Link>
                </div>

                {/* 2 Months */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">2 Months</h3>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">18,999</span>
                  </div>
                  <ul className="plan-features">
                    <li><FaCheck /> 400+ Games</li>
                    <li><FaCheck /> 2 Controllers</li>
                    <li><FaCheck /> Priority Support</li>
                  </ul>
                  <Link to="/book?plan=twomonths" className="btn btn-primary w-100">Select Plan</Link>
                </div>

                {/* 3 Months */}
                <div className="plan-card glass-card recommended-plan">
                  <span className="recommended-badge">BEST VALUE</span>
                  <div className="plan-header">
                    <h3 className="plan-name">3 Months</h3>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">26,999</span>
                  </div>
                  <ul className="plan-features">
                    <li><FaCheck /> 400+ Games</li>
                    <li><FaCheck /> 2 Controllers</li>
                    <li><FaCheck /> Priority Support</li>
                  </ul>
                  <Link to="/book?plan=threemonths" className="btn btn-primary w-100">Select Plan</Link>
                </div>
              </>
            )}
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
            {/* PS5 Console */}
            <div className="package-item glass-card text-center">
              <div className="package-image-container">
                <img src="/assets/ps5_hero.png" alt="PlayStation 5 Console" className="package-console-img" />
              </div>
              <h4>PlayStation 5 Console</h4>
              <p>Disc Edition – Latest Model</p>
            </div>

            {/* Controller */}
            <div className="package-item glass-card text-center">
              <div className="package-image-container">
                <img src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80" alt="DualSense Controller" className="package-controller-img" />
              </div>
              <h4>DualSense Controller</h4>
              <p>Wireless Next-Gen Controller</p>
            </div>

            {/* Subscription */}
            <div className="package-item glass-card text-center">
              <div className="package-image-container flex-center">
                <div className="ps-plus-deluxe-badge">
                  <span className="ps-icon">&oplus;</span>
                  <span className="ps-title">PlayStation Plus</span>
                  <span className="ps-tier">DELUXE</span>
                </div>
              </div>
              <h4>PS Plus Deluxe Subscription</h4>
              <p>400+ Games Access</p>
            </div>

            {/* Cable Kit */}
            <div className="package-item glass-card text-center">
              <div className="package-image-container flex-center">
                <div className="cables-visual-box">
                  <span className="cable-connector"></span>
                  <span className="cable-connector"></span>
                  <span className="cable-connector"></span>
                </div>
              </div>
              <h4>Complete Cable Kit</h4>
              <p>HDMI, Power, USB, LAN Cables</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FILTERABLE GAMES LIBRARY */}
      <section className="games-section" id="games-library">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">400+ GAMES LIBRARY</h2>
            <p className="section-desc">Something for every gamer!</p>
          </div>

          {/* Search and Category Filters */}
          <div className="games-filters-container">
            <div className="game-search-box">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search games..." 
                className="game-search-input" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="games-tabs">
              {['All', 'Action', 'Adventure', 'Sports', 'Racing', 'Fighting'].map(category => (
                <button 
                  key={category}
                  className={`game-tab-btn ${activeTab === category ? 'active' : ''}`}
                  onClick={() => setActiveTab(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Games Grid */}
          <div className="games-grid">
            {filteredGames.slice(0, 8).map(game => (
              <div 
                key={game.id}
                className="game-card glass-card"
                onClick={() => setSelectedGame(game)}
              >
                <div className="game-image-wrapper">
                  <img src={game.image} alt={game.title} className="game-image" />
                  <span className="game-rating-tag"><FaStar className="star-icon" /> {game.rating}</span>
                </div>
                <div className="game-info text-center">
                  <span className="game-genre-label">{game.category}</span>
                  <h4 className="game-title">{game.title}</h4>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/plans" className="btn btn-secondary">
              View All Games (400+) <FaPlus style={{ fontSize: '0.8rem', marginLeft: '0.4rem' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* GAME DETAIL MODAL POPUP */}
      {selectedGame && (
        <div className="game-modal active" id="game-detail-modal" onClick={() => setSelectedGame(null)}>
          <div className="game-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="game-modal-close" onClick={() => setSelectedGame(null)}>&times;</button>
            <div className="game-modal-body">
              <div className="game-modal-image-col">
                <img src={selectedGame.image} alt={selectedGame.title} className="game-modal-img" />
              </div>
              <div className="game-modal-content-col">
                <span className="game-modal-genre">{selectedGame.category}</span>
                <h2 className="game-modal-title">{selectedGame.title}</h2>
                <div className="game-modal-stats">
                  <span className="stat-pill"><FaStar /> {selectedGame.rating} / 10</span>
                  <span className="stat-pill"><FaClock /> {selectedGame.release}</span>
                  <span className="stat-pill"><FaGamepad /> {selectedGame.mode}</span>
                </div>
                <p className="game-modal-desc">{selectedGame.description}</p>
                <div style={{ marginTop: '2rem' }}>
                  <Link to="/book" className="btn btn-primary" onClick={() => setSelectedGame(null)}>
                    Book PS5 with this game
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* 7. REAL SETUPS SHOWCASE */}
      <section className="gallery-section" id="showcase-gallery">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title decoration-accent">
              <span className="dec-line">&larr;&larr;</span> REAL SETUPS. REAL GAMERS. <span className="dec-line">&rarr;&rarr;</span>
            </h2>
          </div>

          <div className="gallery-layout-grid">
            <div className="gallery-main-item glass-card">
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80" alt="Setup 1" />
            </div>
            <div className="gallery-sub-grid">
              <div className="gallery-sub-item glass-card">
                <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80" alt="Setup 2" />
              </div>
              <div className="gallery-sub-item glass-card">
                <img src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&auto=format&fit=crop&q=80" alt="Setup 3" />
              </div>
              <div className="gallery-sub-item glass-card">
                <img src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80" alt="Setup 4" />
              </div>
              <div className="gallery-sub-item glass-card">
                <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80" alt="Setup 5" />
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-secondary">
              View More Setups <FaChevronDown style={{ marginLeft: '0.4rem', fontSize: '0.8rem' }} />
            </button>
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
                      <div className="faq-accordion-body" style={{ display: expandedFaq === idx ? 'block' : 'none' }}>
                        <p>{faq.answer}</p>
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
                        <div className="faq-accordion-body" style={{ display: expandedFaq === realIdx ? 'block' : 'none' }}>
                          <p>{faq.answer}</p>
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
              <li><a href="#games-library">Games</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#showcase-gallery">Gallery</a></li>
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
