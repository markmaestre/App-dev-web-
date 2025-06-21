import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Users, Award, Clock, Star } from 'lucide-react';

function Elearning() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const articles = [
    {
      id: 1,
      title: 'Introduction to Modern Farming Techniques',
      category: 'basics',
      difficulty: 'Beginner',
      readTime: '8 min read',
      rating: 4.8,
      author: 'Dr. Maria Santos',
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
    },
    {
      id: 4,
      title: 'Integrated Pest Management Strategies',
      category: 'pest-control',
      difficulty: 'Intermediate',
      readTime: '10 min read',
      rating: 4.6,
      author: 'Dr. Robert Kim',
      excerpt: 'Master eco-friendly pest control methods that protect crops while preserving beneficial insects and environmental health.',
      content: `
        <h3>🐛 Sustainable Pest Control Approaches</h3>
        <p>Integrated Pest Management (IPM) combines multiple strategies to control pests effectively while minimizing risks to human health and the environment.</p>
        
        <h4>Core IPM Principles:</h4>
        <p><strong>Prevention:</strong> The first line of defense involves creating conditions that prevent pest problems from occurring.</p>
        
        <p><strong>Monitoring:</strong> Regular scouting and identification of pests and beneficial insects to make informed decisions.</p>
        
        <p><strong>Threshold-Based Decisions:</strong> Taking action only when pest populations reach economically damaging levels.</p>
        
        <p><strong>Multiple Control Methods:</strong> Using a combination of biological, cultural, physical, and chemical controls.</p>
        
        <h4>IPM Control Methods:</h4>
        <p><strong>Biological Control:</strong></p>
        <p>• Release beneficial insects like ladybugs and parasitic wasps</p>
        <p>• Use microbial pesticides (Bt, beneficial bacteria)</p>
        <p>• Encourage natural predators through habitat management</p>
        
        <p><strong>Cultural Control:</strong></p>
        <p>• Crop rotation to break pest life cycles</p>
        <p>• Resistant varieties selection</p>
        <p>• Proper sanitation and field hygiene</p>
        <p>• Timing of planting and harvesting</p>
        
        <p><strong>Physical/Mechanical Control:</strong></p>
        <p>• Row covers and screens</p>
        <p>• Traps and barriers</p>
        <p>• Cultivation and mulching</p>
        <p>• Hand removal of pests</p>
        
        <h4>Monitoring and Scouting:</h4>
        <p>• Inspect crops weekly during growing season</p>
        <p>• Use yellow sticky traps for flying insects</p>
        <p>• Check undersides of leaves for eggs and larvae</p>
        <p>• Keep detailed records of pest populations and control measures</p>
        
        <h4>Economic Benefits:</h4>
        <p>IPM programs typically reduce pesticide costs by 25-50% while maintaining or improving crop yields through better pest suppression and reduced resistance development.</p>
      `
    },
    {
      id: 5,
      title: 'Soil Health Assessment and Improvement',
      category: 'soil-management',
      difficulty: 'Beginner',
      readTime: '9 min read',
      rating: 4.8,
      author: 'Dr. Sarah Johnson',
      excerpt: 'Learn how to evaluate and enhance soil health for optimal crop production and long-term agricultural sustainability.',
      content: `
        <h3>🌱 Building the Foundation: Healthy Soil</h3>
        <p>Soil health is the foundation of successful agriculture. Healthy soil supports plant growth, stores carbon, filters water, and provides habitat for countless beneficial organisms.</p>
        
        <h4>Key Soil Health Indicators:</h4>
        <p><strong>Physical Properties:</strong></p>
        <p>• Soil structure and aggregation</p>
        <p>• Water infiltration and retention</p>
        <p>• Bulk density and compaction</p>
        <p>• Root penetration depth</p>
        
        <p><strong>Chemical Properties:</strong></p>
        <p>• pH levels (optimal range 6.0-7.0 for most crops)</p>
        <p>• Nutrient availability (N, P, K, micronutrients)</p>
        <p>• Organic matter content (target: 3-5%)</p>
        <p>• Cation exchange capacity</p>
        
        <p><strong>Biological Properties:</strong></p>
        <p>• Microbial diversity and activity</p>
        <p>• Earthworm populations</p>
        <p>• Organic matter decomposition rate</p>
        <p>• Root mycorrhizal associations</p>
        
        <h4>Simple Soil Tests You Can Do:</h4>
        <p><strong>Jar Test (Soil Texture):</strong></p>
        <p>1. Fill jar 1/3 with soil sample</p>
        <p>2. Add water to 2/3 full, shake vigorously</p>
        <p>3. Let settle for 24 hours</p>
        <p>4. Measure sand (bottom), silt (middle), clay (top) layers</p>
        
        <p><strong>Percolation Test (Drainage):</strong></p>
        <p>1. Dig hole 12 inches deep and 6 inches wide</p>
        <p>2. Fill with water and let drain completely</p>
        <p>3. Refill and measure water level drop over 1 hour</p>
        <p>4. Good drainage: 1-2 inches per hour</p>
        
        <h4>Soil Improvement Strategies:</h4>
        <p><strong>Organic Matter Addition:</strong></p>
        <p>• Add 2-4 inches of compost annually</p>
        <p>• Use cover crops during fallow periods</p>
        <p>• Leave crop residues when possible</p>
        <p>• Apply aged animal manures</p>
        
        <p><strong>pH Management:</strong></p>
        <p>• Add lime to raise pH in acidic soils</p>
        <p>• Use sulfur to lower pH in alkaline soils</p>
        <p>• Apply organic matter to buffer pH changes</p>
        
        <p><strong>Compaction Prevention:</strong></p>
        <p>• Avoid working wet soils</p>
        <p>• Use controlled traffic patterns</p>
        <p>• Plant deep-rooted cover crops</p>
        <p>• Reduce tillage intensity</p>
      `
    },
    {
      id: 6,
      title: 'Crop Rotation and Companion Planting',
      category: 'crop-management',
      difficulty: 'Intermediate',
      readTime: '11 min read',
      rating: 4.9,
      author: 'Prof. Michael Brown',
      excerpt: 'Discover how strategic crop rotation and companion planting can naturally improve soil fertility and reduce pest problems.',
      content: `
        <h3>🔄 Strategic Crop Planning for Maximum Benefits</h3>
        <p>Crop rotation and companion planting are time-tested agricultural practices that work with natural ecosystems to create more resilient and productive farming systems.</p>
        
        <h4>Benefits of Crop Rotation:</h4>
        <p><strong>Soil Fertility:</strong> Different crops have varying nutrient needs and contributions. Legumes fix nitrogen, while deep-rooted crops bring up nutrients from lower soil layers.</p>
        
        <p><strong>Pest and Disease Control:</strong> Breaking pest life cycles by removing their preferred host plants for a season or more.</p>
        
        <p><strong>Weed Management:</strong> Different cultivation practices and crop canopies suppress different weed species.</p>
        
        <p><strong>Soil Structure:</strong> Varied root systems improve soil aggregation and organic matter distribution.</p>
        
        <h4>Basic Rotation Principles:</h4>
        <p><strong>Four-Year Rotation Example:</strong></p>
        <p>Year 1: Nitrogen-fixing legumes (beans, peas, clover)</p>
        <p>Year 2: Leafy greens (lettuce, spinach, cabbage)</p>
        <p>Year 3: Root vegetables (carrots, radishes, potatoes)</p>
        <p>Year 4: Fruiting crops (tomatoes, peppers, squash)</p>
        
        <p><strong>Family Groupings to Avoid Repeating:</strong></p>
        <p>• Solanaceae: Tomatoes, potatoes, peppers, eggplant</p>
        <p>• Brassicaceae: Cabbage, broccoli, radishes, mustard</p>
        <p>• Leguminosae: Beans, peas, clover, alfalfa</p>
        <p>• Cucurbitaceae: Cucumbers, squash, melons, pumpkins</p>
        
        <h4>Companion Planting Strategies:</h4>
        <p><strong>Classic Combinations:</strong></p>
        <p><strong>Three Sisters (Corn, Beans, Squash):</strong></p>
        <p>• Corn provides support for climbing beans</p>
        <p>• Beans fix nitrogen for corn and squash</p>
        <p>• Squash leaves shade soil and deter pests</p>
        
        <p><strong>Tomatoes and Basil:</strong></p>
        <p>• Basil repels aphids and hornworms</p>
        <p>• Both plants have similar water and nutrient needs</p>
        <p>• Improved flavor in both crops</p>
        
        <p><strong>Pest-Repelling Plants:</strong></p>
        <p>• Marigolds: Repel nematodes and aphids</p>
        <p>• Nasturtiums: Trap crop for aphids and cucumber beetles</p>
        <p>• Mint: Deters ants and rodents (plant in containers)</p>
        
        <h4>Planning Your Rotation:</h4>
        <p>1. Map your garden/field areas</p>
        <p>2. List crops you want to grow and their families</p>
        <p>3. Plan 3-4 year rotation schedule</p>
        <p>4. Include cover crops in fallow periods</p>
        <p>5. Keep detailed records for future planning</p>
        
        <h4>Common Mistakes to Avoid:</h4>
        <p>• Planting same family crops in consecutive years</p>
        <p>• Ignoring soil nutrient needs of different crops</p>
        <p>• Not including nitrogen-fixing crops in rotation</p>
        <p>• Failing to account for crop residue decomposition time</p>
      `
    }
  ];

  const categories = [
    { id: 'all', name: 'All Courses', icon: '📚' },
    { id: 'basics', name: 'Farming Basics', icon: '🌱' },
    { id: 'organic', name: 'Organic Methods', icon: '🌿' },
    { id: 'technology', name: 'Technology', icon: '🤖' },
    { id: 'pest-control', name: 'Pest Control', icon: '🐛' },
    { id: 'soil-management', name: 'Soil Management', icon: '🌍' },
    { id: 'crop-management', name: 'Crop Management', icon: '🌾' }
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, articles]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
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
            Discover cutting-edge farming techniques, sustainable practices, and innovative solutions 
            to transform your agricultural journey.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <BookOpen className="stat-icon" />
            <span className="stat-number">{articles.length}</span>
            <span className="stat-label">Expert Articles</span>
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
            placeholder="Search articles, topics, or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="categories-section">
        <h2 className="section-title">Browse by Category</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {!selectedArticle ? (
        <div className="articles-section">
          <h2 className="section-title">
            {searchTerm || selectedCategory !== 'all' 
              ? `${filteredArticles.length} Articles Found` 
              : 'Featured Learning Materials'}
          </h2>
          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <div key={article.id} className="article-card" onClick={() => setSelectedArticle(article)}>
                <div className="article-header">
                  <div className="article-meta">
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(article.difficulty) }}
                    >
                      {article.difficulty}
                    </span>
                    <div className="article-rating">
                      <Star className="star-icon" />
                      <span>{article.rating}</span>
                    </div>
                  </div>
                  <div className="article-stats">
                    <Clock className="clock-icon" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                
                <h3 className="article-title">{article.title}</h3>
                <p className="article-excerpt">{article.excerpt}</p>
                
                <div className="article-footer">
                  <span className="article-author">By {article.author}</span>
                  <button className="read-more-btn">Read More →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="article-view">
          <button 
            onClick={() => setSelectedArticle(null)}
            className="back-btn"
          >
            ← Back to Articles
          </button>
          
          <div className="article-content">
            <div className="article-hero">
              <div className="article-meta-header">
                <span 
                  className="difficulty-badge large"
                  style={{ backgroundColor: getDifficultyColor(selectedArticle.difficulty) }}
                >
                  {selectedArticle.difficulty}
                </span>
                <div className="article-rating large">
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
          gap: 3rem;
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

        .categories-section {
          padding: 2rem;
          background: white;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          color: #1a202c;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .category-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .category-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border-color: #667eea;
        }

        .category-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
        }

        .category-icon {
          font-size: 2rem;
        }

        .category-name {
          font-weight: 600;
          font-size: 1rem;
        }

        .articles-section {
          padding: 2rem;
          background: #f8fafc;
          min-height: 50vh;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .article-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
          height: fit-content;
        }

        .article-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: #667eea;
        }

        .article-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .article-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
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

        .article-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #f59e0b;
          font-weight: 600;
        }

        .article-rating.large {
          font-size: 1.125rem;
        }

        .star-icon {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        .article-stats {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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

        .article-title {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 0.75rem;
          color: #1a202c;
        }

        .article-excerpt {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .article-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .article-author {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .read-more-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .read-more-btn:hover {
          transform: translateX(3px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .article-view {
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

        .article-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .article-hero {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem 0;
          border-bottom: 2px solid #e5e7eb;
        }

        .article-meta-header {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .article-main-title {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.2;
          color: #1a202c;
          margin-bottom: 1rem;
        }

        .article-details {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          color: #6b7280;
          font-size: 1rem;
        }

        .article-divider {
          color: #d1d5db;
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
            gap: 1.5rem;
          }

          .categories-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .articles-grid {
            grid-template-columns: 1fr;
          }

          .article-main-title {
            font-size: 2rem;
          }

          .article-details {
            flex-direction: column;
            gap: 0.5rem;
          }

          .search-input {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-stats {
            flex-direction: column;
            align-items: center;
          }

          .article-content {
            padding: 1rem;
          }

          .back-btn {
            margin: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Elearning;