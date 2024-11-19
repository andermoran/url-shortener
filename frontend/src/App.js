import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate and normalize the URL
  const validateAndNormalizeUrl = (url) => {
    // Regex for basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w.-]+)+(\.[a-z]{2,})(\/\S*)?$/i;
    if (!urlPattern.test(url)) {
      throw new Error('Please enter a valid URL (e.g., example.com, www.example.com)');
    }

    // Normalize the URL: Add "http://" if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }

    return url;
  };

  // Handle URL shortening
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setLoading(true);

    try {
      // Validate and normalize the URL
      const normalizedUrl = validateAndNormalizeUrl(originalUrl);

      // Make POST request to the backend API
      const response = await axios.post(`${BACKEND_URL}/api/shorten`, { originalUrl: normalizedUrl });
      setShortUrl(response.data.shortUrl); // Set the shortened URL
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text" // Use "text" for more flexible validation
          placeholder="Enter a URL to shorten (e.g., example.com)"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          style={{
            padding: '10px',
            width: '70%',
            fontSize: '16px',
            marginBottom: '10px',
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#007BFF',
            color: '#FFF',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {shortUrl && (
        <p>
          Shortened URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </p>
      )}
    </div>
  );
}

export default App;
  