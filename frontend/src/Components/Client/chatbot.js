import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user', timestamp: new Date().toLocaleTimeString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAuM4l1H4_FjUGQqNTyAK5xt8ESHqicj20',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are a helpful AI assistant that can communicate in Tagalog, English, and Taglish (mix of Tagalog and English). Please respond naturally in the same language or language mix as the user's question. Be conversational and friendly.

User's question: ${input}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Wala akong sagot ngayon.';
      const botMessage = { 
        text: reply, 
        sender: 'bot', 
        timestamp: new Date().toLocaleTimeString() 
      };
      
      setMessages([...newMessages, botMessage]);
    } catch (err) {
      console.error('Gemini API Error:', err);
      let errorMessage = '❌ Error: Hindi ako makasagot ngayon. ';
      
      if (err.message.includes('429')) {
        errorMessage += 'Too many requests. Please wait a moment.';
      } else if (err.message.includes('403')) {
        errorMessage += 'API key issue. Please check your configuration.';
      } else if (err.name === 'AbortError') {
        errorMessage += 'Request timeout. Please try again.';
      } else {
        errorMessage += 'Try again later.';
      }
      
      const errorBotMessage = { 
        text: errorMessage, 
        sender: 'bot', 
        timestamp: new Date().toLocaleTimeString(),
        isError: true 
      };
      
      setMessages([...newMessages, errorBotMessage]);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Pattern */}
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <div style={styles.logoContainer}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.logo}>
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              <path d="M12 16L13.09 22.26L22 23L13.09 23.74L12 30L10.91 23.74L2 23L10.91 22.26L12 16Z"/>
            </svg>
            <div>
              <h1 style={styles.title}>SmartFARM</h1>
              <p style={styles.subtitle}>AI-Powered Agricultural Assistant • Gemini 1.5 Flash</p>
            </div>
          </div>
          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
              <span>Multi-language</span>
            </div>
            <div style={styles.statItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
        <button onClick={clearChat} style={styles.clearButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2"/>
          </svg>
          Clear Chat
        </button>
      </div>

      <div style={styles.chatbox}>
        {messages.length === 0 && (
          <div style={styles.welcomeMessage}>
            <div style={styles.welcomeIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                <path d="M3 12h18"/>
                <path d="M3 18h18"/>
              </svg>
            </div>
            <h3 style={styles.welcomeTitle}>Welcome to SmartFARM</h3>
            <p style={styles.welcomeText}>
              Your intelligent farming companion. Ask me about crops, weather, soil management, 
              pest control, or any agricultural question in Tagalog, English, or Taglish.
            </p>
            <div style={styles.suggestionCards}>
              <div style={styles.suggestionCard}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>
                <span>Crop Management</span>
              </div>
              <div style={styles.suggestionCard}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                </svg>
                <span>Weather Insights</span>
              </div>
              <div style={styles.suggestionCard}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 20h10"/>
                  <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
                  <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
                </svg>
                <span>Soil Health</span>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.messageContainer,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                ...styles.message,
                backgroundColor: msg.isError 
                  ? '#fef2f2' 
                  : msg.sender === 'user' 
                    ? '#2d5016' 
                    : '#ffffff',
                color: msg.isError 
                  ? '#1f2937' 
                  : msg.sender === 'user' 
                    ? '#ffffff' 
                    : '#1f2937',
                borderLeft: msg.isError 
                  ? '4px solid #ef4444' 
                  : msg.sender === 'user'
                    ? '4px solid #65a30d'
                    : '4px solid #84cc16',
                boxShadow: msg.sender === 'user' 
                  ? '0 4px 12px rgba(45, 80, 22, 0.15)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div style={styles.messageHeader}>
                <div style={styles.senderInfo}>
                  <div style={{
                    ...styles.avatar,
                    backgroundColor: msg.sender === 'user' ? '#65a30d' : '#84cc16',
                    color: msg.sender === 'user' ? '#ffffff' : '#1f2937'
                  }}>
                    {msg.sender === 'user' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                      </svg>
                    )}
                  </div>
                  <span style={{
                    ...styles.sender,
                    color: msg.sender === 'user' ? '#d1fae5' : '#6b7280'
                  }}>
                    {msg.sender === 'user' ? 'You' : 'AgriAssist'}
                  </span>
                </div>
                <span style={{
                  ...styles.timestamp,
                  color: msg.sender === 'user' ? '#bbf7d0' : '#9ca3af'
                }}>
                  {msg.timestamp}
                </span>
              </div>
              <div style={styles.messageText}>{msg.text}</div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ ...styles.messageContainer, alignSelf: 'flex-start' }}>
            <div style={{ 
              ...styles.message, 
              backgroundColor: '#ffffff', 
              color: '#1f2937',
              borderLeft: '4px solid #84cc16',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={styles.messageHeader}>
                <div style={styles.senderInfo}>
                  <div style={{...styles.avatar, backgroundColor: '#84cc16', color: '#1f2937'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <span style={{...styles.sender, color: '#6b7280'}}>AgriAssist</span>
                </div>
              </div>
              <div style={styles.loadingText}>
                <div style={styles.typingIndicator}>
                  <div style={styles.dot}></div>
                  <div style={styles.dot}></div>
                  <div style={styles.dot}></div>
                </div>
                <span style={styles.loadingLabel}>Analyzing your query...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <div style={styles.inputIconContainer}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <textarea
            value={input}
            placeholder="Ask me anything about farming, crops, weather, or agriculture..."
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.input}
            rows="1"
            disabled={loading}
          />
          <button 
            onClick={handleSend} 
            style={{
              ...styles.button,
              opacity: loading || !input.trim() ? 0.4 : 1,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            }}
            disabled={loading || !input.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#fefefe',
    borderRadius: '20px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    border: '1px solid #e5e7eb',
    minHeight: '700px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 50%, rgba(132, 204, 22, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(101, 163, 13, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(132, 204, 22, 0.02) 0%, transparent 50%)
    `,
    zIndex: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '2px solid #f3f4f6',
    position: 'relative',
    zIndex: 1,
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    color: '#65a30d',
    padding: '8px',
    backgroundColor: '#f7fee7',
    borderRadius: '12px',
    border: '2px solid #dcfce7',
  },
  title: {
    margin: '0',
    color: '#1a202c',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.025em',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    margin: '0',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
  },
  statsContainer: {
    display: 'flex',
    gap: '16px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#f7fee7',
    borderRadius: '8px',
    border: '1px solid #dcfce7',
    fontSize: '12px',
    fontWeight: '500',
    color: '#365314',
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    position: 'relative',
    zIndex: 1,
  },
  chatbox: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minHeight: '450px',
    position: 'relative',
    zIndex: 1,
  },
  welcomeMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '48px 24px',
    height: '100%',
  },
  welcomeIcon: {
    color: '#65a30d',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f7fee7',
    borderRadius: '20px',
    border: '2px solid #dcfce7',
  },
  welcomeTitle: {
    margin: '0 0 12px 0',
    color: '#1a202c',
    fontSize: '24px',
    fontWeight: '700',
  },
  welcomeText: {
    margin: '0 0 32px 0',
    color: '#6b7280',
    fontSize: '16px',
    lineHeight: '1.6',
    maxWidth: '500px',
  },
  suggestionCards: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  suggestionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '85%',
  },
  message: {
    padding: '20px',
    borderRadius: '16px',
    wordWrap: 'break-word',
    border: '1px solid #e5e7eb',
    position: 'relative',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  senderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  },
  sender: {
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  timestamp: {
    fontSize: '11px',
    fontWeight: '500',
    opacity: 0.8,
  },
  messageText: {
    lineHeight: '1.6',
    fontSize: '15px',
    whiteSpace: 'pre-wrap',
  },
  loadingText: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#84cc16',
    animation: 'typing 1.4s infinite ease-in-out',
  },
  loadingLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
  },
  inputContainer: {
    paddingTop: '24px',
    borderTop: '2px solid #f3f4f6',
    position: 'relative',
    zIndex: 1,
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '2px solid #e5e7eb',
    transition: 'all 0.2s ease',
  },
  inputIconContainer: {
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '8px',
  },
  input: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    resize: 'none',
    backgroundColor: 'transparent',
    minHeight: '24px',
    maxHeight: '120px',
    fontFamily: 'inherit',
    color: '#1a202c',
    fontWeight: '500',
  },
  button: {
    padding: '12px',
    backgroundColor: '#65a30d',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '44px',
    height: '44px',
    boxShadow: '0 4px 12px rgba(101, 163, 13, 0.3)',
  },
};

// Add CSS animations and enhanced hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-8px); opacity: 1; }
  }
  
  .dot:nth-child(1) { animation-delay: 0ms; }
  .dot:nth-child(2) { animation-delay: 200ms; }
  .dot:nth-child(3) { animation-delay: 400ms; }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  button:hover:not(:disabled)[style*="background-color: #ffffff"] {
    background-color: #f9fafb !important;
    border-color: #9ca3af !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
  
  button:hover:not(:disabled)[style*="background-color: #65a30d"] {
    background-color: #4d7c0f !important;
    box-shadow: 0 6px 16px rgba(101, 163, 13, 0.4) !important;
  }
  
  [style*="inputWrapper"]:focus-within {
    border-color: #65a30d !important;
    box-shadow: 0 0 0 4px rgba(101, 163, 13, 0.1) !important;
  }
  
  [style*="suggestionCard"]:hover {
    border-color: #65a30d !important;
    background-color: #f7fee7 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default Chatbot;