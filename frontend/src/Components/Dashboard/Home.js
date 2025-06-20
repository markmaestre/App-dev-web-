import React, { useState, useEffect } from 'react';

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const navigate = (path) => {
    console.log('Navigating to:', path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'services', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide for hero features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const features = [
    { icon: '🌾', title: 'Crop Guide Hub', desc: 'Comprehensive planting guides and harvest calendars' },
    { icon: '🛒', title: 'Market Linkage', desc: 'Direct connections with buyers and cooperatives' },
    { icon: '📱', title: 'Digital Farm Diary', desc: 'Track inputs, costs, and yields over time' },
    { icon: '⛈️', title: 'Weather & Pest Alerts', desc: 'Real-time, location-based notifications' },
    { icon: '🎥', title: 'Video Tutorials', desc: 'Local language how-to videos' },
    { icon: '🎓', title: 'eLearning Portal', desc: 'Courses on agribusiness and financial literacy' },
    { icon: '🤝', title: 'Community Exchange', desc: 'Share tips and success stories' },
    { icon: '📞', title: 'AgriSupport Line', desc: 'Chat with agricultural technicians' },
    { icon: '📊', title: 'Barangay Dashboard', desc: 'Track food security indicators' },
    { icon: '📱', title: 'Offline Access', desc: 'Downloadable guides for offline use' },
    { icon: '🔬', title: 'AI Disease Detection', desc: 'ML-powered crop disease identification' },
    { icon: '🗺️', title: 'Farm Mapping', desc: 'Geotagged digital farm management' }
  ];

  const testimonials = [
    { name: 'Maria Santos', location: 'Nueva Ecija', text: 'SmartFarm helped me increase my rice yield by 30%!', rating: 5 },
    { name: 'Juan Dela Cruz', location: 'Laguna', text: 'The weather alerts saved my crops from the last typhoon.', rating: 5 },
    { name: 'Rosa Mendoza', location: 'Iloilo', text: 'Market linkage feature connected me with better buyers.', rating: 5 }
  ];

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #f8fffe 0%, #e8f5e8 100%);
          overflow-x: hidden;
          scroll-behavior: smooth;
        }
        
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 3rem;
          background: ${isScrolled ? 'rgba(46, 125, 50, 0.95)' : 'rgba(46, 125, 50, 0.1)'};
          backdrop-filter: blur(20px);
          border-bottom: ${isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none'};
          color: white;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #66bb6a, #a5d6a7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          cursor: pointer;
        }
        
        .logo::before {
          content: '🌱';
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        
        .nav-links a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          position: relative;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .nav-links a.active {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        .nav-links a:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: ${activeSection === 'home' && 'var(--link-text)' === 'Home' ? '80%' : '0'};
          height: 2px;
          background: #66bb6a;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .login-btn {
          background: linear-gradient(135deg, #66bb6a, #4caf50);
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 25px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(102, 187, 106, 0.3);
        }
        
        .login-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(102, 187, 106, 0.4);
        }
        
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem 4rem;
          background: 
            linear-gradient(135deg, rgba(46, 125, 50, 0.8), rgba(76, 175, 80, 0.6)),
            url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?fit=crop&w=1400&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          animation: fadeInUp 1s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero h2 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, #ffffff, #e8f5e8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero p {
          font-size: 1.3rem;
          line-height: 1.6;
          margin-bottom: 3rem;
          text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
          opacity: 0.95;
        }
        
        .cta-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          margin-bottom: 4rem;
        }
        
        .cta-button {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          background: linear-gradient(135deg, #66bb6a, #4caf50);
          color: white;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 30px rgba(102, 187, 106, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s;
        }
        
        .cta-button:hover::before {
          left: 100%;
        }
        
        .cta-button:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 40px rgba(102, 187, 106, 0.5);
        }
        
        .secondary-cta {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 500;
          border: 2px solid rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .secondary-cta:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .features-slider {
          position: relative;
          width: 100%;
          max-width: 600px;
          height: 120px;
          overflow: hidden;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
        
        .slide {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(${currentSlide * -100}%);
        }
        
        .slide-icon {
          font-size: 3rem;
          animation: bounce 2s ease-in-out infinite;
        }
        
        .slide-text {
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .section {
          padding: 6rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-title {
          font-size: 3rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #2e7d32, #66bb6a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .section-subtitle {
          font-size: 1.2rem;
          text-align: center;
          color: #666;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 4rem;
        }
        
        .about-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #555;
        }
        
        .about-text h3 {
          color: #2e7d32;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        
        .about-image {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        
        .about-image:hover {
          transform: translateY(-10px);
        }
        
        .about-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }
        
        .stat-card {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          color: #2e7d32;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 1.1rem;
          color: #666;
          font-weight: 500;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #66bb6a, #4caf50);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        .feature-card:hover::before {
          transform: scaleX(1);
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }
        
        .feature-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2e7d32;
          margin-bottom: 1rem;
        }
        
        .feature-desc {
          color: #666;
          line-height: 1.6;
        }
        
        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        
        .contact-form {
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .form-group {
          margin-bottom: 2rem;
        }
        
        .form-group label {
          display: block;
          font-weight: 600;
          color: #2e7d32;
          margin-bottom: 0.5rem;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #66bb6a;
        }
        
        .form-group textarea {
          height: 120px;
          resize: vertical;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #66bb6a, #4caf50);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(102, 187, 106, 0.3);
        }
        
        .contact-info {
          padding: 2rem;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        
        .contact-item:hover {
          transform: translateX(10px);
        }
        
        .contact-icon {
          font-size: 2rem;
          color: #66bb6a;
        }
        
        .contact-details h4 {
          color: #2e7d32;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .contact-details p {
          color: #666;
          margin: 0;
        }
        
        .testimonials {
          background: linear-gradient(135deg, #f8fffe, #e8f5e8);
          padding: 4rem 2rem;
          margin: 4rem 0;
          border-radius: 30px;
        }
        
        .testimonial-slider {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          padding: 1rem 0;
          scroll-behavior: smooth;
        }
        
        .testimonial-card {
          min-width: 350px;
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          text-align: center;
        }
        
        .testimonial-text {
          font-style: italic;
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        
        .testimonial-author {
          font-weight: 700;
          color: #2e7d32;
        }
        
        .testimonial-location {
          color: #888;
          font-size: 0.9rem;
        }
        
        .stars {
          color: #ffc107;
          margin: 1rem 0;
        }
        
        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          animation: bounce 2s infinite;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }
          
          .nav-links {
            display: ${isMenuOpen ? 'flex' : 'none'};
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(46, 125, 50, 0.95);
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
          }
          
          .navbar {
            padding: 1rem 1.5rem;
          }
          
          .hero {
            padding: 5rem 1rem 4rem;
          }
          
          .about-content,
          .contact-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .section {
            padding: 4rem 1rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .testimonial-card {
            min-width: 280px;
          }
          
          .cta-container {
            flex-direction: column;
          }
        }
      `}</style>

      <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo" onClick={() => scrollToSection('home')}>
          SmartFarm
        </div>
        <div className="nav-links">
          <a 
            className={activeSection === 'home' ? 'active' : ''} 
            onClick={() => scrollToSection('home')}
          >
            Home
          </a>
          <a 
            className={activeSection === 'about' ? 'active' : ''} 
            onClick={() => scrollToSection('about')}
          >
            About
          </a>
          <a 
            className={activeSection === 'services' ? 'active' : ''} 
            onClick={() => scrollToSection('services')}
          >
            Services
          </a>
          <a 
            className={activeSection === 'contact' ? 'active' : ''} 
            onClick={() => scrollToSection('contact')}
          >
            Contact
          </a>
        

          <button 
          onClick={() => window.location.href = '/login'}
          className="login-btn"
          >
          Login
          </button>

        </div>
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      <div className="hero" id="home">
        <div className="hero-content">
          <h2>Empowering Farmers with Smart Technology</h2>
          <p>
            Transform your farming journey with intelligent crop guides, real-time market insights, 
            advanced pest alerts, and precision weather forecasting. Maximize your yield, optimize your income, 
            and cultivate success with data-driven farming solutions.
          </p>
          
          <div className="cta-container">
         <button 
           onClick={() => window.location.href = '/login'}
           className="cta-button"
            >
            Start Growing Smart
            </button>

            <button className="secondary-cta" onClick={() => navigate('/demo')}>
              Watch Demo
            </button>
          </div>

          
        </div>

        <div className="scroll-indicator" onClick={() => scrollToSection('about')}>
          Discover More ↓
        </div>
      </div>

      <section className="section" id="about">
        <h2 className="section-title">About SmartFarm</h2>
        <p className="section-subtitle">
          Bridging the gap between traditional farming and modern technology to create sustainable agricultural solutions.
        </p>
        
        <div className="about-content">
          <div className="about-text">
            <h3>Our Mission</h3>
            <p>
              SmartFarm is dedicated to empowering small-scale farmers across the Philippines with cutting-edge 
              digital tools and agricultural knowledge. We believe that every farmer deserves access to modern 
              technology that can help them increase productivity, reduce crop losses, and improve their livelihoods.
            </p>
            <br />
            <h3>What We Do</h3>
            <p>
              Our comprehensive platform combines traditional farming wisdom with artificial intelligence, 
              weather forecasting, market linkage, and community support to create a holistic farming experience. 
              From seed to sale, we're with you every step of the way.
            </p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?fit=crop&w=600&q=80" alt="Modern farming" />
          </div>
        </div>

     

        <div className="testimonials">
          <h3 style={{textAlign: 'center', color: '#2e7d32', fontSize: '2rem', marginBottom: '2rem'}}>What Farmers Say</h3>
          <div className="testimonial-slider">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-text">"{testimonial.text}"</div>
                <div className="stars">{'⭐'.repeat(testimonial.rating)}</div>
                <div className="testimonial-author">{testimonial.name}</div>
                <div className="testimonial-location">{testimonial.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Comprehensive digital farming solutions designed to maximize your agricultural success.
        </p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="feature-icon" style={{
                transform: hoveredFeature === index ? 'scale(1.2) rotate(10deg)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}>
                {feature.icon}
              </div>
              <div className="feature-title">{feature.title}</div>
              <div className="feature-desc">{feature.desc}</div>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '4rem',
          padding: '3rem',
          background: 'linear-gradient(135deg, #e8f5e8, #f1f8e9)',
          borderRadius: '20px'
        }}>
          <h3 style={{color: '#2e7d32', fontSize: '1.8rem', marginBottom: '1rem'}}>
            Ready to Transform Your Farm?
          </h3>
          <p style={{color: '#666', fontSize: '1.1rem', marginBottom: '2rem'}}>
            Join thousands of farmers who are already using SmartFarm to increase their yields and profits.
          </p>
          <button className="cta-button" onClick={() => navigate('/signup')}>
            Get Started Today 🌱
          </button>
        </div>
      </section>

      <section className="section" id="contact">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">
          Have questions? We're here to help you grow your farming success.
        </p>
        
        <div className="contact-content">
          <div className="contact-form">
            <h3 style={{color: '#2e7d32', marginBottom: '2rem', fontSize: '1.5rem'}}>Send us a Message</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" />
              </div>
              <div className="form-group">
                <label htmlFor="location">Farm Location</label>
                <input type="text" id="location" name="location" placeholder="Province, Municipality" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Tell us about your farming needs..." required></textarea>
              </div>
              <button type="submit" className="submit-btn">
                Send Message 📤
              </button>
            </form>
          </div>
          
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div className="contact-details">
                <h4>Head Office</h4>
                <p>123 Agriculture Drive<br />Quezon City, Metro Manila<br />Philippines 1100</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h4>Phone Support</h4>
                <p>+63 2 8123 4567<br />Mon-Fri: 8AM-6PM<br />Sat: 8AM-12PM</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div className="contact-details">
                <h4>Email Support</h4>
                <p>support@smartfarm.ph<br />info@smartfarm.ph<br />24/7 Response</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">💬</div>
              <div className="contact-details">
                <h4>Live Chat</h4>
                <p>Available 24/7<br />Instant farmer support<br />Technical assistance</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">🌐</div>
              <div className="contact-details">
                <h4>Regional Offices</h4>
                <p>Luzon • Visayas • Mindanao<br />Local agricultural support<br />Field demonstrations</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          marginTop: '4rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{color: '#2e7d32', marginBottom: '1rem'}}>Emergency Agricultural Hotline</h4>
          <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#d32f2f', marginBottom: '0.5rem'}}>
            📞 1-800-FARM-HELP
          </p>
          <p style={{color: '#666', fontSize: '0.9rem'}}>
            Available 24/7 for urgent crop diseases, pest outbreaks, and weather emergencies
          </p>
        </div>
      </section>

      <footer style={{
        background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
        color: 'white',
        padding: '3rem 2rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div className="logo" style={{fontSize: '2rem', marginBottom: '1rem', color: 'white'}}>
            SmartFarm
          </div>
          <p style={{fontSize: '1.1rem', marginBottom: '2rem', opacity: '0.9'}}>
            Empowering Filipino farmers with smart technology for sustainable agriculture
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <a href="#privacy" style={{color: 'white', textDecoration: 'none', opacity: '0.8'}}>Privacy Policy</a>
            <a href="#terms" style={{color: 'white', textDecoration: 'none', opacity: '0.8'}}>Terms of Service</a>
            <a href="#support" style={{color: 'white', textDecoration: 'none', opacity: '0.8'}}>Support</a>
            <a href="#careers" style={{color: 'white', textDecoration: 'none', opacity: '0.8'}}>Careers</a>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '2rem',
            fontSize: '0.9rem',
            opacity: '0.7'
          }}>
            <p>&copy; 2025 SmartFarm Philippines. All rights reserved.</p>
            <p>Building the future of Philippine agriculture, one farm at a time. 🌾</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;