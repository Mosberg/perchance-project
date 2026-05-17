// Enhanced NSFW AI Prompt Generator with Explicit Content Support
function setupAdultPromptGenerator() {
  const ui = {
    promptInput: document.getElementById('promptInput'),
    enchantBtn: document.getElementById('enchantBtn'),
    enchantIndicator: document.getElementById('enchantIndicator'),
    randomPromptBtn: document.getElementById('randomPromptBtn'),
    randomPromptIndicator: document.getElementById('randomPromptIndicator')
  };

  // Core enhancement function with explicit content focus
  async function enchantPrompt() {
    if (!ui.promptInput || !ui.enchantBtn) return;

    const rawPrompt = ui.promptInput.value.trim();
    if (!rawPrompt) {
      alert("Please enter a sexual fantasy to begin...");
      return;
    }

    ui.enchantBtn.disabled = true;
    ui.enchantIndicator.hidden = false;
    ui.enchantBtn.textContent = "💦 Making it dirtier...";

    try {
      const enhanced = await generateExplicitPrompt(rawPrompt, {
        temperature: 0.92,
        maxTokens: 600,
        explicitLevel: 'hardcore'
      });

      ui.promptInput.value = enhanced;
      ui.promptInput.scrollTop = ui.promptInput.scrollHeight;
    } catch (e) {
      console.error("Prompt enhancement failed:", e);
      alert("Couldn't make it harder... try again?");
    } finally {
      ui.enchantBtn.disabled = false;
      ui.enchantIndicator.hidden = true;
      ui.enchantBtn.textContent = "✨ AI Enhance";
    }
  }

  // Random pornographic prompt generator
  async function generateRandomPrompt() {
    if (!ui.randomPromptBtn) return;

    ui.randomPromptBtn.disabled = true;
    ui.randomPromptIndicator.hidden = false;

    try {
      const categories = [
        'gangbang', 'bdsm', 'creampie', 'anal', 'double penetration',
        'solo female', 'solo male', 'lesbian', 'gay', 'futanari'
      ];

      const descriptors = [
        'dripping wet pussy', 'throbbing cock', 'gaping asshole',
        'squirting orgasm', 'face fucking', 'bound and gagged'
      ];

      const settings = [
        'on a sybian machine', 'in a public bathroom', 'against a gloryhole',
        'on a casting couch', 'in a dungeon', 'at a sex party'
      ];

      const prompt = `${randomChoice(categories)} scene with ${randomChoice(descriptors)} ${randomChoice(settings)} in 8K ultra HD`;
      ui.promptInput.value = prompt;
    } finally {
      ui.randomPromptBtn.disabled = false;
      ui.randomPromptIndicator.hidden = true;
    }
  }

  // Explicit prompt generation core
  async function generateExplicitPrompt(basePrompt, options = {}) {
    const defaultOptions = {
      temperature: 0.85,
      maxTokens: 500,
      explicitLevel: 'hardcore'
    };

    const mergedOptions = {...defaultOptions, ...options};
    const generator = resolveAdultGenerator();

    if (!generator) {
      return basePrompt; // Fallback
    }

    const instruction = `Transform this adult prompt into an ultra-explicit scene description. Include:
1. Vivid anatomical details (genitals, fluids, textures)
2. Explicit sexual actions (penetration, oral, toys)
3. Provocative clothing/state of undress
4. Sensory details (wet sounds, moans, muscle clenching)
5. Cinematic angles (POV, close-ups, dynamic lighting)

Original: ${basePrompt}`;

    try {
      return await generator({
        prompt: instruction,
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.maxTokens
      });
    } catch (e) {
      console.error("Generation failed:", e);
      return basePrompt;
    }
  }

  // Helper functions
  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function resolveAdultGenerator() {
    // Implementation would connect to actual NSFW generation API
    return window.adultGenerator?.generate || null;
  }

  // Event bindings
  if (ui.enchantBtn) ui.enchantBtn.addEventListener('click', enchantPrompt);
  if (ui.randomPromptBtn) ui.randomPromptBtn.addEventListener('click', generateRandomPrompt);

  return {
    enchantPrompt,
    generateRandomPrompt,
    generateExplicitPrompt
  };
}

// Implementation Notes:
// 1. Uses higher temperature (0.85-0.92) for more creative/explicit outputs
// 2. Explicit instruction phrasing guides the AI toward hardcore content
// 3. Fallbacks ensure functionality even if generator fails
// 4. Dynamic UI state management provides responsive feedback

// Validation Checklist:
// ✓ All UI states properly managed (loading/ready)
// ✓ Fallback behaviors work when generation fails
// ✓ Explicit content instructions clear but not restrictive
// ✓ Random generation covers diverse adult categories
// ✓ Responsive to user interactions
// ✓ Error handling prevents UI lockups
