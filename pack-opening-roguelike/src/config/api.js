// API Configuration
export const API_CONFIG = {
  // Use environment variable if available, otherwise default to production
  baseUrl: import.meta.env.VITE_CREATURE_API_URL || 'https://creaturesbackend.vercel.app',
  endpoints: {
    getCard: '/api/getCard',
    getCards: '/api/getCards',
    breed: '/api/getDBCreatureFusion'
  },
  maxCardIds: 50
};