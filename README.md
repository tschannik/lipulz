# 365 Fish Facts (Featuring Philip)

A daily fish facts generator with suspiciously frequent Philip cameos. Some facts are real-ish. Some are "Philip made me say this." Use responsibly.

## Features

- **One new fact per hour**: Facts change every hour and persist within the same hour
- **365 unique facts**: Generated using a deterministic PRNG for consistent randomness
- **Responsive design**: Works beautifully on mobile and desktop
- **Dark mode support**: Automatically adapts to your system preferences
- **No dependencies**: Pure vanilla JavaScript, completely self-contained
- **Accessibility**: ARIA labels and semantic HTML for screen readers

## Development

The site consists of three simple files:
- `index.html` - Main HTML structure
- `styles.css` - All styling
- `script.js` - Fish facts logic

### Debug Keyboard Shortcuts

For testing purposes, the following keyboard shortcuts are available:
- `N` - Show next fact
- `P` - Show previous fact
- `R` - Reset to current hour's fact

## Deployment

### Docker

Build and run using Docker:

```bash
# Build the image
docker build -t fish-facts .

# Run the container
docker run -d -p 8080:80 --name fish-facts fish-facts

# Access at http://localhost:8080
```

### Docker Compose

Or use Docker Compose:

```bash
docker-compose up -d
```

### Manual Deployment

Simply upload `index.html`, `styles.css`, and `script.js` to any web server. No build process required.

## Technical Details

### Architecture
- **State Management**: Uses localStorage with versioning and error handling
- **PRNG**: Mulberry32 algorithm for deterministic randomness
- **Performance**: Optimized to generate only the needed fact instead of all 365
- **Security**: Proper HTML escaping using DOM methods (textContent)
- **Memory Management**: Timer cleanup on page unload

### Browser Support
- Modern browsers with ES6+ support
- CSS Grid and Flexbox
- CSS custom properties
- localStorage API

## Configuration

Constants in `script.js`:
- `PHILIP_FREQUENCY`: Probability of Philip commentary (default: 0.92)
- `PUN_FREQUENCY`: Probability of pun endings (default: 0.55)
- `SPICE_FREQUENCY`: Probability of extra humor (default: 0.35)
- `STATE_VERSION`: LocalStorage state version for migrations

## License

Created for lipulz.net. Philip did not fact-check any of this.
