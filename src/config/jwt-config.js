import jwtDecode from 'jwt-decode';

// Function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true; // No token means it's "expired" or invalid

  try {
    const decoded = jwtDecode(token); // Decode JWT
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if token's expiration time is less than current time
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Invalid token:', error);
    return true; // Treat invalid tokens as expired
  }
};


export default isTokenExpired;