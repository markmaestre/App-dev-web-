import React, { useState, useEffect } from 'react';
import { Shield, Users, Lock, Mail, Phone, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className={`navbar ${scrollY > 50 ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <Shield className="brand-icon" />
              <span className="brand-text">MERNAuth</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="nav-menu">
              <a href="#" className="nav-link">Home</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#services" className="nav-link">Services</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="mobile-menu-btn">
              {isMenuOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-content">
                <a href="#" className="mobile-nav-link">Home</a>
                <a href="#about" className="mobile-nav-link">About</a>
                <a href="#services" className="mobile-nav-link">Services</a>
                <a href="#contact" className="mobile-nav-link">Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        {/* Animated Background Elements */}
        <div className="hero-bg">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
        </div>

        <div className="hero-content">
          <div className="hero-icon-container">
            <div className="hero-icon">
              <Shield className="hero-shield" />
            </div>
          </div>
          
          <h1 className="hero-title">
            Welcome to
            <br />
            <span className="hero-title-accent">MERN Auth</span>
          </h1>
          
          <p className="hero-subtitle">
            Your secure and reliable authentication platform built with cutting-edge technology
          </p>
          
          <div className="hero-buttons">
            <button 
              onClick={() => window.location.href = '/login'}
              className="btn btn-primary"
            >
              <span className="btn-content">
                Get Started
                <ArrowRight className="btn-arrow" />
              </span>
              <div className="btn-overlay"></div>
            </button>
            
            <button className="btn btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="section section-about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About Us</h2>
            <div className="section-divider"></div>
          </div>
          
          <div className="about-grid">
            <div className="about-text">
              <p className="about-paragraph">
                We provide simple and secure login and registration systems built with the MERN stack. 
                Our platform combines modern design with robust security features to deliver an exceptional user experience.
              </p>
              <p className="about-paragraph">
                Trusted by thousands of developers worldwide, our authentication system ensures your applications 
                are protected with industry-standard security protocols.
              </p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card stat-card-purple">
                <Users className="stat-icon" />
                <h3 className="stat-number">10K+</h3>
                <p className="stat-label">Active Users</p>
              </div>
              <div className="stat-card stat-card-blue">
                <Shield className="stat-icon" />
                <h3 className="stat-number">99.9%</h3>
                <p className="stat-label">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              Comprehensive authentication solutions tailored to your needs
            </p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon service-icon-purple">
                <Lock className="service-icon-svg" />
              </div>
              <h3 className="service-title">User Authentication</h3>
              <p className="service-description">
                Secure login and registration with advanced session management and multi-factor authentication support.
              </p>
              <div className="service-link">
                <span className="service-link-text">Learn more</span>
                <ArrowRight className="service-link-arrow" />
              </div>
            </div>

            <div className="service-card">
              <div className="service-icon service-icon-blue">
                <Users className="service-icon-svg" />
              </div>
              <h3 className="service-title">Role-Based Access</h3>
              <p className="service-description">
                Flexible admin access control with customizable user roles and permissions management.
              </p>
              <div className="service-link">
                <span className="service-link-text">Learn more</span>
                <ArrowRight className="service-link-arrow" />
              </div>
            </div>

            <div className="service-card">
              <div className="service-icon service-icon-indigo">
                <Shield className="service-icon-svg" />
              </div>
              <h3 className="service-title">Data Security</h3>
              <p className="service-description">
                Enterprise-grade encryption and secure data handling with compliance to industry standards.
              </p>
              <div className="service-link">
                <span className="service-link-text">Learn more</span>
                <ArrowRight className="service-link-arrow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section section-contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get In Touch</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              Ready to secure your application? Contact our team today
            </p>
          </div>
          
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon contact-icon-purple">
                  <Mail className="contact-icon-svg" />
                </div>
                <div className="contact-details">
                  <h3 className="contact-title">Email</h3>
                  <p className="contact-value contact-email">support@mernauth.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon contact-icon-blue">
                  <Phone className="contact-icon-svg" />
                </div>
                <div className="contact-details">
                  <h3 className="contact-title">Phone</h3>
                  <p className="contact-value contact-phone">+63 912 345 6789</p>
                </div>
              </div>
            </div>
            
            <div className="features-card">
              <h3 className="features-title">Why Choose Us?</h3>
              <div className="features-list">
                <div className="feature-item">
                  <CheckCircle className="feature-icon" />
                  <span className="feature-text">Industry-leading security standards</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-icon" />
                  <span className="feature-text">24/7 technical support</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-icon" />
                  <span className="feature-text">Easy integration with existing systems</span>
                </div>
                <div className="feature-item">
                  <CheckCircle className="feature-icon" />
                  <span className="feature-text">Scalable architecture for growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Shield className="footer-icon" />
              <span className="footer-text">MERNAuth</span>
            </div>
            <p className="footer-copyright">
              © 2025 MERNAuth. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Global Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
          color: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Navigation Styles */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .navbar-scrolled {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-icon {
          width: 32px;
          height: 32px;
          color: #a855f7;
        }

        .brand-text {
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .nav-menu {
          display: none;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .nav-menu {
            display: flex;
          }
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #a855f7;
        }

        .mobile-menu-btn {
          display: block;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        .menu-icon {
          width: 24px;
          height: 24px;
        }

        .mobile-menu {
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          margin-top: 8px;
          padding: 16px;
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-nav-link {
          color: white;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .mobile-nav-link:hover {
          color: #a855f7;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 80px 20px 128px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: pulse 4s ease-in-out infinite;
        }

        .bg-orb-1 {
          top: 25%;
          left: 25%;
          width: 288px;
          height: 288px;
          background: rgba(168, 85, 247, 0.2);
        }

        .bg-orb-2 {
          bottom: 25%;
          right: 25%;
          width: 384px;
          height: 384px;
          background: rgba(59, 130, 246, 0.2);
          animation-delay: 1s;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 0 20px;
          animation: fadeInUp 1s ease-out;
        }

        .hero-icon-container {
          margin-bottom: 32px;
        }

        .hero-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
          border-radius: 50%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          margin-bottom: 24px;
        }

        .hero-shield {
          width: 40px;
          height: 40px;
          color: white;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 24px;
          line-height: 1.1;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 72px;
          }
        }

        .hero-title-accent {
          background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 20px;
          color: #cbd5e1;
          margin-bottom: 48px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        @media (min-width: 768px) {
          .hero-subtitle {
            font-size: 24px;
          }
        }

        .hero-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
          justify-content: center;
          align-items: center;
        }

        @media (min-width: 640px) {
          .hero-buttons {
            flex-direction: row;
          }
        }

        .btn {
          position: relative;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 160px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 25px 50px -12px rgba(168, 85, 247, 0.25);
        }

        .btn-secondary {
          background: transparent;
          color: #a855f7;
          border: 2px solid #a855f7;
        }

        .btn-secondary:hover {
          background: #a855f7;
          color: white;
          transform: scale(1.05);
        }

        .btn-content {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-arrow {
          width: 20px;
          height: 20px;
          margin-left: 8px;
          transition: transform 0.3s ease;
        }

        .btn-primary:hover .btn-arrow {
          transform: translateX(4px);
        }

        .btn-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #6d28d9 0%, #1d4ed8 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .btn-primary:hover .btn-overlay {
          transform: scaleX(1);
        }

        /* Section Styles */
        .section {
          padding: 80px 0;
        }

        .section-about {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(12px);
        }

        .section-contact {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(12px);
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .section-title {
            font-size: 56px;
          }
        }

        .section-divider {
          width: 96px;
          height: 4px;
          background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
          margin: 0 auto 32px;
        }

        .section-subtitle {
          font-size: 20px;
          color: #cbd5e1;
          max-width: 600px;
          margin: 0 auto;
        }

        /* About Section */
        .about-grid {
          display: grid;
          gap: 48px;
          align-items: center;
        }

        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .about-text {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .about-paragraph {
          font-size: 18px;
          color: #cbd5e1;
          line-height: 1.7;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .stat-card {
          padding: 24px;
          border-radius: 16px;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(168, 85, 247, 0.2);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: rgba(168, 85, 247, 0.4);
        }

        .stat-card-purple {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
        }

        .stat-card-blue {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%);
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          margin-bottom: 16px;
        }

        .stat-card-purple .stat-icon {
          color: #a855f7;
        }

        .stat-card-blue .stat-icon {
          color: #3b82f6;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
        }

        .stat-label {
          color: #94a3b8;
        }

        /* Services Section */
        .services-grid {
          display: grid;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .service-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(51, 65, 85, 0.5) 100%);
          padding: 32px;
          border-radius: 16px;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 116, 139, 0.2);
          transition: all 0.5s ease;
        }

        .service-card:hover {
          border-color: rgba(168, 85, 247, 0.4);
          transform: scale(1.05);
        }

        .service-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 16px;
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }

        .service-icon-purple {
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
        }

        .service-icon-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .service-icon-indigo {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        }

        .service-card:hover .service-icon {
          box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.25);
        }

        .service-icon-svg {
          width: 32px;
          height: 32px;
          color: white;
        }

        .service-title {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
        }

        .service-description {
          color: #cbd5e1;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .service-link {
          display: flex;
          align-items: center;
          color: #a855f7;
          transition: color 0.3s ease;
        }

        .service-card:hover .service-link {
          color: #c084fc;
        }

        .service-link-text {
          font-weight: 500;
        }

        .service-link-arrow {
          width: 16px;
          height: 16px;
          margin-left: 8px;
          transition: transform 0.3s ease;
        }

        .service-card:hover .service-link-arrow {
          transform: translateX(4px);
        }

        /* Contact Section */
        .contact-grid {
          display: grid;
          gap: 48px;
          align-items: center;
        }

        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: linear-gradient(135deg, rgba(51, 65, 85, 0.5) 0%, rgba(100, 116, 139, 0.5) 100%);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 116, 139, 0.2);
          transition: all 0.3s ease;
        }

        .contact-item:hover {
          border-color: rgba(168, 85, 247, 0.4);
        }

        .contact-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-icon-purple {
          background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
        }

        .contact-icon-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
        }

        .contact-icon-svg {
          width: 24px;
          height: 24px;
          color: white;
        }

        .contact-title {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
        }

        .contact-value {
          font-size: 16px;
        }

        .contact-email {
          color: #a855f7;
        }

        .contact-phone {
          color: #3b82f6;
        }

        .features-card {
          background: linear-gradient(135deg, rgba(51, 65, 85, 0.3) 0%, rgba(100, 116, 139, 0.3) 100%);
          padding: 32px;
          border-radius: 16px;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 116, 139, 0.2);
        }

        .features-title {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feature-icon {
          width: 20px;
          height: 20px;
          color: #10b981;
        }

        .feature-text {
          color: #cbd5e1;
        }

        /* Footer */
        .footer {
          padding: 32px 0;
          border-top: 1px solid rgba(51, 65, 85, 0.5);
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-icon {
          width: 24px;
          height: 24px;
          color: #a855f7;
        }

        .footer-text {
          color: white;
          font-weight: 600;
        }

        .footer-copyright {
          color: #94a3b8;
          font-size: 14px;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-content {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Home;