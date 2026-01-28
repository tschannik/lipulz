// Constants
const STATE_VERSION = 1;
const HOUR_MS = 60 * 60 * 1000;
const COUNTDOWN_UPDATE_INTERVAL_MS = 1000;

// Probability thresholds for content generation
const PHILIP_FREQUENCY = 0.92;
const PUN_FREQUENCY = 0.55;
const SPICE_FREQUENCY = 0.35;

// Emoji pool for fact signatures
const FACT_EMOJIS = ['🫧', '🐟', '🐠', '🐡', '🌊', '🪸', '🦈'];

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
  // Real / real-ish fish facts (kept short). We'll remix them into 365 variations.
  { tag: 'Biology', text: 'Many fish use their lateral line to sense tiny vibrations in water.' },
  { tag: 'Oddity', text: 'Some fish can produce sounds by grinding teeth or vibrating muscles.' },
  { tag: 'Adaptation', text: 'Camouflage in fish is often about breaking up outlines, not turning invisible.' },
  { tag: 'Deep sea', text: 'Bioluminescence is common in the deep ocean, where sunlight never reaches.' },
  { tag: 'Behavior', text: 'Schooling helps fish confuse predators and save energy while swimming.' },
  { tag: 'Reef life', text: 'Cleaner fish eat parasites off larger fish, a tiny spa day under the sea.' },
  { tag: 'Survival', text: 'Some fish tolerate low oxygen by slowing metabolism or gulping air.' },
  { tag: 'Weird flex', text: 'Seahorses are fish, and the males carry the babies.' },
  {
    tag: 'Fun anatomy',
    text: 'Fish gills are efficient at extracting oxygen from water, which has far less O₂ than air.',
  },
  { tag: 'Navigation', text: 'Some fish can sense Earth's magnetic field for long-distance navigation.' },
  { tag: 'Speed', text: 'Streamlined bodies and powerful tails help fast fish reduce drag.' },
  { tag: 'Senses', text: 'Many sharks can detect weak electric fields from muscle movements.' },
  { tag: 'Growth', text: 'Fish scales can show growth rings, a bit like underwater tree trivia.' },
  {
    tag: 'Communication',
    text: 'Color changes in fish can signal mood, territory, or 'please stop nibbling me'.',
  },
  { tag: 'Habitat', text: 'Freshwater fish and saltwater fish manage water balance in opposite ways.' },
  {
    tag: 'Parenting',
    text: 'Some fish guard eggs aggressively; others go with the 'hope for the best' strategy.',
  },
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
  'Philip insists this is 'ocean-algebra'. Nobody asked.',
  'Philip calls this a 'fin-ancial tip'.',
  'Philip tried to high-five a fish. It was a low-fin.',
  'Philip says 'gills before bills'. He owns zero fish.',
  'Philip's ringtone is just bubble sounds. Commit to the bit.',
  'Philip heard this and immediately started a fish podcast.',
  'Philip wrote a novel about it: *The Codfather, Part Philip*.',
  'Philip was banned from the aquarium for whispering spoilers.',
  'Philip calls every fish 'Phil'. It's confusing in meetings.',
  'Philip claims he's 'part salmon' during tax season.',
  'Philip says this fact is 'reel'. He meant 'real'. He doubled down.',
  'Philip tried to teach a trout to sit. It did not sit.',
  'Philip once said 'I can do it, I'm a Pisces'. He is not.',
  'Philip says this is common knowledge in 'Phil-adelphia'. Incorrect ocean.',
  'Philip calls this 'finfluencer culture'.',
  'Philip says the sea is just soup with ambition.',
  'Philip tried to name a shark 'Mr. Chomp'. The shark declined.',
  'Philip swears this fact was peer-reviewed by dolphins. Source: vibes.',
  'Philip has a spreadsheet for this. Of course he does.',
  'Philip says the fish are unionizing. Respectfully.',
  'Philip asked 'is it gluten-free?' to a tuna. It swam away.',
];

const PUN_ENDINGS = [
  'Anyway, that's a-fin-ally all.',
  'No further questions. Just fins.',
  'Ocean: 1, Philip: 0.',
  'That's the whole tank.',
  'Do not try this at home unless you are a fish.',
  'This has been today's episode of 'Philip learns things late'.',
  'Please clap (quietly, we're underwater).',
  'Fin.',
  'We'll be right back after these messages from plankton.',
  'And that's the deep end of it.',
];

const EXTRA_SPICE = [
  'If you're reading this out loud, do a dramatic pause before 'Philip'.',
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

function remixFact(rng, base) {
  const openers = [
    'Fish fact:',
    'Underwater update:',
    'Today in 'wet science':',
    'Ocean bulletin:',
    'Field note from the Sea Department:',
    'Breaking news from the reef:',
    'Unnecessarily specific fish info:',
  ];

  const tweaks = [
    t => t,
    t => t.replace('Some', 'Certain').replace('many', 'a lot of'),
    t => t + ' Scientists call it adaptation; Philip calls it 'flexing'.',
    t => t + ' (Philip nodded like he understood.)',
    t => t + ' If you didn't know that, pretend you did. Philip will.',
    t => t + ' This is basically marine wizardry.',
  ];

  const t = pick(rng, tweaks)(base.text);
  const addPhilip = rng() < PHILIP_FREQUENCY;
  const addPun = rng() < PUN_FREQUENCY;
  const addSpice = rng() < SPICE_FREQUENCY;

  let out = `${pick(rng, openers)} ${t}`;
  if (addPhilip) out += ' ' + pick(rng, PHILIP_BITS);
  if (addSpice) out += ' ' + pick(rng, EXTRA_SPICE);
  if (addPun) out += ' ' + pick(rng, PUN_ENDINGS);
  return out;
}

// Optimized: Generate only the fact we need, not all 365
function generateSingleFact(seed, factNumber) {
  const rng = mulberry32(seed);

  // Advance RNG to the correct position for this fact number
  for (let i = 0; i < factNumber; i++) {
    rng(); // Skip ahead
    rng(); // For emoji selection
  }

  const base = BASE_FACTS[Math.floor(rng() * BASE_FACTS.length)];
  const text = remixFact(rng, base);
  const signature = FACT_EMOJIS[Math.floor(rng() * FACT_EMOJIS.length)];

  return {
    n: factNumber + 1,
    tag: base.tag,
    text: `${signature} ${text}`,
  };
}

const wrap = document.getElementById('wrap');
const countdownEl = document.getElementById('countdown');

let seed = Date.now() >>> 0;
let currentFactIndex = 0;
let factGeneratedAt = Date.now();
let timerInterval = null;

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
    };
    localStorage.setItem('fishFactsState', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state to localStorage:', e);
    // Silently fail - the app will still work without persistence
  }
}

function loadState() {
  try {
    const savedState = localStorage.getItem('fishFactsState');

    if (!savedState) {
      generateNewFact();
      return;
    }

    const state = JSON.parse(savedState);
    const currentHourStart = getHourStart();

    // Validate state version and check if we're in the same hour
    if (state.version === STATE_VERSION && state.hourStart === currentHourStart) {
      currentFactIndex = state.factIndex;
      seed = state.seed;
      factGeneratedAt = state.hourStart;
      return;
    }

    // Generate new fact for new hour or invalid state
    generateNewFact();
  } catch (e) {
    console.warn('Failed to load state from localStorage:', e);
    generateNewFact();
  }
}

function generateNewFact() {
  seed = Date.now() >>> 0;
  currentFactIndex = Math.floor(Math.random() * 365);
  factGeneratedAt = getHourStart();
  saveState();
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

function updateCountdown() {
  const now = Date.now();
  const nextHourStart = new Date(now);
  nextHourStart.setHours(nextHourStart.getHours() + 1);
  nextHourStart.setMinutes(0);
  nextHourStart.setSeconds(0);
  nextHourStart.setMilliseconds(0);

  const remaining = Math.max(0, nextHourStart.getTime() - now);

  countdownEl.textContent = `Next fact in: ${formatTime(remaining)}`;

  if (remaining === 0) {
    // Generate new fact for the new hour
    generateNewFact();
    render();
  }
}

function render() {
  wrap.innerHTML = '';
  const f = generateSingleFact(seed, currentFactIndex);

  if (f) {
    const card = document.createElement('section');
    card.className = 'card';

    // Extract emoji from start of text
    const emojiMatch = f.text.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*/u);
    const emoji = emojiMatch ? emojiMatch[1] : '🐟';
    const textWithoutEmoji = f.text.substring(emoji.length).trim();

    // Create elements for better security
    const metaDiv = document.createElement('div');
    metaDiv.className = 'meta';

    const numSpan = document.createElement('span');
    numSpan.className = 'num';
    numSpan.textContent = `#${String(f.n).padStart(3, '0')}`;

    const tagSpan = document.createElement('span');
    tagSpan.className = 'tag';
    tagSpan.textContent = f.tag;

    metaDiv.appendChild(numSpan);
    metaDiv.appendChild(tagSpan);

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
  }

  updateCountdown();
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

// Keyboard shortcuts for testing:
// Press 'N' for next fact, 'P' for previous fact, 'R' to reset to today's fact
document.addEventListener('keydown', e => {
  if (e.key === 'n' || e.key === 'N') {
    showNextFact();
  } else if (e.key === 'p' || e.key === 'P') {
    showPrevFact();
  } else if (e.key === 'r' || e.key === 'R') {
    generateNewFact();
    render();
  }
});

// Cleanup timer on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// Load saved state or generate new fact
loadState();

// Initial render
render();

// Update countdown every second
timerInterval = setInterval(updateCountdown, COUNTDOWN_UPDATE_INTERVAL_MS);
