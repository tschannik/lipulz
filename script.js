// Constants
const STATE_VERSION = 2; // Bumped for new features
const HOUR_MS = 60 * 60 * 1000;
const COUNTDOWN_UPDATE_INTERVAL_MS = 1000;
const RANDOM_FACT_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const MILLENNIUM_FACT_INTERVAL_HOURS = 1000;

// Probability thresholds for content generation
const DEFAULT_PHILIP_FREQUENCY = 0.92;
const PUN_FREQUENCY = 0.55;
const SPICE_FREQUENCY = 0.35;

// Emoji pool for fact signatures
const FACT_EMOJIS = ['🫧', '🐟', '🐠', '🐡', '🌊', '🪸', '🦈'];

// Ultra-rare Philip facts (Easter eggs)
const ULTRA_PHILIP_FACTS = [
  {
    tag: 'Philip Lore',
    text: '🎭 ULTRA RARE: Philip once convinced an entire aquarium that he was their manager. He lasted 3 hours before someone asked for credentials.',
  },
  {
    tag: 'Philip Legend',
    text: '✨ LEGENDARY: Philip claims he can speak to fish. The fish have filed a restraining order.',
  },
  {
    tag: 'Philip Mystery',
    text: '🌟 MYTHICAL: Scientists discovered a new fish species and Philip immediately trademarked the name "Phil-tropicalis". The scientists were not amused.',
  },
];

// Special date facts
const SPECIAL_DATE_FACTS = {
  '04-01': {
    tag: 'April Fools',
    text: '🃏 Fish are actually just underwater birds that forgot how to fly. Philip insists this is peer-reviewed.',
  },
  '02-14': {
    tag: 'Valentine\'s',
    text: '💕 Clownfish are monogamous and mate for life. Philip tried this approach. He is now banned from three dating apps.',
  },
  '10-31': {
    tag: 'Spooky',
    text: '👻 Deep sea fish look terrifying because they evolved in darkness. Philip looks terrifying because he cuts his own hair.',
  },
};

// The legendary Millennium Fact
const MILLENNIUM_FACT = {
  tag: 'MILLENNIUM',
  text: '🌌 THE PROPHECY HAS BEEN FULFILLED: Philip has finally understood what fish are. Just kidding, he still thinks they\'re "wet puppies". This fact only appears once every 1000 hours. You are blessed. Or cursed. Hard to say.',
};

// Sound effects as data URIs
const SOUNDS = {
  bubble: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==',
  bloop: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==',
};

// A tiny deterministic PRNG so "reshuffle" feels different but stable per seed.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE_FACTS = [
  { tag: 'Biology', text: 'Many fish use their lateral line to sense tiny vibrations in water.' },
  { tag: 'Oddity', text: 'Some fish can produce sounds by grinding teeth or vibrating muscles.' },
  { tag: 'Adaptation', text: 'Camouflage in fish is often about breaking up outlines, not turning invisible.' },
  { tag: 'Deep sea', text: 'Bioluminescence is common in the deep ocean, where sunlight never reaches.' },
  { tag: 'Behavior', text: 'Schooling helps fish confuse predators and save energy while swimming.' },
  { tag: 'Reef life', text: 'Cleaner fish eat parasites off larger fish, a tiny spa day under the sea.' },
  { tag: 'Survival', text: 'Some fish tolerate low oxygen by slowing metabolism or gulping air.' },
  { tag: 'Weird flex', text: 'Seahorses are fish, and the males carry the babies.' },
  { tag: 'Fun anatomy', text: 'Fish gills are efficient at extracting oxygen from water, which has far less O₂ than air.' },
  { tag: 'Navigation', text: 'Some fish can sense Earth\'s magnetic field for long-distance navigation.' },
  { tag: 'Speed', text: 'Streamlined bodies and powerful tails help fast fish reduce drag.' },
  { tag: 'Senses', text: 'Many sharks can detect weak electric fields from muscle movements.' },
  { tag: 'Growth', text: 'Fish scales can show growth rings, a bit like underwater tree trivia.' },
  { tag: 'Communication', text: 'Color changes in fish can signal mood, territory, or \'please stop nibbling me\'.' },
  { tag: 'Habitat', text: 'Freshwater fish and saltwater fish manage water balance in opposite ways.' },
  { tag: 'Parenting', text: 'Some fish guard eggs aggressively; others go with the \'hope for the best\' strategy.' },
  { tag: 'Diet', text: 'Not all fish eat smaller fish: many graze algae, plankton, or tiny invertebrates.' },
  { tag: 'Temperature', text: 'Most fish are ectotherms, so water temperature strongly affects their activity.' },
  { tag: 'Shape', text: 'Flatfish start life symmetrical and later one eye migrates to the other side.' },
  { tag: 'Reproduction', text: 'Some fish change sex during their lifetime, depending on social structure.' },
  { tag: 'Extreme', text: 'Some fish survive freezing conditions by producing antifreeze-like proteins.' },
  { tag: 'Jaw drop', text: 'Moray eels have a second set of jaws that help pull prey inward.' },
  { tag: 'Color', text: 'In many fish, red light disappears first underwater, so reds look dark at depth.' },
  { tag: 'Migration', text: 'Salmon can return to their birthplace using smell like a GPS with feelings.' },
  { tag: 'Tool time', text: 'Some fish use tools, like wrasses that smash shellfish against rocks.' },
  { tag: 'Records', text: 'Oceans contain more species of fish than any other vertebrate group.' },
];

const PHILIP_BITS = [
  'Philip insists this is \'ocean-algebra\'. Nobody asked.',
  'Philip calls this a \'fin-ancial tip\'.',
  'Philip tried to high-five a fish. It was a low-fin.',
  'Philip says \'gills before bills\'. He owns zero fish.',
  'Philip\'s ringtone is just bubble sounds. Commit to the bit.',
  'Philip heard this and immediately started a fish podcast.',
  'Philip wrote a novel about it: *The Codfather, Part Philip*.',
  'Philip was banned from the aquarium for whispering spoilers.',
  'Philip calls every fish \'Phil\'. It\'s confusing in meetings.',
  'Philip claims he\'s \'part salmon\' during tax season.',
  'Philip says this fact is \'reel\'. He meant \'real\'. He doubled down.',
  'Philip tried to teach a trout to sit. It did not sit.',
  'Philip once said \'I can do it, I\'m a Pisces\'. He is not.',
  'Philip says this is common knowledge in \'Phil-adelphia\'. Incorrect ocean.',
  'Philip calls this \'finfluencer culture\'.',
  'Philip says the sea is just soup with ambition.',
  'Philip tried to name a shark \'Mr. Chomp\'. The shark declined.',
  'Philip swears this fact was peer-reviewed by dolphins. Source: vibes.',
  'Philip has a spreadsheet for this. Of course he does.',
  'Philip says the fish are unionizing. Respectfully.',
  'Philip asked \'is it gluten-free?\' to a tuna. It swam away.',
];

const PUN_ENDINGS = [
  'Anyway, that\'s a-fin-ally all.',
  'No further questions. Just fins.',
  'Ocean: 1, Philip: 0.',
  'That\'s the whole tank.',
  'Do not try this at home unless you are a fish.',
  'This has been today\'s episode of \'Philip learns things late\'.',
  'Please clap (quietly, we\'re underwater).',
  'Fin.',
  'We\'ll be right back after these messages from plankton.',
  'And that\'s the deep end of it.',
];

const EXTRA_SPICE = [
  'If you\'re reading this out loud, do a dramatic pause before \'Philip\'.',
  'This fact pairs well with a serious face and zero context.',
  'A fish heard you judging and is now swimming with purpose.',
  'Somewhere, a sardine is rolling its eyes.',
  'Aquariums hate this one weird Philip.',
  'Nature is beautiful and also kinda unhinged.',
  'This is why the ocean gets invited to all the parties.',
];

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function remixFact(rng, base, philipIntensity = DEFAULT_PHILIP_FREQUENCY) {
  const openers = [
    'Fish fact:',
    'Underwater update:',
    'Today in \'wet science\':',
    'Ocean bulletin:',
    'Field note from the Sea Department:',
    'Breaking news from the reef:',
    'Unnecessarily specific fish info:',
  ];

  const tweaks = [
    t => t,
    t => t.replace('Some', 'Certain').replace('many', 'a lot of'),
    t => t + ' Scientists call it adaptation; Philip calls it \'flexing\'.',
    t => t + ' (Philip nodded like he understood.)',
    t => t + ' If you didn\'t know that, pretend you did. Philip will.',
    t => t + ' This is basically marine wizardry.',
  ];

  const t = pick(rng, tweaks)(base.text);
  const addPhilip = rng() < philipIntensity;
  const addPun = rng() < PUN_FREQUENCY;
  const addSpice = rng() < SPICE_FREQUENCY;

  let out = `${pick(rng, openers)} ${t}`;
  if (addPhilip) out += ' ' + pick(rng, PHILIP_BITS);
  if (addSpice) out += ' ' + pick(rng, EXTRA_SPICE);
  if (addPun) out += ' ' + pick(rng, PUN_ENDINGS);
  return out;
}

// Generate only the fact we need
function generateSingleFact(seed, factNumber, philipIntensity = DEFAULT_PHILIP_FREQUENCY) {
  const rng = mulberry32(seed);

  // Advance RNG to the correct position
  for (let i = 0; i < factNumber; i++) {
    rng();
    rng();
  }

  const base = BASE_FACTS[Math.floor(rng() * BASE_FACTS.length)];
  const text = remixFact(rng, base, philipIntensity);
  const signature = FACT_EMOJIS[Math.floor(rng() * FACT_EMOJIS.length)];

  return {
    n: factNumber + 1,
    tag: base.tag,
    text: `${signature} ${text}`,
  };
}

// Check if it's time for the Millennium Fact
function isMillenniumHour() {
  const hoursSinceEpoch = Math.floor(Date.now() / HOUR_MS);
  return hoursSinceEpoch % MILLENNIUM_FACT_INTERVAL_HOURS === 0;
}

// Get special fact for today's date
function getSpecialDateFact() {
  const now = new Date();
  const key = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return SPECIAL_DATE_FACTS[key];
}

// Check for ultra-rare Philip fact (1% chance)
function getUltraPhilipFact(rng) {
  if (rng() < 0.01) {
    return ULTRA_PHILIP_FACTS[Math.floor(rng() * ULTRA_PHILIP_FACTS.length)];
  }
  return null;
}

// State management (initialized after DOM loads)
let wrap;
let countdownEl;

let seed = Date.now() >>> 0;
let currentFactIndex = 0;
let factGeneratedAt = Date.now();
let timerInterval = null;
let settings = {
  soundEnabled: false,
  philipIntensity: DEFAULT_PHILIP_FREQUENCY,
  theme: 'default',
};
let stats = {
  factsSeen: [],
  favorites: [],
  totalTimeMs: 0,
  lastVisit: Date.now(),
  streak: 0,
  sessionStart: Date.now(),
};
let randomFactCooldownUntil = 0;
let konamiCode = [];
let millenniumFactShown = false;

function getHourStart() {
  const now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now.getTime();
}

// LocalStorage with error handling
function saveState() {
  try {
    const state = {
      version: STATE_VERSION,
      factIndex: currentFactIndex,
      seed: seed,
      hourStart: factGeneratedAt,
      settings: settings,
      stats: stats,
      randomFactCooldownUntil: randomFactCooldownUntil,
      millenniumFactShown: millenniumFactShown,
    };
    localStorage.setItem('fishFactsState', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state to localStorage:', e);
  }
}

function loadState() {
  try {
    const savedState = localStorage.getItem('fishFactsState');

    if (!savedState) {
      generateNewFact();
      updateStreak();
      return;
    }

    const state = JSON.parse(savedState);
    const currentHourStart = getHourStart();

    // Migrate from older versions
    if (state.version < STATE_VERSION) {
      console.log('Migrating state from version', state.version, 'to', STATE_VERSION);
      // Initialize new fields with defaults
      if (!state.settings) state.settings = settings;
      if (!state.stats) state.stats = stats;
    }

    // Restore settings and stats
    settings = { ...settings, ...state.settings };
    stats = { ...stats, ...state.stats };
    randomFactCooldownUntil = state.randomFactCooldownUntil || 0;
    millenniumFactShown = state.millenniumFactShown || false;

    // Check if we're in the same hour
    if (state.hourStart === currentHourStart) {
      currentFactIndex = state.factIndex;
      seed = state.seed;
      factGeneratedAt = state.hourStart;
    } else {
      generateNewFact();
    }

    updateStreak();
    applyTheme(settings.theme);
  } catch (e) {
    console.warn('Failed to load state from localStorage:', e);
    generateNewFact();
    updateStreak();
  }
}

function generateNewFact() {
  // Check for Millennium Fact first
  if (isMillenniumHour() && !millenniumFactShown) {
    // Special handling for millennium fact
    currentFactIndex = -1; // Special marker
    millenniumFactShown = true;
    factGeneratedAt = getHourStart();
    seed = Date.now() >>> 0;
    saveState();
    return;
  }

  millenniumFactShown = false; // Reset for next millennium
  seed = Date.now() >>> 0;
  currentFactIndex = Math.floor(Math.random() * 365);
  factGeneratedAt = getHourStart();
  saveState();
}

function updateStreak() {
  const now = Date.now();
  const lastVisitDate = new Date(stats.lastVisit).toDateString();
  const todayDate = new Date(now).toDateString();

  if (lastVisitDate !== todayDate) {
    const dayDiff = Math.floor((now - stats.lastVisit) / (24 * 60 * 60 * 1000));
    if (dayDiff === 1) {
      stats.streak += 1;
    } else if (dayDiff > 1) {
      stats.streak = 1;
    }
    stats.lastVisit = now;
    saveState();
  }
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

function playSound(soundName) {
  if (!settings.soundEnabled) return;
  try {
    const audio = new Audio(SOUNDS[soundName] || SOUNDS.bubble);
    audio.volume = 0.3;
    audio.play().catch(e => console.warn('Sound play failed:', e));
  } catch (e) {
    console.warn('Sound error:', e);
  }
}

function updateCountdown() {
  if (!countdownEl) return;

  const now = Date.now();
  const nextHourStart = new Date(now);
  nextHourStart.setHours(nextHourStart.getHours() + 1);
  nextHourStart.setMinutes(0);
  nextHourStart.setSeconds(0);
  nextHourStart.setMilliseconds(0);

  const remaining = Math.max(0, nextHourStart.getTime() - now);
  countdownEl.textContent = `Next fact in: ${formatTime(remaining)}`;

  // Check if millennium fact countdown is relevant
  if (isMillenniumHour() && !millenniumFactShown) {
    const millenniumIndicator = document.getElementById('millennium-indicator');
    if (millenniumIndicator) {
      millenniumIndicator.classList.remove('hidden');
    }
  }

  if (remaining === 0) {
    generateNewFact();
    playSound('bloop');
    render();
  }
}

function getCurrentFact() {
  // Check for Millennium Fact
  if (currentFactIndex === -1) {
    return {
      n: 1000,
      tag: MILLENNIUM_FACT.tag,
      text: MILLENNIUM_FACT.text,
      isMillennium: true,
    };
  }

  // Check for special date fact
  const specialFact = getSpecialDateFact();
  if (specialFact) {
    return {
      n: currentFactIndex + 1,
      tag: specialFact.tag,
      text: specialFact.text,
      isSpecial: true,
    };
  }

  // Check for ultra-rare Philip fact
  const rng = mulberry32(seed + currentFactIndex);
  const ultraFact = getUltraPhilipFact(rng);
  if (ultraFact) {
    return {
      n: currentFactIndex + 1,
      tag: ultraFact.tag,
      text: ultraFact.text,
      isUltra: true,
    };
  }

  // Regular fact
  return generateSingleFact(seed, currentFactIndex, settings.philipIntensity);
}

function render() {
  if (!wrap) return;
  wrap.innerHTML = '';
  const f = getCurrentFact();

  // Track fact in stats
  if (!stats.factsSeen.includes(f.n)) {
    stats.factsSeen.push(f.n);
    saveState();
  }

  if (f) {
    const card = document.createElement('section');
    card.className = 'card';
    if (f.isMillennium) card.classList.add('millennium-card');
    if (f.isUltra) card.classList.add('ultra-card');

    // Extract emoji from start of text
    const emojiMatch = f.text.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*/u);
    const emoji = emojiMatch ? emojiMatch[1] : '🐟';
    const textWithoutEmoji = f.text.substring(emoji.length).trim();

    const metaDiv = document.createElement('div');
    metaDiv.className = 'meta';

    const numSpan = document.createElement('span');
    numSpan.className = 'num';
    numSpan.textContent = `#${String(f.n).padStart(3, '0')}`;

    const tagSpan = document.createElement('span');
    tagSpan.className = 'tag';
    tagSpan.textContent = f.tag;

    // Favorite button
    const favBtn = document.createElement('button');
    favBtn.className = 'fav-btn';
    favBtn.innerHTML = stats.favorites.includes(f.n) ? '⭐' : '☆';
    favBtn.title = 'Toggle favorite';
    favBtn.onclick = () => toggleFavorite(f.n);

    // Share button
    const shareBtn = document.createElement('button');
    shareBtn.className = 'share-btn';
    shareBtn.innerHTML = '🔗';
    shareBtn.title = 'Share';
    shareBtn.onclick = () => showShareModal(f);

    metaDiv.appendChild(numSpan);
    metaDiv.appendChild(tagSpan);
    metaDiv.appendChild(favBtn);
    metaDiv.appendChild(shareBtn);

    const contentDiv = document.createElement('div');
    contentDiv.style.display = 'flex';
    contentDiv.style.gap = '12px';
    contentDiv.style.alignItems = 'flex-start';

    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'emoji';
    emojiSpan.textContent = emoji;

    const factP = document.createElement('p');
    factP.className = 'fact';
    factP.textContent = textWithoutEmoji;

    contentDiv.appendChild(emojiSpan);
    contentDiv.appendChild(factP);

    const tinyDiv = document.createElement('div');
    tinyDiv.className = 'tiny';
    tinyDiv.textContent = 'Philip did not fact-check this. The fish refuse to comment.';

    card.appendChild(metaDiv);
    card.appendChild(contentDiv);
    card.appendChild(tinyDiv);

    wrap.appendChild(card);

    // Update URL hash for permalink
    updatePermalink(f.n);
  }

  updateCountdown();
  updateStatsDisplay();
}

function toggleFavorite(factNum) {
  const idx = stats.favorites.indexOf(factNum);
  if (idx > -1) {
    stats.favorites.splice(idx, 1);
  } else {
    stats.favorites.push(factNum);
  }
  saveState();
  render();
}

function updatePermalink(factNum) {
  const newHash = `#fact-${factNum}`;
  if (window.location.hash !== newHash) {
    history.replaceState(null, '', newHash);
  }
}

function loadFromPermalink() {
  const hash = window.location.hash;
  if (hash.startsWith('#fact-')) {
    const factNum = parseInt(hash.substring(6));
    if (factNum >= 1 && factNum <= 365) {
      currentFactIndex = factNum - 1;
      render();
    }
  } else if (hash === '#konami') {
    activateKonamiMode();
  }
}

// Share modal functionality
function showShareModal(fact) {
  const modal = document.getElementById('share-modal');
  const factText = fact.text.replace(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*/u, '');
  const url = `${window.location.origin}${window.location.pathname}#fact-${fact.n}`;

  document.getElementById('share-twitter').onclick = () => {
    const text = encodeURIComponent(`${factText}\n\n#FishFacts`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
  };

  document.getElementById('share-mastodon').onclick = () => {
    const text = encodeURIComponent(`${factText}\n\n${url}`);
    const instance = prompt('Enter your Mastodon instance (e.g., mastodon.social):');
    if (instance) {
      window.open(`https://${instance}/share?text=${text}`, '_blank');
    }
  };

  document.getElementById('share-copy').onclick = () => {
    navigator.clipboard.writeText(`${factText}\n\n${url}`).then(() => {
      alert('Copied to clipboard!');
      modal.classList.add('hidden');
    });
  };

  modal.classList.remove('hidden');
}

function closeShareModal() {
  const modal = document.getElementById('share-modal');
  if (modal) modal.classList.add('hidden');
}

// Random fact with cooldown
function showRandomFact() {
  try {
    const now = Date.now();
    if (now < randomFactCooldownUntil) {
      const remaining = Math.ceil((randomFactCooldownUntil - now) / 1000);
      alert(`Please wait ${remaining} seconds before generating another random fact.`);
      return;
    }

    currentFactIndex = Math.floor(Math.random() * 365);
    randomFactCooldownUntil = now + RANDOM_FACT_COOLDOWN_MS;
    playSound('bloop');
    saveState();
    render();
    updateRandomButtonState();
  } catch (error) {
    console.error('Error showing random fact:', error);
  }
}

function updateRandomButtonState() {
  const btn = document.getElementById('random-fact-btn');
  if (!btn) return;

  const now = Date.now();
  if (now < randomFactCooldownUntil) {
    btn.disabled = true;
    btn.textContent = `Cooldown: ${Math.ceil((randomFactCooldownUntil - now) / 1000)}s`;
    setTimeout(updateRandomButtonState, 1000);
  } else {
    btn.disabled = false;
    btn.textContent = '🎲 Random Fact';
  }
}

// Archive modal
function showArchive() {
  try {
    const modal = document.getElementById('archive-modal');
    const archiveContent = document.getElementById('archive-content');
    const archiveSearch = document.getElementById('archive-search');

    if (!modal || !archiveContent || !archiveSearch) {
      console.error('Archive elements not found');
      return;
    }

    archiveContent.innerHTML = '';
    const search = archiveSearch.value.toLowerCase();

  // Show all facts
  for (let i = 0; i < 365; i++) {
    const fact = generateSingleFact(seed, i, settings.philipIntensity);
    const factText = fact.text.toLowerCase();

    if (search && !factText.includes(search) && !fact.tag.toLowerCase().includes(search)) {
      continue;
    }

    const item = document.createElement('div');
    item.className = 'archive-item';
    if (stats.factsSeen.includes(fact.n)) item.classList.add('seen');
    if (stats.favorites.includes(fact.n)) item.classList.add('favorite');

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.marginBottom = '8px';

    const title = document.createElement('strong');
    title.textContent = `#${String(fact.n).padStart(3, '0')} - ${fact.tag}`;

    const favIcon = document.createElement('span');
    favIcon.textContent = stats.favorites.includes(fact.n) ? '⭐' : '';
    favIcon.style.cursor = 'pointer';
    favIcon.onclick = () => {
      toggleFavorite(fact.n);
      showArchive();
    };

    header.appendChild(title);
    header.appendChild(favIcon);

    const text = document.createElement('p');
    text.textContent = fact.text;
    text.style.margin = '0';
    text.style.fontSize = '0.9rem';

    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View';
    viewBtn.className = 'btn-small';
    viewBtn.style.marginTop = '8px';
    viewBtn.onclick = () => {
      currentFactIndex = i;
      render();
      closeArchive();
    };

    item.appendChild(header);
    item.appendChild(text);
    item.appendChild(viewBtn);

    archiveContent.appendChild(item);
  }

  modal.classList.remove('hidden');
  } catch (error) {
    console.error('Error showing archive:', error);
  }
}

function closeArchive() {
  const modal = document.getElementById('archive-modal');
  if (modal) modal.classList.add('hidden');
}

// Stats modal
function showStats() {
  try {
    const modal = document.getElementById('stats-modal');
    if (!modal) {
      console.error('Stats modal not found');
      return;
    }
    modal.classList.remove('hidden');
    updateStatsDisplay();
  } catch (error) {
    console.error('Error showing stats:', error);
  }
}

function closeStats() {
  const modal = document.getElementById('stats-modal');
  if (modal) modal.classList.add('hidden');
}

function updateStatsDisplay() {
  const totalSeen = stats.factsSeen.length;
  const totalFavorites = stats.favorites.length;
  const sessionTime = Date.now() - stats.sessionStart;
  const totalTime = stats.totalTimeMs + sessionTime;
  const philipExposure = Math.round(settings.philipIntensity * 100);

  const statSeen = document.getElementById('stat-seen');
  const statFavorites = document.getElementById('stat-favorites');
  const statTime = document.getElementById('stat-time');
  const statStreak = document.getElementById('stat-streak');
  const statPhilip = document.getElementById('stat-philip');

  if (statSeen) statSeen.textContent = `${totalSeen} / 365`;
  if (statFavorites) statFavorites.textContent = totalFavorites;
  if (statTime) statTime.textContent = formatTime(totalTime);
  if (statStreak) statStreak.textContent = `${stats.streak} days`;
  if (statPhilip) statPhilip.textContent = `${philipExposure}%`;
}

// Settings modal
function showSettings() {
  try {
    const modal = document.getElementById('settings-modal');
    const soundToggle = document.getElementById('sound-toggle');
    const philipSlider = document.getElementById('philip-slider');
    const philipValue = document.getElementById('philip-value');
    const themeSelect = document.getElementById('theme-select');

    if (!modal) {
      console.error('Settings modal not found');
      return;
    }

    if (soundToggle) soundToggle.checked = settings.soundEnabled;
    if (philipSlider) philipSlider.value = settings.philipIntensity * 100;
    if (philipValue) philipValue.textContent = `${Math.round(settings.philipIntensity * 100)}%`;
    if (themeSelect) themeSelect.value = settings.theme;

    modal.classList.remove('hidden');
  } catch (error) {
    console.error('Error showing settings:', error);
  }
}

function closeSettings() {
  const modal = document.getElementById('settings-modal');
  if (modal) modal.classList.add('hidden');
  saveState();
}

function updatePhilipIntensity(value) {
  try {
    settings.philipIntensity = value / 100;
    const philipValue = document.getElementById('philip-value');
    if (philipValue) {
      philipValue.textContent = `${Math.round(value)}%`;
    }
    // Regenerate current fact with new intensity
    render();
  } catch (error) {
    console.error('Error updating Philip intensity:', error);
  }
}

function toggleSound() {
  try {
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      settings.soundEnabled = soundToggle.checked;
      if (settings.soundEnabled) {
        playSound('bubble');
      }
    }
  } catch (error) {
    console.error('Error toggling sound:', error);
  }
}

function changeTheme(themeName) {
  settings.theme = themeName;
  applyTheme(themeName);
}

function applyTheme(themeName) {
  document.body.className = `theme-${themeName}`;
}

// Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function checkKonamiCode(key) {
  konamiCode.push(key);
  if (konamiCode.length > KONAMI_SEQUENCE.length) {
    konamiCode.shift();
  }

  if (konamiCode.join(',') === KONAMI_SEQUENCE.join(',')) {
    activateKonamiMode();
    konamiCode = [];
  }
}

function activateKonamiMode() {
  alert('🎮 KONAMI CODE ACTIVATED! Philip mode: MAXIMUM OVERDRIVE! 🐟');
  settings.philipIntensity = 1.0;
  saveState();
  render();
  window.location.hash = '#konami';
}

// Hidden test controls
function showNextFact() {
  currentFactIndex = (currentFactIndex + 1) % 365;
  render();
}

function showPrevFact() {
  currentFactIndex = (currentFactIndex - 1 + 365) % 365;
  render();
}

// Event listeners
document.addEventListener('keydown', e => {
  checkKonamiCode(e.key.toLowerCase());

  // Debug shortcuts
  if (e.key === 'n' || e.key === 'N') {
    showNextFact();
  } else if (e.key === 'p' || e.key === 'P') {
    showPrevFact();
  } else if (e.key === 'r' || e.key === 'R') {
    generateNewFact();
    render();
  }
});

window.addEventListener('hashchange', loadFromPermalink);

window.addEventListener('beforeunload', () => {
  // Save total time
  stats.totalTimeMs += Date.now() - stats.sessionStart;
  saveState();

  // Cleanup timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// Click outside modal to close
window.onclick = (event) => {
  if (event.target.classList.contains('modal')) {
    event.target.classList.add('hidden');
  }
};

// Initialize when DOM is ready
function init() {
  try {
    // Get DOM elements
    wrap = document.getElementById('wrap');
    countdownEl = document.getElementById('countdown');

    if (!wrap || !countdownEl) {
      console.error('Required DOM elements not found');
      return;
    }

    // Initialize application
    loadState();
    loadFromPermalink();
    render();
    updateRandomButtonState();
    timerInterval = setInterval(updateCountdown, COUNTDOWN_UPDATE_INTERVAL_MS);
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
