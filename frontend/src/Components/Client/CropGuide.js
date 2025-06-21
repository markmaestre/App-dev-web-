import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaQuestionCircle, FaImage, FaArrowLeft, FaSpinner, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function CropGuide() {
  const [name, setName] = useState('');
  const [harvestCalendar, setHarvestCalendar] = useState('');
  const [crops, setCrops] = useState([]);
  const [dailyTip, setDailyTip] = useState('');
  const [soilTip, setSoilTip] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [userQuestion, setUserQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [dailyImages, setDailyImages] = useState([]);
  const [imagesUsedToday, setImagesUsedToday] = useState(0);
  const [lastImageDate, setLastImageDate] = useState('');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  const cropFallbackData = {
    carrot: {
      harvest: "60–75 days after planting",
      soil: "Loose, well-drained sandy loam soil",
      daily: "Thin seedlings to avoid crowding and promote healthy root growth.",
      tips: [
        "Plant in loose, sandy soil for straight roots",
        "Thin seedlings to 2 inches apart",
        "Keep soil consistently moist"
      ]
    },
    lettuce: {
      harvest: "30–60 days depending on variety",
      soil: "Cool, moist, well-drained soil",
      daily: "Harvest outer leaves regularly to encourage growth.",
      tips: [
        "Plant in cool weather",
        "Harvest outer leaves first",
        "Provide partial shade in hot weather"
      ]
    },
    tomato: {
      harvest: "70–85 days after transplanting",
      soil: "Fertile, well-drained soil with pH 6.2 to 6.8",
      daily: "Stake or cage your plants for support.",
      tips: [
        "Provide support with stakes or cages",
        "Water at the base to prevent disease",
        "Prune suckers for better fruit production"
      ]
    },
  };

  const fetchCropInfo = async (cropName) => {
    try {
      const res = await axios.get(`https://openfarm.cc/api/v1/crops?filter=${cropName}`);
      const crop = res.data.data[0]?.attributes;
      const fallback = cropFallbackData[cropName];

      setHarvestCalendar(
        crop?.growing_degree_days
          ? `${crop.growing_degree_days} days to harvest`
          : fallback?.harvest || "Harvest time not available"
      );
      setSoilTip(crop?.soil || fallback?.soil || "No soil data available");
      setDailyTip(crop?.description || fallback?.daily || "No description available");
      setSelectedCrop(cropName);
    } catch (error) {
      console.error('Error fetching crop data:', error);
      const fallback = cropFallbackData[cropName];
      setHarvestCalendar(fallback?.harvest || "Harvest time not available");
      setSoilTip(fallback?.soil || "No soil data available");
      setDailyTip(fallback?.daily || "No description available");
      setSelectedCrop(cropName);
    }
  };

  const fetchCrops = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/crops?userId=${user._id}`);
      setCrops(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNameChange = (e) => {
    const input = e.target.value.toLowerCase();
    setName(input);
    fetchCropInfo(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !harvestCalendar || !user?._id) return;

    try {
      await axios.post('http://localhost:4000/api/crops', {
        name,
        harvestCalendar,
        userId: user._id
      });
      setName('');
      setHarvestCalendar('');
      setSoilTip('');
      setDailyTip('');
      fetchCrops();
      setSelectedCrop(null);
    } catch (err) {
      console.error(err);
    }
  };

  const askOpenAI = async (question) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/ask-ai', {
        crop: selectedCrop,
        question
      });

      setAiResponse(response.data.answer);
    } catch (err) {
      console.error('Error calling AI API:', err);
      setError('Failed to get response from AI. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    const today = new Date().toDateString();
    if (lastImageDate !== today) {
      setImagesUsedToday(0);
      setLastImageDate(today);
    }

    if (imagesUsedToday >= 3) {
      setError('You can only generate 3 images per day. Come back tomorrow!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/generate-image', {
        crop: selectedCrop
      });

      setDailyImages(prev => [...prev, response.data.url]);
      setImagesUsedToday(prev => prev + 1);
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCrops();
  }, [user]);

  return (
    <div style={styles.container}>
      {/* User Welcome Section */}
      <div style={styles.userWelcome}>
        <FaUser style={styles.userIcon} />
        <div>
          <h3 style={styles.welcomeText}>
            Welcome back, <span style={styles.userName}>{user.name || user.email}</span>!
          </h3>
          <p style={styles.userRole}>Role: {user.role}</p>
        </div>
      </div>

      {!selectedCrop ? (
        <>
          <h1 style={styles.title}>Crop Guide Hub</h1>
          <p style={styles.subtitle}>
            • Planting guides, harvest calendars, and soil care tips for different crops.
          </p>

          <div style={styles.availableCropsBox}>
            <strong>📋 Available Crops with Harvest Info:</strong>
            <ul style={styles.availableList}>
              {Object.keys(cropFallbackData).map((crop) => (
                <li 
                  key={crop} 
                  style={styles.cropName}
                  onClick={() => fetchCropInfo(crop)}
                >
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Crop Name (e.g., carrot)"
              value={name}
              onChange={handleNameChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Harvest Calendar"
              value={harvestCalendar}
              onChange={(e) => setHarvestCalendar(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Add Crop
            </button>
          </form>

          <div style={styles.listContainer}>
            <h2>Your Crop Entries</h2>
            {crops.length === 0 ? (
              <p>No crops added yet.</p>
            ) : (
              <ul style={styles.ul}>
                {crops.map((crop) => (
                  <li key={crop._id} style={styles.listItem}>
                    <strong>{crop.name}</strong><br />
                    {crop.harvestCalendar}<br />
                    <small>Added on: {new Date(crop.createdAt).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div style={styles.cropDetailContainer}>
          <button onClick={() => setSelectedCrop(null)} style={styles.backButton}>
            <FaArrowLeft /> Back to all crops
          </button>

          <h2 style={styles.cropTitle}>
            {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Guide
          </h2>

          <div style={styles.cropInfoSection}>
            <h3>Basic Information</h3>
            <p><strong>Harvest Time:</strong> {harvestCalendar}</p>
            <p><strong>Soil Requirements:</strong> {soilTip}</p>
            <p><strong>Daily Tip:</strong> {dailyTip}</p>

            <h3>Quick Tips</h3>
            <ul>
              {cropFallbackData[selectedCrop]?.tips?.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <div style={styles.aiSection}>
            <h3>Ask Our AI Expert</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              askOpenAI(userQuestion);
            }}>
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder={`Ask anything about growing ${selectedCrop}...`}
                style={styles.input}
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? <FaSpinner style={styles.spinner} /> : <FaQuestionCircle />}
                Ask Question
              </button>
            </form>

            {aiResponse && (
              <div style={styles.aiResponse}>
                <h4>Expert Advice:</h4>
                <p>{aiResponse}</p>
              </div>
            )}
          </div>

          <div style={styles.imageSection}>
            <h3>Visual Guide</h3>
            <button
              onClick={generateImage}
              style={styles.button}
              disabled={loading || imagesUsedToday >= 3}
            >
              {loading ? <FaSpinner style={styles.spinner} /> : <FaImage />}
              Generate Image ({3 - imagesUsedToday} left today)
            </button>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.imageGrid}>
              {dailyImages.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`${selectedCrop} cultivation`} 
                  style={styles.generatedImage}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    background: '#f4faf5',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  userWelcome: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '10px',
    marginBottom: '20px',
    borderLeft: '5px solid #2d6a4f'
  },
  userIcon: {
    fontSize: '28px',
    color: '#2d6a4f'
  },
  welcomeText: {
    margin: 0,
    color: '#2d6a4f',
    fontSize: '1.2rem'
  },
  userName: {
    fontWeight: 'bold',
    color: '#1b5e20'
  },
  userRole: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem'
  },
  form: { marginTop: '20px' },
  input: {
    padding: '10px',
    marginBottom: '10px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  button: {
    backgroundColor: '#2d6a4f',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  listContainer: { marginTop: '30px' },
  ul: { listStyle: 'none', padding: 0 },
  listItem: {
    background: '#fff',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  availableCropsBox: {
    backgroundColor: '#e0f7fa',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '20px'
  },
  availableList: { listStyle: 'none', paddingLeft: 0 },
  cropName: {
    cursor: 'pointer',
    margin: '8px 0',
    color: '#2d6a4f',
    fontSize: '1rem',
    padding: '5px',
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: '#f0fdf4'
    }
  },
  cropDetailContainer: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    background: '#f4faf5',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    background: '#f0f0f0',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  cropTitle: {
    color: '#2d6a4f',
    marginBottom: '0.5em',
  },
  cropInfoSection: {
    backgroundColor: '#f0fdf4',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  aiSection: { margin: '30px 0' },
  aiResponse: {
    backgroundColor: '#e8f5e9',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '15px',
  },
  imageSection: { margin: '30px 0' },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '15px',
  },
  generatedImage: {
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  error: {
    color: '#d32f2f',
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '5px'
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
  title: {
    color: '#2d6a4f',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '20px',
  }
};

export default CropGuide;