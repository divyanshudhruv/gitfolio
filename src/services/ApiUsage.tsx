import React, { useEffect, useState } from 'react';

// Define types for the API response
interface RateLimitResponse {
  resources: {
    core: {
      remaining: number;
      reset: number;
    };
  };
}

const ApiUsage: React.FC = () => {
  const [remainingRequests, setRemainingRequests] = useState<number | null>(null);
  const [resetTime, setResetTime] = useState<string | null>(null);

  const BASE_URL = 'https://api.github.com/rate_limit';

  // Function to fetch API usage
  const fetchApiUsage = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data: RateLimitResponse = await response.json(); // Type the response

      const remaining = data.resources.core.remaining;
      const resetTimestamp = data.resources.core.reset;

      const resetDate = new Date(resetTimestamp * 1000); // Convert reset time from UNIX timestamp

      setRemainingRequests(remaining);
      setResetTime(resetDate.toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching API usage:', error);
    }
  };

  // Fetch the API usage when the component mounts
  useEffect(() => {
    fetchApiUsage();

    // Optionally, refresh it every minute
    const interval = setInterval(fetchApiUsage, 60000);

    // Cleanup the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 17,
      right: 17,
      whiteSpace: 'pre',
      justifyContent: 'center',
      fontFamily: 'monospace',
      fontSize: '100%',
      fontWeight: 'lighter',
      color: '#7F869180',
      textAlign: 'center',
      padding: '10px',
      border: '1px solid #1C1F25',
      borderRadius: '5px',
      backgroundColor: '#0d1117',
    }}>
      {remainingRequests !== null && resetTime !== null ? (
        <>
          <p>API Remaining: {remainingRequests}</p>
          <p>Reset Time: {resetTime}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ApiUsage;
