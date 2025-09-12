// MapTiler geocoding service
const { Geocoding } = require('@maptiler/sdk');

// Create geocoding service with API key
const createGeocodingService = ({ apiKey }) => {
  Geocoding.apiKey = apiKey;
  
  return {
    forwardGeocode: (config) => {
      return {
        send: () => {
          return Geocoding.forward(config.query, {
            limit: config.limit || 5
          }).then(data => {
            return { body: data };
          });
        }
      };
    }
  };
};

module.exports = createGeocodingService;
