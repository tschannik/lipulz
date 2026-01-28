# 365 Fish Facts (Featuring Philip)

A daily fish facts generator with suspiciously frequent Philip cameos. Some facts are real-ish. Some are "Philip made me say this." Use responsibly.

## Features

### Core Features
- **One new fact per hour**: Facts change every hour and persist within the same hour
- **365 unique facts**: Generated using a deterministic PRNG for consistent randomness
- **Responsive design**: Works beautifully on mobile and desktop
- **Dark mode support**: Automatically adapts to your system preferences
- **No dependencies**: Pure vanilla JavaScript, completely self-contained
- **Accessibility**: ARIA labels and semantic HTML for screen readers

### New Interactive Features

#### 🔗 Share & Permalink
- Share facts to Twitter or Mastodon
- Copy fact link to clipboard
- Each fact has a unique URL (`#fact-42`) for direct linking
- Share specific facts with friends

#### 🎲 Random Fact Generator
- "I can't wait an hour" button for impatient users
- 5-minute cooldown to prevent spam
- Perfect for exploring the full collection

#### 📚 Fact Archive
- Browse all 365 facts in one place
- Search through facts by text or tag
- Mark favorites with ⭐
- Track which facts you've already seen
- Quick navigation to any fact

#### 📊 Statistics Dashboard
- Track total facts seen (out of 365)
- Count your favorite facts
- Monitor total time on site
- View your daily streak
- See your Philip exposure level

#### ⚙️ Customizable Settings

**Philip Intensity Slider**
- Control Philip frequency from 0% to 100%
- "Just Facts" mode: No Philip, only science
- "Maximum Philip" mode: Philip overload
- Dynamically adjusts fact generation

**Sound Effects**
- Optional bubble sounds
- Gentle "bloop" when fact changes
- Can be toggled on/off

**Theme Switcher**
7 beautiful themes to choose from:
- 🌊 **Default Ocean** - Classic blue vibes
- 🌑 **Deep Sea** - Dark, mysterious depths
- 🪸 **Coral Reef** - Warm, colorful tones
- 🧊 **Arctic Waters** - Cool, icy blues
- 👤 **Philip Mode** - Purple Philip-themed
- 🐟 **Salmon** - Coral pink tones
- 🦈 **Shark** - Sleek gray aesthetic

#### 🎁 Easter Eggs & Special Features

**Special Date Facts**
- April Fools' Day (4/1): Special silly fact
- Valentine's Day (2/14): Romantic fish fact
- Halloween (10/31): Spooky fish fact

**Ultra-Rare Philip Facts**
- 1% chance to encounter legendary Philip lore
- Marked with special styling
- Collect them all!

**Konami Code Secret**
- Enter the classic Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
- Activates "Philip Mode: MAXIMUM OVERDRIVE"
- Sets Philip intensity to 100%
- Try it and see what happens!

**The Millennium Fact** 🌌
- Legendary fact appearing once every 1000 hours
- Special announcement when it appears
- Unique styling and animation
- A rare treat for dedicated visitors

## Development

The site consists of three simple files:
- `index.html` - Main HTML structure with modals
- `styles.css` - All styling including themes
- `script.js` - Application logic and features

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
- **Modals**: Accessible modal system with keyboard support
- **Themes**: CSS custom properties for dynamic theming
- **Persistence**: All settings and stats saved to localStorage

### Browser Support
- Modern browsers with ES6+ support
- CSS Grid and Flexbox
- CSS custom properties
- localStorage API
- Web Audio API (for sound effects)
- Clipboard API (for sharing)

### State Persistence
The app saves the following to localStorage:
- Current fact index and seed
- User settings (sound, Philip intensity, theme)
- Statistics (facts seen, favorites, streak, time)
- Random fact cooldown timer
- Millennium fact status

### Data Migration
The app includes automatic migration for state version updates, ensuring smooth upgrades without data loss.

## Configuration

Constants in `script.js`:
- `DEFAULT_PHILIP_FREQUENCY`: Base Philip probability (default: 0.92)
- `PUN_FREQUENCY`: Probability of pun endings (default: 0.55)
- `SPICE_FREQUENCY`: Probability of extra humor (default: 0.35)
- `STATE_VERSION`: LocalStorage state version for migrations (current: 2)
- `RANDOM_FACT_COOLDOWN_MS`: Cooldown between random facts (default: 5 minutes)
- `MILLENNIUM_FACT_INTERVAL_HOURS`: Hours between millennium facts (default: 1000)

## Feature Breakdown

### Implemented Features
1. ✅ Share functionality (Twitter, Mastodon, clipboard)
2. ✅ Random fact button with cooldown timer
3. ✅ Fact permalinks with URL hash routing
4. ✅ Easter eggs (special dates, ultra-Philip, Konami code)
5. ✅ Sound effects toggle with bubble sounds
6. ✅ Philip intensity slider (0-100%)
7. ✅ Fact archive with search and favorites
8. ✅ Statistics dashboard with streaks
9. ✅ Theme switcher (7 themes)
10. ✅ Fact of the Millennium (every 1000 hours)

## Performance

- **Optimized fact generation**: Only generates the current fact, not all 365
- **Lazy rendering**: Archive facts generated on-demand
- **Efficient state management**: Minimal localStorage writes
- **CSS animations**: Hardware-accelerated transforms
- **Small footprint**: ~15KB CSS, ~20KB JS (unminified)

## Accessibility

- ARIA live regions for dynamic content
- Semantic HTML structure
- Keyboard navigation support
- High contrast theme support
- Screen reader friendly
- Focus management in modals

## Future Enhancement Ideas

- Progressive Web App (PWA) with offline support
- Push notifications for new facts
- User-generated Philip commentary
- API endpoint for third-party integrations
- Social features (comments, voting)
- Multiple languages support

## License

Created for lipulz.net. Philip did not fact-check any of this.

---

**Pro tip**: Try the Konami code for a surprise! 🎮
