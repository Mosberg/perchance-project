// Enhanced NSFW implementation with configurable explicitness
const NSFW_CONFIG = {
  levels: ['off', 'suggestive', 'explicit'],
  defaultLevel: 'explicit',
  portraitOptions: {
    poses: ['provocative', 'seductive', 'dominant', 'submissive', 'casual'],
    clothingStates: ['fully clothed', 'partially clothed', 'nude'],
    arousalLevels: ['none', 'low', 'medium', 'high']
  },
  backstoryOptions: {
    detailLevels: ['none', 'implied', 'detailed'],
    contentWarnings: ['BDSM', 'monsters', 'magical', 'public', 'group']
  }
};

// Core NSFW functions
function generateNSFWContent(type) {
  const settings = getNSFWSettings();

  switch(type) {
    case 'portrait':
      return generatePortrait(settings.nsfwLevel);
    case 'backstory':
      return generateBackstory(settings.backstoryDetail);
    case 'spell':
      return generateSpell(settings.nsfwLevel);
    default:
      throw new Error(`Invalid NSFW content type: ${type}`);
  }
}

function generatePortrait(nsfwLevel) {
  const { poses, clothingStates, arousalLevels } = NSFW_CONFIG.portraitOptions;
  const gender = document.getElementById('gender')?.value || 'nonbinary';

  return {
    pose: randomSelect(poses),
    clothing: nsfwLevel === 'explicit' ? 'nude' :
             nsfwLevel === 'suggestive' ? 'partially clothed' : 'fully clothed',
    arousal: nsfwLevel !== 'off' ? randomSelect(arousalLevels) : 'none',
    focusPoints: generateFocusPoints(nsfwLevel, gender),
    tags: generateTags(nsfwLevel)
  };
}

function generateBackstory(detailLevel) {
  if (detailLevel === 'none') return '';

  const character = getCharacterBasics();
  let content = `## ${character.name}'s Intimate History\n\n`;

  if (detailLevel === 'implied') {
    content += `While ${character.name} maintains discretion about private matters, `;
    content += `their reputation suggests considerable experience in carnal arts.\n\n`;
    return content;
  }

  // Explicit details
  content += `### First Experiences\n`;
  content += `${generateFirstExperience(character)}\n\n`;
  content += `### Notable Partners\n`;
  content += `${generateNotablePartners(character)}\n\n`;
  content += `### Specialties\n`;
  content += `${generateSpecialties(character)}\n\n`;

  return content;
}

// Helper functions
function generateFirstExperience(char) {
  const scenarios = [
    `Lost virginity at ${randomAge(14, 25)} to ${randomPartner(char)}`,
    `Initiated into sexual arts by ${randomMentor(char)}`,
    `First experience was ${randomEncounterType()} with ${randomPartner(char)}`
  ];
  return randomSelect(scenarios);
}

function generateNotablePartners(char) {
  const partners = [];
  const count = randomInt(2, 6);

  for (let i = 0; i < count; i++) {
    partners.push(`- ${randomPartner(char)}: ${randomDescription()}`);
  }

  return partners.join('\n');
}

function randomPartner(char) {
  const types = [
    'a fellow adventurer',
    'a noble',
    'a tavern worker',
    'a mysterious stranger',
    'a magical being'
  ];
  return `${randomSelect(types)} (${randomRace()} ${randomGender()})`;
}

function randomSelect(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// UI Controls
function setupNSFWControls() {
  document.getElementById('nsfwLevel').addEventListener('change', (e) => {
    localStorage.setItem('nsfwLevel', e.target.value);
    updateNSFWVisibility();
  });

  updateNSFWVisibility();
}

function updateNSFWVisibility() {
  const level = localStorage.getItem('nsfwLevel') || NSFW_CONFIG.defaultLevel;

  document.querySelectorAll('.nsfw-content').forEach(el => {
    el.style.display = level === 'off' ? 'none' : 'block';
  });

  document.querySelectorAll('.nsfw-explicit').forEach(el => {
    el.style.display = level === 'explicit' ? 'block' : 'none';
  });
}
