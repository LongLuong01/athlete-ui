import API_BASE_URL from '../../config';

// Auth API calls
export const authApi = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  validateToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.ok;
  },
};

// Well-being API calls
export const wellbeingApi = {
  getAthleteReviews: async (athleteId, page, limit, token) => {
    const response = await fetch(
      `${API_BASE_URL}/api/wellbeing/athlete?athlete_id=${athleteId}&page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  createReview: async (reviewData, token) => {
    const response = await fetch(`${API_BASE_URL}/api/wellbeing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    return response.json();
  },
}; 