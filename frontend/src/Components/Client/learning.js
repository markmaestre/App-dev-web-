import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Users, Award, Clock, Star, Play, Video, FileText, Filter } from 'lucide-react';

function SmartFarmAcademy() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contentType, setContentType] = useState('all'); // 'all', 'articles', 'videos'

  const articles = [
    {
      id: 1,
      title: 'Introduction to Modern Farming Techniques',
      category: 'basics',
      difficulty: 'Beginner',
      readTime: '8 min read',
      rating: 4.8,
      author: 'Dr. Maria Santos',
      type: 'article',
      excerpt: 'Discover the fundamentals of modern agriculture and sustainable farming practices that are revolutionizing food production worldwide.',
      content: `
        <h3>🌱 The Evolution of Modern Farming</h3>
        <p>Modern farming has undergone tremendous transformation over the past century. Today's agricultural practices combine traditional wisdom with cutting-edge technology to create sustainable, efficient, and productive farming systems.</p>
        
        <h4>Key Principles of Modern Farming:</h4>
        <p><strong>1. Sustainability:</strong> Modern farming prioritizes long-term soil health, water conservation, and biodiversity preservation. This approach ensures that land remains productive for future generations.</p>
        
        <p><strong>2. Technology Integration:</strong> From GPS-guided tractors to drone monitoring systems, technology helps farmers make data-driven decisions that optimize crop yields while minimizing resource waste.</p>
        
        <p><strong>3. Precision Agriculture:</strong> This approach uses detailed field data to apply the right amount of inputs (water, fertilizer, pesticides) at the right time and place, maximizing efficiency and minimizing environmental impact.</p>
        
        <h4>Benefits of Modern Farming Techniques:</h4>
        <p>• <strong>Increased Productivity:</strong> Modern techniques can increase crop yields by 20-30% compared to traditional methods</p>
        <p>• <strong>Resource Efficiency:</strong> Smart irrigation and fertilization reduce water usage by up to 40%</p>
        <p>• <strong>Environmental Protection:</strong> Reduced chemical runoff and soil erosion</p>
        <p>• <strong>Economic Viability:</strong> Higher profits through reduced costs and increased yields</p>
        
        <h4>Getting Started:</h4>
        <p>Begin your modern farming journey by assessing your current practices, identifying areas for improvement, and gradually implementing new techniques. Start with simple changes like soil testing and precision irrigation before moving to more advanced technologies.</p>
      `
    },
    {
      id: 2,
      title: 'Organic Fertilizer Production and Application',
      category: 'organic',
      difficulty: 'Intermediate',
      readTime: '12 min read',
      rating: 4.9,
      author: 'Prof. Juan Dela Cruz',
      type: 'article',
      excerpt: 'Learn how to create and effectively use organic fertilizers to improve soil health and boost crop productivity naturally.',
      content: `
        <h3>🌿 Understanding Organic Fertilizers</h3>
        <p>Organic fertilizers are derived from natural sources and provide essential nutrients to plants while improving soil structure and promoting beneficial microbial activity.</p>
        
        <h4>Types of Organic Fertilizers:</h4>
        <p><strong>Compost:</strong> The gold standard of organic fertilizers, made from decomposed organic matter. Rich in nutrients and beneficial microorganisms.</p>
        
        <p><strong>Vermicompost:</strong> Produced by earthworms breaking down organic waste. Contains higher levels of available nutrients than regular compost.</p>
        
        <p><strong>Green Manure:</strong> Crops grown specifically to be incorporated into the soil to improve fertility and organic matter content.</p>
        
        <p><strong>Animal Manures:</strong> Well-aged manure from livestock provides slow-release nutrients and improves soil structure.</p>
        
        <h4>DIY Compost Production:</h4>
        <p><strong>Materials Needed:</strong></p>
        <p>• Brown materials (carbon): Dry leaves, paper, cardboard</p>
        <p>• Green materials (nitrogen): Kitchen scraps, grass clippings, fresh plant matter</p>
        <p>• Water and air for decomposition</p>
        
        <p><strong>Step-by-Step Process:</strong></p>
        <p>1. Layer brown and green materials in a 3:1 ratio</p>
        <p>2. Maintain moisture like a wrung-out sponge</p>
        <p>3. Turn the pile every 2-3 weeks for aeration</p>
        <p>4. Compost is ready in 3-6 months when dark and earthy</p>
        
        <h4>Application Guidelines:</h4>
        <p>• Apply 2-4 inches of compost annually</p>
        <p>• Work into top 6 inches of soil</p>
        <p>• Best applied before planting or as side-dressing during growing season</p>
        <p>• Can be used as mulch around established plants</p>
      `
    },
    {
      id: 3,
      title: 'Smart Irrigation Systems for Water Conservation',
      category: 'technology',
      difficulty: 'Advanced',
      readTime: '15 min read',
      rating: 4.7,
      author: 'Eng. Lisa Chen',
      type: 'article',
      excerpt: 'Explore cutting-edge irrigation technologies that maximize water efficiency while maintaining optimal crop growth conditions.',
      content: `
        <h3>💧 The Future of Water Management in Agriculture</h3>
        <p>Smart irrigation systems represent a revolutionary approach to water management, combining sensors, automation, and data analytics to optimize water usage in agriculture.</p>
        
        <h4>Components of Smart Irrigation:</h4>
        <p><strong>Soil Moisture Sensors:</strong> Monitor real-time soil moisture levels at various depths to determine precise watering needs.</p>
        
        <p><strong>Weather Stations:</strong> Collect local weather data including temperature, humidity, wind speed, and rainfall predictions.</p>
        
        <p><strong>Automated Controllers:</strong> Process sensor data and automatically adjust irrigation schedules and duration.</p>
        
        <p><strong>Mobile Apps:</strong> Allow remote monitoring and control of irrigation systems from anywhere.</p>
        
        <h4>Types of Smart Irrigation Systems:</h4>
        <p><strong>Drip Irrigation with Smart Controls:</strong></p>
        <p>• Delivers water directly to plant roots</p>
        <p>• Reduces water waste by up to 50%</p>
        <p>• Minimizes weed growth and disease</p>
        <p>• Can be precisely controlled based on crop needs</p>
        
        <p><strong>Sprinkler Systems with Smart Scheduling:</strong></p>
        <p>• Automatically adjust based on weather conditions</p>
        <p>• Skip irrigation during rain events</p>
        <p>• Adjust spray patterns for different crops</p>
        <p>• Monitor system pressure and detect leaks</p>
        
        <h4>Benefits and ROI:</h4>
        <p>• Water savings: 20-50% reduction in water usage</p>
        <p>• Labor savings: 80% reduction in manual irrigation tasks</p>
        <p>• Improved crop yields: 15-25% increase through optimal watering</p>
        <p>• Reduced fertilizer runoff and environmental impact</p>
        
        <h4>Implementation Strategy:</h4>
        <p>Start with a pilot area to test and refine the system before full-scale deployment. Consider factors like crop type, field topography, water source, and budget when selecting components.</p>
      `
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'Complete Guide to Soil Preparation',
      category: 'basics',
      difficulty: 'Beginner',
      duration: '18:32',
      rating: 4.9,
      author: 'Farm Master Pro',
      type: 'video',
      views: '125K',
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      excerpt: 'Master the essential techniques of soil preparation, from testing pH levels to creating the perfect growing environment for your crops.',
      description: 'In this comprehensive video tutorial, you\'ll learn everything about soil preparation including soil testing, pH adjustment, organic matter incorporation, and creating optimal growing conditions for different crops.'
    },
    {
      id: 2,
      title: 'Organic Composting: From Waste to Gold',
      category: 'organic',
      difficulty: 'Beginner',
      duration: '22:15',
      rating: 4.8,
      author: 'Green Thumb Academy',
      type: 'video',
      views: '89K',
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      excerpt: 'Transform your kitchen scraps and yard waste into nutrient-rich compost with this step-by-step video guide.',
      description: 'Learn the art and science of composting with detailed demonstrations of layering techniques, moisture management, turning schedules, and troubleshooting common problems.'
    },
    {
      id: 3,
      title: 'Smart Farming with IoT Sensors',
      category: 'technology',
      difficulty: 'Advanced',
      duration: '35:47',
      rating: 4.7,
      author: 'AgriTech Solutions',
      type: 'video',
      views: '67K',
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      excerpt: 'Discover how IoT sensors and smart technology are revolutionizing modern agriculture with real-time data and automation.',
      description: 'Explore the latest in agricultural technology with demonstrations of sensor installation, data collection, automation systems, and how to interpret sensor data for optimal farming decisions.'
    },
    {
      id: 4,
      title: 'Hydroponic Systems Setup for Beginners',
      category: 'technology',
      difficulty: 'Intermediate',
      duration: '28:12',
      rating: 4.6,
      author: 'HydroGrow Channel',
      type: 'video',
      views: '156K',
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      excerpt: 'Build your first hydroponic system with this detailed tutorial covering equipment, setup, and maintenance.',
      description: 'Complete walkthrough of setting up a hydroponic system including choosing the right system type, nutrient solutions, pH management, and troubleshooting common issues.'
    },
    {
      id: 5,
      title: 'Natural Pest Control Methods',
      category: 'pest-control',
      difficulty: 'Intermediate',
      duration: '25:38',
      rating: 4.8,
      author: 'Eco Farm Expert',
      type: 'video',
      views: '98K',
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      excerpt: 'Protect your crops naturally with proven organic pest control methods that are safe for the environment.',
      description: 'Learn about companion planting, beneficial insects, organic sprays, and integrated pest management strategies that protect your crops without harmful chemicals.'
    },
    {
      id: 6,
      title: 'Vertical Farming: Maximizing Space',
      category: 'technology',
      difficulty: 'Advanced',
      duration: '31:25',
      rating: 4.5,
      author: 'Urban Farm Tech',
      type: 'video',
      views: '78K',
      thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      excerpt: 'Explore vertical farming techniques to grow more food in less space using innovative growing systems.',
      description: 'Discover how to build and manage vertical growing systems, from simple tower gardens to complex multi-level setups with automated lighting and irrigation.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Courses', icon: '📚' },
    { id: 'basics', name: 'Farming Basics', icon: '🌱' },
    { id: 'organic', name: 'Organic Methods', icon: '🌿' },
    { id: 'technology', name: 'Technology', icon: '🤖' },
    { id: 'pest-control', name: 'Pest Control', icon: '🐛' },
  ];

  const contentTypes = [
    { id: 'all', name: 'All Content', icon: '📚' },
    { id: 'articles', name: 'Articles', icon: '📄' },
    { id: 'videos', name: 'Videos', icon: '🎥' },
  ];

  const allContent = [...articles, ...videos];

  const filteredContent = useMemo(() => {
    return allContent.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesType = contentType === 'all' || item.type === contentType.slice(0, -1);
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, selectedCategory, contentType, allContent]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="elearning-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🌾 SmartFarm Academy
            <span className="hero-subtitle">Master Modern Agriculture</span>
          </h1>
          <p className="hero-description">
            Discover cutting-edge farming techniques through expert articles and video tutorials.
            Transform your agricultural journey with comprehensive learning resources.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <BookOpen className="stat-icon" />
            <span className="stat-number">{articles.length}</span>
            <span className="stat-label">Expert Articles</span>
          </div>
          <div className="stat-item">
            <Video className="stat-icon" />
            <span className="stat-number">{videos.length}</span>
            <span className="stat-label">Video Tutorials</span>
          </div>
          <div className="stat-item">
            <Users className="stat-icon" />
            <span className="stat-number">15k+</span>
            <span className="stat-label">Active Learners</span>
          </div>
          <div className="stat-item">
            <Award className="stat-icon" />
            <span className="stat-number">4.8</span>
            <span className="stat-label">Avg Rating</span>
          </div>
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search articles, videos, topics, or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-container">
          <div className="filter-group">
            <h3 className="filter-title">Content Type</h3>
            <div className="filter-buttons">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`filter-btn ${contentType === type.id ? 'active' : ''}`}
                >
                  <span className="filter-icon">{type.icon}</span>
                  <span className="filter-name">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Category</h3>
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  <span className="filter-icon">{category.icon}</span>
                  <span className="filter-name">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!selectedArticle && !selectedVideo ? (
        <div className="content-section">
          <h2 className="section-title">
            {searchTerm || selectedCategory !== 'all' || contentType !== 'all'
              ? `${filteredContent.length} Results Found` 
              : 'Featured Learning Content'}
          </h2>
          <div className="content-grid">
            {filteredContent.map((item) => (
              <div 
                key={`${item.type}-${item.id}`} 
                className={`content-card ${item.type}-card`}
                onClick={() => item.type === 'article' ? setSelectedArticle(item) : setSelectedVideo(item)}
              >
                {item.type === 'video' && (
                  <div className="video-thumbnail">
                    <img src={item.thumbnail} alt={item.title} />
                    <div className="play-overlay">
                      <Play className="play-icon" />
                    </div>
                    <div className="video-duration">{item.duration}</div>
                  </div>
                )}
                
                <div className="card-content">
                  <div className="card-header">
                    <div className="card-meta">
                      <div className="content-type-badge">
                        {item.type === 'article' ? <FileText className="type-icon" /> : <Video className="type-icon" />}
                        {item.type === 'article' ? 'Article' : 'Video'}
                      </div>
                      <span 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(item.difficulty) }}
                      >
                        {item.difficulty}
                      </span>
                      <div className="rating">
                        <Star className="star-icon" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <div className="card-stats">
                      <Clock className="clock-icon" />
                      <span>{item.type === 'article' ? item.readTime : item.duration}</span>
                      {item.type === 'video' && (
                        <span className="views">{item.views} views</span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-excerpt">{item.excerpt}</p>
                  
                  <div className="card-footer">
                    <span className="card-author">By {item.author}</span>
                    <button className="action-btn">
                      {item.type === 'article' ? 'Read More' : 'Watch Now'} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : selectedArticle ? (
        <div className="article-view">
          <button 
            onClick={() => setSelectedArticle(null)}
            className="back-btn"
          >
            ← Back to Content
          </button>
          
          <div className="article-content">
            <div className="article-hero">
              <div className="article-meta-header">
                <div className="content-type-badge large">
                  <FileText className="type-icon" />
                  Article
                </div>
                <span 
                  className="difficulty-badge large"
                  style={{ backgroundColor: getDifficultyColor(selectedArticle.difficulty) }}
                >
                  {selectedArticle.difficulty}
                </span>
                <div className="rating large">
                  <Star className="star-icon" />
                  <span>{selectedArticle.rating}</span>
                </div>
              </div>
              
              <h1 className="article-main-title">{selectedArticle.title}</h1>
              
              <div className="article-details">
                <span className="article-author">By {selectedArticle.author}</span>
                <span className="article-divider">•</span>
                <span className="article-time">
                  <Clock className="clock-icon-small" />
                  {selectedArticle.readTime}
                </span>
              </div>
            </div>
            
            <div 
              className="article-body"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>
        </div>
      ) : (
        <div className="video-view">
          <button 
            onClick={() => setSelectedVideo(null)}
            className="back-btn"
          >
            ← Back to Content
          </button>
          
          <div className="video-content">
            <div className="video-hero">
              <div className="video-meta-header">
                <div className="content-type-badge large">
                  <Video className="type-icon" />
                  Video
                </div>
                <span 
                  className="difficulty-badge large"
                  style={{ backgroundColor: getDifficultyColor(selectedVideo.difficulty) }}
                >
                  {selectedVideo.difficulty}
                </span>
                <div className="rating large">
                  <Star className="star-icon" />
                  <span>{selectedVideo.rating}</span>
                </div>
              </div>
              
              <h1 className="video-main-title">{selectedVideo.title}</h1>
              
              <div className="video-details">
                <span className="video-author">By {selectedVideo.author}</span>
                <span className="video-divider">•</span>
                <span className="video-duration">
                  <Clock className="clock-icon-small" />
                  {selectedVideo.duration}
                </span>
                <span className="video-divider">•</span>
                <span className="video-views">{selectedVideo.views} views</span>
              </div>
            </div>
            
            <div className="video-player">
              <iframe
                width="100%"
                height="500"
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="video-description">
              <h3>About This Video</h3>
              <p>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .elearning-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #1a202c;
        }

        .hero-section {
          padding: 4rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          text-shadow: 0 4px 8px rgba(0,0,0,0.3);
          line-height: 1.1;
        }

        .hero-subtitle {
          display: block;
          font-size: 1.5rem;
          font-weight: 400;
          opacity: 0.9;
          margin-top: 0.5rem;
        }

        .hero-description {
          font-size: 1.25rem;
          color: rgba(255,255,255,0.9);
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          min-width: 120px;
          transition: transform 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          width: 24px;
          height: 24px;
          color: white;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.8);
        }

        .search-section {
          padding: 2rem;
          background: white;
        }

        .search-container {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #6b7280;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          font-size: 1.125rem;
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          background: #f9fafb;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filter-section {
          padding: 2rem;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .filter-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .filter-group {
          margin-bottom: 2rem;
        }

        .filter-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #374151;
        }

        .filter-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 25px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .filter-btn:hover {
          border-color: #667eea;
          background: #f8fafc;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
        }

        .filter-icon {
          font-size: 1rem;
        }

        .content-section {
          padding: 2rem;
          background: #f8fafc;
          min-height: 50vh;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          color: #1a202c;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .content-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
          height: fit-content;
        }

        .content-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: #667eea;
        }

        .video-thumbnail {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .video-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.7);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .content-card:hover .play-overlay {
          background: rgba(102, 126, 234, 0.9);
          transform: translate(-50%, -50%) scale(1.1);
        }

        .play-icon {
          width: 24px;
          height: 24px;
          color: white;
          margin-left: 3px;
        }

        .video-duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-content {
          padding: 1.5rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .content-type-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          background: #f3f4f6;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .content-type-badge.large {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .type-icon {
          width: 12px;
          height: 12px;
        }

        .difficulty-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .difficulty-badge.large {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #f59e0b;
          font-weight: 600;
        }

        .rating.large {
          font-size: 1.125rem;
        }

        .star-icon {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        .card-stats {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .clock-icon {
          width: 14px;
          height: 14px;
        }

        .clock-icon-small {
          width: 12px;
          height: 12px;
        }

        .views {
          color: #6b7280;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 0.75rem;
          color: #1a202c;
        }

        .card-excerpt {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .card-author {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .action-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          transform: translateX(3px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .article-view, .video-view {
          background: white;
          min-height: 100vh;
        }

        .back-btn {
          position: sticky;
          top: 2rem;
          left: 2rem;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          color: #667eea;
          transition: all 0.3s ease;
          margin: 2rem;
          z-index: 10;
        }

        .back-btn:hover {
          background: #667eea;
          color: white;
          transform: translateX(-3px);
        }

        .article-content, .video-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .article-hero, .video-hero {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem 0;
          border-bottom: 2px solid #e5e7eb;
        }

        .article-meta-header, .video-meta-header {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .article-main-title, .video-main-title {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.2;
          color: #1a202c;
          margin-bottom: 1rem;
        }

        .article-details, .video-details {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          color: #6b7280;
          font-size: 1rem;
          flex-wrap: wrap;
        }

        .article-divider, .video-divider {
          color: #d1d5db;
        }

        .video-player {
          margin: 2rem 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .video-description {
          margin-top: 2rem;
          padding: 2rem;
          background: #f8fafc;
          border-radius: 12px;
        }

        .video-description h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a202c;
        }

        .video-description p {
          color: #4b5563;
          line-height: 1.6;
          font-size: 1.125rem;
        }

        .article-body {
          line-height: 1.8;
          font-size: 1.125rem;
        }

        .article-body h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a202c;
          margin: 2rem 0 1rem;
          border-left: 4px solid #667eea;
          padding-left: 1rem;
        }

        .article-body h4 {
          font-size: 1.375rem;
          font-weight: 600;
          color: #374151;
          margin: 1.5rem 0 0.75rem;
        }

        .article-body p {
          margin-bottom: 1rem;
          color: #4b5563;
        }

        .article-body strong {
          color: #1a202c;
          font-weight: 700;
        }

        .article-body p:has(strong:first-child) {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          padding: 1rem;
          border-radius: 12px;
          border-left: 4px solid #667eea;
          margin: 1rem 0;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.25rem;
          }

          .hero-stats {
            gap: 1rem;
            grid-template-columns: repeat(2, 1fr);
            display: grid;
          }

          .filter-buttons {
            justify-content: center;
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .article-main-title, .video-main-title {
            font-size: 2rem;
          }

          .article-details, .video-details {
            flex-direction: column;
            gap: 0.5rem;
          }

          .search-input {
            font-size: 1rem;
          }

          .card-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .video-player iframe {
            height: 250px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-stats {
            grid-template-columns: 1fr;
          }

          .article-content, .video-content {
            padding: 1rem;
          }

          .back-btn {
            margin: 1rem;
          }

          .filter-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .card-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .action-btn {
            width: 100%;
            text-align: center;
          }
        }

                .article-body ul,
        .article-body ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .article-body li {
          margin-bottom: 0.5rem;
        }

        .article-body a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .article-body a:hover {
          text-decoration: underline;
        }

        /* Additional utility classes */
        .hidden {
          display: none;
        }

        .text-center {
          text-align: center;
        }

        .mt-1 { margin-top: 0.25rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-3 { margin-top: 0.75rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-5 { margin-top: 1.5rem; }
        .mt-6 { margin-top: 2rem; }
        .mt-8 { margin-top: 2.5rem; }
        .mt-10 { margin-top: 3rem; }

        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-5 { margin-bottom: 1.5rem; }
        .mb-6 { margin-bottom: 2rem; }
        .mb-8 { margin-bottom: 2.5rem; }
        .mb-10 { margin-bottom: 3rem; }

        .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-5 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .px-6 { padding-left: 2rem; padding-right: 2rem; }
        .px-8 { padding-left: 2.5rem; padding-right: 2.5rem; }
        .px-10 { padding-left: 3rem; padding-right: 3rem; }

        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .py-5 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
        .py-6 { padding-top: 2rem; padding-bottom: 2rem; }
        .py-8 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
        .py-10 { padding-top: 3rem; padding-bottom: 3rem; }

        /* Animation classes */
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .slide-up {
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Loading state */
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(102, 126, 234, 0.2);
          border-radius: 50%;
          border-top-color: #667eea;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default SmartFarmAcademy;