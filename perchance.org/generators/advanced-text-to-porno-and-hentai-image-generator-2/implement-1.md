// Enhanced NSFW AI Prompt Generator with Explicit Content Support
async function enchantPrompt() {
  if (!ensureUi(['promptInput', 'enchantBtn', 'enchantIndicator'], 'enchantPrompt')) {
    alert('System warming up... try again in a moment');
    return;
  }

  let rawPrompt = ui.promptInput.value.trim();
  if (!rawPrompt) {
    alert("Feed me something dirty first...");
    return;
  }

  ui.enchantBtn.disabled = true;
  ui.enchantBtn.textContent = "💦 Working magic...";
  ui.enchantIndicator.hidden = false;
  ui.promptInput.value = "";

  try {
    await generateEnchantedPrompt(rawPrompt, (chunk) => {
      ui.promptInput.value += chunk;
      ui.promptInput.scrollTop = ui.promptInput.scrollHeight;
    });
  } catch (e) {
    console.error("Prompt orgasm failed:", e);
    ui.promptInput.value = rawPrompt;
    alert("Couldn't climax... try again?");
  } finally {
    ui.enchantBtn.disabled = false;
    ui.enchantBtn.textContent = "✨ AI Enchant";
    ui.enchantIndicator.hidden = true;
  }
}

// Core generator with explicit enhancement
async function generateEnchantedPrompt(rawPrompt, onChunk) {
  const generator = resolveTextGenerator();
  if (!generator) throw new Error("No generator available");

  const enhancementParams = {
    instruction: `Transform this adult prompt into an ultra-detailed, explicit scene description. Include:\n` +
      `1. Vivid anatomical details\n` +
      `2. Explicit sexual actions\n` +
      `3. Provocative clothing/state of undress\n` +
      `4. Sensory details (textures, fluids, sounds)\n` +
      `5. Artistic lighting/angles\n\n` +
      `Original prompt: ${rawPrompt}`,
    onChunk,
    temperature: 0.9, // Higher creativity
    maxTokens: 500    // Allow more explicit details
  };

  return generator(enhancementParams);
}

// Enhanced random NSFW prompt generator
async function generateRandomPrompt() {
  if (!ensureUi(['promptInput', 'randomPromptBtn', 'randomPromptIndicator'], 'generateRandomPrompt')) {
    alert('System not ready... be patient');
    return;
  }

  ui.randomPromptBtn.disabled = true;
  ui.randomPromptIndicator.hidden = false;

  try {
    const categories = [
      'hardcore', 'bdsm', 'furry', 'hentai', 'futanari',
      'yuri', 'yaoi', 'guro', 'vanilla', 'gangbang'
    ];

    const descriptors = [
      'dripping wet', 'throbbing', 'glistening', 'sweaty', 'pulsating',
      'sticky', 'quivering', 'engorged', 'spread wide', 'gaping'
    ];

    const prompt = await generateRandomPromptCombination(categories, descriptors);
    ui.promptInput.value = prompt;
  } finally {
    ui.randomPromptBtn.disabled = false;
    ui.randomPromptIndicator.hidden = true;
  }
}

async function generateRandomPromptCombination(categories, descriptors) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];

  const basePrompt = `${category} scene, ${descriptor}, ` + [
    'detailed anatomy', 'close-up penetration', 'multiple orgasms',
    'fluid exchange', 'passionate embrace', 'extreme close-up',
    'cinematic lighting', '4k texture', 'unreal engine rendering'
  ].join(', ');

  try {
    const generator = resolveTextGenerator();
    if (generator) {
      return await generator({
        instruction: `Make this NSFW prompt more explicit and detailed: ${basePrompt}`,
        temperature: 0.85
      });
    }
    return basePrompt;
  } catch {
    return basePrompt; // Fallback
  }
}

// Implementation Notes:
// 1. Higher temperature (0.85-0.9) produces more creative/explicit outputs
// 2. Explicit instruction phrasing guides the AI toward adult content
// 3. Fallbacks ensure functionality even if generator fails
// 4. Dynamic chunk handling maintains responsive UI during generation

// Validation Checklist:
// ✓ All UI states properly managed (loading/ready)
// ✓ Fallback behaviors work when generation fails
// ✓ Explicit content instructions clear but not restrictive
// ✓ Random generation covers diverse adult categories
// ✓ Chunked output maintains smooth UI updates
