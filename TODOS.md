## Feature Todos

### Achievements / Badges

- [x] Design and implement data model for achievements/badges (Early Fish, Ultra Philip Finder, Just the Facts) and persistence in localStorage.
- [x] Implement time- and behavior-based detection logic for unlocking achievements:
  - Early Fish – visited between 5–7am local time.
  - Ultra Philip Finder – saw all ultra-rare facts.
  - Just the Facts – 7 consecutive days at 0% Philip intensity.
- [ ] Surface unlocked badges in the Stats modal with icons and descriptions.
- [ ] Show a compact row of achievement icons near the header with tooltips.

### Deck / Collection View & Export/Import

- [ ] Design and implement a Favorites Deck/Collection view layout, reusing card styling and adding filters (tags, special/ultra/millennium).
- [ ] Implement filtering logic for the deck by tag, special dates, ultra, and millennium status.
- [ ] Add JSON export/import for favorites and stats in Settings, with validation and conflict-handling UX.

### Stats Clarity

- [ ] Add small info tooltips for each stat (Facts Seen, Favorites, Total Time, Streak, Philip Exposure) explaining their meaning.
- [ ] Add simple horizontal progress bars for Facts Seen and Streak in the Stats modal.

### Random Fact Cooldown UX

- [ ] Replace random fact alert-based cooldown with inline timer text and disabled button state under/inside the Random button.

### Modal UX & Toasts

- [ ] Add ESC key handling to close open modals consistently.
- [ ] Implement focus trapping within modals and restore focus to the triggering control on close.
- [ ] Implement a small toast notification system for non-blocking messages (share success, cooldown warnings) and replace alert() calls.
