import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const GAMES_DATA = [
  {
    id: 'spiderman',
    title: 'Spider-Man 2',
    category: 'Action',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
    rating: '9.8',
    genre: 'Action-Adventure',
    release: '2023',
    mode: 'Single Player',
    description: 'Swing, jump, and utilize the new Web Wings to travel across Marvel\'s New York, quickly switching between Peter Parker and Miles Morales to experience different stories and epic new powers.'
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
    description: 'EA SPORTS FC 24 welcomes you to The World\'s Game: the most true-to-football experience ever with HyperMotionV, PlayStyles optimised by Opta, and a revolutionised Frostbite Engine.'
  },
  {
    id: 'godofwar',
    title: 'God of War Ragnarok',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80',
    rating: '9.7',
    genre: 'Action-Adventure',
    release: '2022',
    mode: 'Single Player',
    description: 'Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.'
  },
  {
    id: 'gt7',
    title: 'Gran Turismo 7',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&auto=format&fit=crop&q=80',
    rating: '9.1',
    genre: 'Racing Simulator',
    release: '2022',
    mode: 'Multiplayer / Co-Op',
    description: 'Whether you\'re a competitive or casual racer, collector, tuner, livery designer, or photographer – find your line with a staggering collection of game modes including fan-favourites.'
  },
  {
    id: 'horizon',
    title: 'Horizon Forbidden West',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&auto=format&fit=crop&q=80',
    rating: '9.4',
    genre: 'Action-Adventure',
    release: '2022',
    mode: 'Single Player',
    description: 'Explore distant lands, fight bigger and more awe-inspiring machines, and encounter astonishing new tribes as you return to the far-future, post-apocalyptic world of Horizon.'
  },
  {
    id: 'ghost',
    title: 'Ghost of Tsushima',
    category: 'Action',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
    rating: '9.6',
    genre: 'Action-Adventure',
    release: '2020',
    mode: 'Single Player',
    description: 'In the late 13th century, the Mongol empire has laid waste to entire nations along their campaign to conquer the East. Tsushima Island is all that stands between mainland Japan and a massive Mongol invasion fleet.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Amit Patel',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop&crop=face&q=80',
    location: 'Mumbai',
    text: 'Outstanding service! Ordered the 3-day weekend pack. The console arrived in pristine condition, fully sanitized, and they set it up in 10 minutes. The pre-installed game library is massive! Will definitely rent again.'
  },
  {
    name: 'Ritu Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&crop=face&q=80',
    location: 'Bangalore',
    text: 'Zero security deposit is a game-changer! Usually, rental sites ask for 5k-10k deposit, but here I only did basic KYC. Clean controllers and fast delivery. Very responsive customer support on WhatsApp!'
  },
  {
    name: 'Rohan Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&crop=face&q=80',
    location: 'Delhi NCR',
    text: 'Wanted to try Spider-Man 2 before buying the console. Renting was the smartest choice. Flawless gameplay, pre-installed games. The setup process was frictionless. Worth every single rupee!'
  }
];

const FAQ_ITEMS = [
  {
    question: 'Is there any security deposit required?',
    answer: 'No! GamingStation50 requires zero security deposit. We only request basic KYC verification (Aadhaar/Passport and address proof) before delivery to ensure a safe community.'
  },
  {
    question: 'How fast is the console delivery?',
    answer: 'We offer super-fast 2-hour express delivery across active hubs (Bangalore, Mumbai, Delhi NCR, Pune, Hyderabad, and Chennai) if booked before 6 PM.'
  },
  {
    question: 'Can I request specific games to be pre-installed?',
    answer: 'Yes, absolutely! When our team calls you to confirm your booking, you can mention your preferred games. We will pre-install them from our digital library.'
  },
  {
    question: 'What documents are needed for KYC?',
    answer: 'You will need: 1. Aadhaar Card/Passport, 2. Address proof (utility bill/rent agreement matching delivery location), and 3. Professional proof (work email/ID card or student ID).'
  }
];

export default function Home() {
  const [isLongTerm, setIsLongTerm] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const carouselRef = useRef(null);
  const slideInterval = useRef(null);

  // Auto-play testimonial carousel
  useEffect(() => {
    startSlideShow();
    return () => stopSlideShow();
  }, []);

  const startSlideShow = () => {
    stopSlideShow();
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
  };

  const stopSlideShow = () => {
    if (slideInterval.current) clearInterval(slideInterval.current);
  };

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    startSlideShow();
  };

  // Filter games based on category and search
  const filteredGames = GAMES_DATA.filter(game => {
    const matchesCategory = activeTab === 'All' || game.category === activeTab;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="hero-section" id="hero">
        <div className="container hero-container-grid">
          <div className="hero-content">
            <span className="section-tag"><i className="fa-solid fa-bolt-lightning"></i> Hyperlocal 2-Hour Delivery</span>
            <h1 className="hero-title">
              Rent Next-Gen <br />
              <span>PS5 Consoles</span> <br />
              With Zero Deposit
            </h1>
            <p className="hero-desc">
              Experience the power of 4K gaming, ultra-high-speed SSD load times, and immersive haptic feedback. Fully loaded setups delivered straight to your doorstep.
            </p>
            <div className="hero-cta-group">
              <Link to="/book" className="btn btn-primary btn-lg">Book Console Now <i className="fa-solid fa-gamepad" style={{ marginLeft: '0.5rem' }}></i></Link>
              <Link to="/plans" className="btn btn-secondary btn-lg">View Details Plans</Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-glow-back"></div>
            <img 
              src="/assets/ps5_hero.png" 
              alt="Sony PlayStation 5 Console & DualSense Controller Showcase" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* 2. TRUST BADGES */}
      <section className="trust-badges-section">
        <div className="container trust-grid">
          <div className="trust-badge-item glass-card">
            <div className="trust-icon"><i className="fa-solid fa-shield-halved"></i></div>
            <div className="trust-texts">
              <h4>Zero Security Deposit</h4>
              <p>Simple KYC document checks</p>
            </div>
          </div>
          <div className="trust-badge-item glass-card">
            <div className="trust-icon"><i className="fa-solid fa-bolt-lightning"></i></div>
            <div className="trust-texts">
              <h4>2-Hour Express Delivery</h4>
              <p>Direct to your living room setup</p>
            </div>
          </div>
          <div className="trust-badge-item glass-card">
            <div className="trust-icon"><i className="fa-solid fa-hands-bubbles"></i></div>
            <div className="trust-texts">
              <h4>Sanitized Controllers</h4>
              <p>Strict hygiene protocols followed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRICING SECTION */}
      <section className="plans-section" id="pricing-plans">
        <div className="container">
          <div className="text-center">
            <span className="section-tag"><i className="fa-solid fa-tags"></i> Flexible Plans</span>
            <h2 className="section-title">Rent According to Your Timing</h2>
            <p className="section-desc">Choose from short-term passes for weekend parties or long-term subscriptions for deep campaign play.</p>
          </div>

          {/* Toggle Switch */}
          <div className="toggle-container">
            <span className={`toggle-label ${!isLongTerm ? 'active' : ''}`} onClick={() => setIsLongTerm(false)}>Short Term</span>
            <div 
              className={`toggle-switch ${isLongTerm ? 'active' : ''}`} 
              onClick={() => setIsLongTerm(!isLongTerm)}
              role="button" 
              aria-label="Toggle rental plan durations" 
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setIsLongTerm(!isLongTerm); }}
            >
              <span className="toggle-slider"></span>
            </div>
            <span className={`toggle-label ${isLongTerm ? 'active' : ''}`} onClick={() => setIsLongTerm(true)}>Long Term</span>
          </div>

          {/* Pricing Grid */}
          <div className="plans-grid">
            {!isLongTerm ? (
              <>
                {/* Short-Term Card 1 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">1 Day Plan</h3>
                    <p className="plan-duration">24 Hours of pure gaming</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">699</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 1x DualSense Controller</li>
                    <li><i className="fas fa-check-circle"></i> Top Games Pre-installed</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Subscription</li>
                    <li><i className="fas fa-check-circle"></i> Free Home Delivery & Setup</li>
                    <li className="disabled"><i className="fas fa-times-circle"></i> Extra Controller</li>
                  </ul>
                  <Link to="/book?plan=oneday" className="btn btn-secondary">Select Plan</Link>
                </div>

                {/* Short-Term Card 2 */}
                <div className="plan-card glass-card recommended">
                  <span className="plan-badge">Best Seller</span>
                  <div className="plan-header">
                    <h3 className="plan-name">2 Days Plan</h3>
                    <p className="plan-duration">48 Hours gaming session</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">1,399</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 1x DualSense Controller</li>
                    <li><i className="fas fa-check-circle"></i> Top Games Pre-installed</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Subscription</li>
                    <li><i className="fas fa-check-circle"></i> Free Home Delivery & Setup</li>
                    <li className="disabled"><i className="fas fa-times-circle"></i> Extra Controller</li>
                  </ul>
                  <Link to="/book?plan=twodays" className="btn btn-primary">Select Plan</Link>
                </div>

                {/* Short-Term Card 3 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">3 Days Plan</h3>
                    <p className="plan-duration">Perfect for long weekends</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">1,999</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 1x DualSense Controller</li>
                    <li><i className="fas fa-check-circle"></i> Top Games Pre-installed</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Subscription</li>
                    <li><i className="fas fa-check-circle"></i> Free Home Delivery & Setup</li>
                    <li><i className="fas fa-check-circle"></i> 24/7 Support Assistance</li>
                  </ul>
                  <Link to="/book?plan=threedays" className="btn btn-secondary">Select Plan</Link>
                </div>

                {/* Short-Term Card 4 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">1 Week Plan</h3>
                    <p className="plan-duration">7 Full Days of ultimate gaming</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">3,499</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 1x DualSense Controller</li>
                    <li><i className="fas fa-check-circle"></i> Top Games Pre-installed</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Subscription</li>
                    <li><i className="fas fa-check-circle"></i> Free Home Delivery & Setup</li>
                    <li><i className="fas fa-check-circle"></i> Zero Security Deposit*</li>
                  </ul>
                  <Link to="/book?plan=sevendays" className="btn btn-secondary">Select Plan</Link>
                </div>
              </>
            ) : (
              <>
                {/* Long-Term Card 1 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">15 Days Pass</h3>
                    <p className="plan-duration">Half-month gaming pass</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">4,999</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 1x DualSense Controller</li>
                    <li><i className="fas fa-check-circle"></i> 2 free physical game swaps</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Access</li>
                    <li><i className="fas fa-check-circle"></i> Free Home Delivery & setup</li>
                    <li className="disabled"><i className="fas fa-times-circle"></i> Free controllers repair</li>
                  </ul>
                  <Link to="/book?plan=fifteendays" className="btn btn-secondary">Select Plan</Link>
                </div>

                {/* Long-Term Card 2 */}
                <div className="plan-card glass-card recommended">
                  <span className="plan-badge">Best Value</span>
                  <div className="plan-header">
                    <h3 className="plan-name">1 Month Sub</h3>
                    <p className="plan-duration">30 Days deep gaming pass</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">7,999</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 2x DualSense Controllers</li>
                    <li><i className="fas fa-check-circle"></i> 4 free physical game swaps</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Access</li>
                    <li><i className="fas fa-check-circle"></i> VIP immediate priority dispatch</li>
                    <li><i className="fas fa-check-circle"></i> Free door repair support</li>
                  </ul>
                  <Link to="/book?plan=onemonth" className="btn btn-primary">Select Plan</Link>
                </div>

                {/* Long-Term Card 3 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">2 Months Ultimate</h3>
                    <p className="plan-duration">60 Days ultimate pass</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">13,999</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 2x DualSense Controllers</li>
                    <li><i className="fas fa-check-circle"></i> Unlimited physical game swaps</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Access</li>
                    <li><i className="fas fa-check-circle"></i> VIP immediate priority dispatch</li>
                    <li><i className="fas fa-check-circle"></i> Free door repair support</li>
                  </ul>
                  <Link to="/book?plan=twomonths" className="btn btn-secondary">Select Plan</Link>
                </div>

                {/* Long-Term Card 4 */}
                <div className="plan-card glass-card">
                  <div className="plan-header">
                    <h3 className="plan-name">3 Months VIP</h3>
                    <p className="plan-duration">90 Days hardcode gamer pass</p>
                  </div>
                  <div className="plan-price-box">
                    <span className="plan-currency">₹</span>
                    <span className="plan-price">19,999</span>
                    <span className="plan-period"> total</span>
                  </div>
                  <ul className="plan-features">
                    <li><i className="fas fa-check-circle"></i> 2x DualSense Controllers</li>
                    <li><i className="fas fa-check-circle"></i> Unlimited physical game swaps</li>
                    <li><i className="fas fa-check-circle"></i> PS Plus Deluxe Access</li>
                    <li><i className="fas fa-check-circle"></i> VIP immediate priority dispatch</li>
                    <li><i className="fas fa-check-circle"></i> Free door repair support</li>
                  </ul>
                  <Link to="/book?plan=threemonths" className="btn btn-secondary">Select Plan</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 4. DETAILS FEATURES */}
      <section className="detail-section" id="spec-benefits">
        <div className="container detail-grid">
          <div className="detail-image-box">
            <div className="detail-glow-circle"></div>
            <img 
              src="/assets/ps5_hero.png" 
              alt="PS5 Console Package Details" 
              className="console-detail-image" 
            />
          </div>
          <div className="detail-content-box">
            <span className="section-tag"><i className="fa-solid fa-toolbox"></i> Complete Setup</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>What is Included In The Package?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              We deliver a ready-to-run, fully configured console setup. Zero setup worries—our delivery rider sets up everything inside your home.
            </p>

            <div className="specs-list-grid">
              <div className="spec-card">
                <i className="fa-solid fa-gamepad spec-icon"></i>
                <div>
                  <h4>PS5 Slim Console</h4>
                  <p>HDR 4K Gaming System with 1TB SSD Space</p>
                </div>
              </div>
              <div className="spec-card">
                <i className="fa-solid fa-circle-nodes spec-icon"></i>
                <div>
                  <h4>DualSense Wireless Controller</h4>
                  <p>Haptic feedback & adaptive triggers (Sanitized)</p>
                </div>
              </div>
              <div className="spec-card">
                <i className="fa-solid fa-globe spec-icon"></i>
                <div>
                  <h4>PS Plus Deluxe Sub</h4>
                  <p>Immediate digital access to 400+ games library</p>
                </div>
              </div>
              <div className="spec-card">
                <i className="fa-solid fa-cable-casual spec-icon" style={{ fontStyle: 'normal' }}>🔌</i>
                <div>
                  <h4>High Speed Cable Kit</h4>
                  <p>HDMI 2.1 cable, power cord, USB-C controller cord</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FILTERABLE GAMES LIBRARY */}
      <section className="games-section" id="games-library">
        <div className="container">
          <div className="text-center">
            <span className="section-tag"><i className="fa-solid fa-gamepad"></i> Game Library</span>
            <h2 className="section-title">Fully Preloaded Blockbusters</h2>
            <p className="section-desc">Over 400+ games ready to boot up immediately. Search and check out top games pre-installed in your console bundle.</p>
          </div>

          {/* Search and Category Filters */}
          <div className="games-filters-container">
            <div className="game-search-box">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                placeholder="Search game title..." 
                className="game-search-input" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="games-tabs">
              {['All', 'Action', 'Adventure', 'Sports'].map(category => (
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
            {filteredGames.length > 0 ? (
              filteredGames.map(game => (
                <div 
                  key={game.id}
                  className="game-card glass-card"
                  onClick={() => setSelectedGame(game)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="game-image-wrapper">
                    <img src={game.image} alt={game.title} className="game-image" />
                    <span className="game-rating-tag"><i className="fa-solid fa-star"></i> {game.rating}</span>
                  </div>
                  <div className="game-info">
                    <span className="game-genre-label">{game.category}</span>
                    <h3 className="game-title">{game.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click to view details</p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
                No games found matching "{searchQuery}"
              </div>
            )}
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
                  <span className="stat-pill"><i className="fa-solid fa-star"></i> {selectedGame.rating} / 10</span>
                  <span className="stat-pill"><i className="fa-solid fa-calendar"></i> {selectedGame.release}</span>
                  <span className="stat-pill"><i className="fa-solid fa-user-group"></i> {selectedGame.mode}</span>
                </div>
                <p className="game-modal-desc">{selectedGame.description}</p>
                <div style={{ marginTop: '2rem' }}>
                  <Link to="/book" className="btn btn-primary">Book PS5 with this game</Link>
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
            <span className="section-tag"><i className="fa-solid fa-rocket"></i> Easy 3 Step Flow</span>
            <h2 className="section-title">How To Rent A Console?</h2>
            <p className="section-desc">Get gaming in less than 2 hours. Our workflow is fully streamlined and digital.</p>
          </div>

          <div className="why-grid" style={{ marginTop: '4rem' }}>
            <div className="why-card glass-card">
              <div className="why-icon"><i className="fa-solid fa-square-check"></i></div>
              <h3>1. Select Plan & Verify</h3>
              <p>Choose your duration and submit basic KYC details (ID Card and Address Proof) securely in 15 minutes.</p>
            </div>
            <div className="why-card glass-card">
              <div className="why-icon"><i className="fa-solid fa-truck-ramp-box"></i></div>
              <h3>2. Doorstep Setup</h3>
              <p>Our rider will arrive within 2 hours with a sanitized console package and hook it up to your television.</p>
            </div>
            <div className="why-card glass-card">
              <div className="why-icon"><i className="fa-solid fa-gamepad"></i></div>
              <h3>3. Play & Return</h3>
              <p>Enjoy premium gaming! When your plan completes, we will pick up the console directly. Free returns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GALLERY SHOWCASE */}
      <section className="gallery-section" id="showcase-gallery">
        <div className="container">
          <div className="text-center">
            <span className="section-tag"><i className="fa-solid fa-images"></i> Gamer Hub</span>
            <h2 className="section-title">Our Rented Setups In Real-Life</h2>
            <p className="section-desc">See real gaming stations set up by our delivery executives in active locations.</p>
          </div>

          <div className="gallery-grid" style={{ marginTop: '3rem' }}>
            <div className="gallery-item glass-card">
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80" alt="Cozy gaming setup setup with console" className="game-image" />
            </div>
            <div className="gallery-item glass-card">
              <img src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&auto=format&fit=crop&q=80" alt="Beautiful TV setup with console playing game" className="game-image" />
            </div>
            <div className="gallery-item glass-card">
              <img src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80" alt="RGB game controller and screen setup" className="game-image" />
            </div>
            <div className="gallery-item glass-card">
              <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80" alt="Console hooked up to a projector setup" className="game-image" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIAL CAROUSEL */}
      <section className="testimonials-section" id="reviews">
        <div className="container">
          <div className="text-center">
            <span className="section-tag"><i className="fa-solid fa-comment-dots"></i> Client Reviews</span>
            <h2 className="section-title">What Our Gamer Community Says</h2>
            <p className="section-desc">Read honest testimonials from verified renters across major cities in India.</p>
          </div>

          <div 
            className="carousel-container" 
            style={{ marginTop: '3.5rem' }}
            onMouseEnter={stopSlideShow}
            onMouseLeave={startSlideShow}
          >
            <div className="carousel-wrapper" ref={carouselRef}>
              {TESTIMONIALS.map((testimonial, idx) => (
                <div 
                  key={idx}
                  className={`testimonial-slide glass-card ${currentSlide === idx ? 'active' : ''}`}
                  style={{ 
                    display: currentSlide === idx ? 'block' : 'none',
                    animation: 'fadeIn 0.5s ease-in-out'
                  }}
                >
                  <p className="client-quote">"{testimonial.text}"</p>
                  <div className="client-meta">
                    <img src={testimonial.avatar} alt={`${testimonial.name} Avatar`} className="client-avatar" />
                    <div>
                      <h4 className="client-name">{testimonial.name}</h4>
                      <span className="client-location">{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dot Indicators */}
            <div className="carousel-dots">
              {TESTIMONIALS.map((_, idx) => (
                <span 
                  key={idx}
                  className={`dot-indicator ${currentSlide === idx ? 'active' : ''}`}
                  onClick={() => handleSlideChange(idx)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section className="faq-section" id="faq-desk">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="text-center">
            <span className="section-tag"><i className="fa-solid fa-question"></i> Help Desk</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc">Got questions about deposits, setup, or returns? We have answers.</p>
          </div>

          <div className="faq-accordion" style={{ marginTop: '3.5rem' }}>
            {FAQ_ITEMS.map((faq, idx) => (
              <div 
                key={idx} 
                className={`accordion-item glass-card ${expandedFaq === idx ? 'active' : ''}`}
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <div className="accordion-header">
                  <h3>{faq.question}</h3>
                  <span className="accordion-icon"><i className={`fa-solid fa-${expandedFaq === idx ? 'minus' : 'plus'}`}></i></span>
                </div>
                <div 
                  className="accordion-body"
                  style={{ 
                    display: expandedFaq === idx ? 'block' : 'none',
                    paddingTop: '1rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
