# 🌤️ Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from the OpenWeatherMap API.

## Features

✨ **Current Weather Information**
- Temperature, humidity, pressure
- Wind speed and direction
- Visibility and cloudiness
- UV Index
- Weather condition with icons
- Sunrise and sunset times

📅 **5-Day Forecast**
- Daily weather predictions
- Temperature and condition icons
- Humidity levels

⏰ **24-Hour Hourly Forecast**
- Hour-by-hour predictions
- Temperature trends
- Weather conditions

🔍 **City Search**
- Search by city name
- Auto-suggestions dropdown
- GPS location detection
- Search history with quick access

🎨 **Modern Design**
- Gradient background
- Smooth animations
- Responsive layout (Mobile, Tablet, Desktop)
- Weather-themed UI

## Getting Started

### Prerequisites
- Modern web browser
- Internet connection
- Free API key from [OpenWeatherMap](https://openweathermap.org/api)

### Setup

1. Get a free API key:
   - Visit [OpenWeatherMap API](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key from the API keys section

2. Replace the API key in `script.js`:
   ```javascript
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```

3. Open `index.html` in your web browser

## Usage

### Search by City
1. Enter a city name in the search box
2. Press Enter or click the search button
3. View the weather data for that location

### Use Current Location
1. Click the GPS button (📍)
2. Allow location access when prompted
3. Weather for your location will load automatically

### View Search History
- Recent searches appear at the bottom
- Click any recent search to quickly reload that location

## API Endpoints Used

- **Current Weather**: `/weather`
- **Forecast**: `/forecast`
- **Weather Find**: `/find`

## File Structure

```
weather/
├── index.html      # HTML structure
├── styles.css      # Styling and animations
├── script.js       # JavaScript logic and API calls
└── README.md       # This file
```

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, Animations
- **JavaScript (ES6)** - Async/Await, Fetch API
- **OpenWeatherMap API** - Weather data
- **Font Awesome** - Icons

## Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Features Breakdown

### Current Weather Display
- Large temperature display
- Weather condition with icon
- Feels-like temperature
- Humidity and pressure
- Wind speed and direction
- Visibility
- Sunrise and sunset times

### Forecast Data
- 5-day weather forecast
- 24-hour hourly predictions
- Temperature ranges
- Humidity information

### User Experience
- Geolocation support
- Search suggestions
- Search history with localStorage
- Loading indicators
- Error handling
- Responsive design
- Smooth animations

## API Rate Limits

Free tier: 60 API calls/minute

Optimizations implemented:
- Results are cached in search history
- No duplicate requests for same city
- Efficient data fetching

## Customization

### Change Temperature Unit
Modify in API calls:
```javascript
// For Fahrenheit
`${WEATHER_API_BASE}/weather?q=${city}&units=imperial&appid=${API_KEY}`

// For Kelvin
`${WEATHER_API_BASE}/weather?q=${city}&units=standard&appid=${API_KEY}`
```

### Modify Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... more colors ... */
}
```

## Troubleshooting

**No data showing?**
- Check if API key is valid
- Verify internet connection
- Check browser console for errors

**Geolocation not working?**
- Ensure HTTPS connection (on production)
- Allow location access in browser settings
- Some browsers require user interaction

**Search suggestions not working?**
- Check API rate limits
- Verify city name spelling
- Try different search terms

## Future Enhancements

- [ ] Multiple location tracking
- [ ] Weather alerts and warnings
- [ ] Radar and satellite imagery
- [ ] Air quality information
- [ ] Theme customization (Dark/Light mode)
- [ ] Detailed weather graphs
- [ ] Weather comparison between cities
- [ ] Push notifications

## License

Free to use and modify

## Author

Created with ❤️ for weather enthusiasts

## Support

For issues or suggestions, please check:
- [OpenWeatherMap Documentation](https://openweathermap.org/api)
- Browser console for error messages
- Your API rate limits
