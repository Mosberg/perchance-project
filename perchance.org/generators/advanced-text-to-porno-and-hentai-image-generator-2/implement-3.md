Make it explicit adult pornographic NSFW content oriented:

// AI Erotic Prompt Enhancement Function with Live Text Generation
  async function enchantPrompt() {
    if (!ensureUi(['promptInput', 'enchantBtn', 'enchantIndicator'], 'enchantPrompt')) {
      alert('Interface is still loading. Please try again when ready.');
      return;
    }

    let currentText = ui.promptInput.value.trim();
    if (!currentText) {
      alert("Please enter a basic erotic prompt first for the AI to enhance.");
      return;
    }

    let textGenerator = resolveTextGenerator();
    if (!textGenerator) {
      alert("Erotic text plugin is unavailable right now.");
      return;
    }

    ui.enchantBtn.disabled = true;
    ui.enchantBtn.textContent = "💦 Enhancing...";
    ui.enchantIndicator.hidden = false;

    ui.promptInput.value = "";

    try {
      let result = await textGenerator({
        instruction: `Rewrite this adult image prompt with vivid sexual details. Describe anatomy explicitly - flushed skin, parted lips, erect nipples, glistening folds. Include intimate angles: close-up penetration shots, arched backs, gripping hands. Specify textures: slick with arousal, taut muscles, dripping fluids. Original prompt: "${currentText}"`,
        onChunk: (data) => {
          ui.promptInput.value += data.textChunk || "";
          ui.promptInput.scrollTop = ui.promptInput.scrollHeight;
        }
      });

      if (typeof result === 'string' && ui.promptInput.value.trim() === '') {
        ui.promptInput.value = result.trim();
      }
    } catch (e) {
      console.error(e);
      alert("Erotic enhancement failed.");
      ui.promptInput.value = currentText;
    } finally {
      ui.enchantBtn.disabled = false;
      ui.enchantBtn.textContent = "💦 AI Enhance";
      ui.enchantIndicator.hidden = true;
    }
  }

  async function generateRandomPrompt() {
    if (!ensureUi(['promptInput', 'randomPromptBtn', 'randomPromptIndicator'], 'generateRandomPrompt')) {
      alert('Interface is still loading. Please try again when ready.');
      return;
    }

    let textGenerator = resolveTextGenerator();

    ui.randomPromptBtn.disabled = true;
    ui.randomPromptIndicator.hidden = false;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let categories = ['hardcore', 'bdsm', 'orgy', 'solo play'];
      let category = categories[Math.floor(Math.random() * categories.length)];

      let subjects = [
        'voluptuous woman with swollen labia', 'muscular man with throbbing erection',
        'anime girl with dripping wetness', 'dominatrix in leather restraints',
        'elf with engorged clitoris', 'cyberpunk slut with augmented genitalia'
      ];

      let actions = [
        'riding with thighs trembling', 'taking multiple cocks deep inside',
        'fisting her gaping hole', 'bound and begging for release',
        'squirting violently', 'double penetrated with juices leaking'
      ];

      let settings = [
        'on a sex swing with ropes cutting into flesh', 'against a gloryhole wall with anonymous hands groping',
        'in a dungeon with candle wax dripping on nipples', 'spread eagle on a breeding bench'
      ];

      let styles = [
        '4k close-up of pulsating anatomy', 'macro shot of stretched openings',
        'backlit by neon showing sweat sheen', 'slow motion capture of cumshots'
      ];

      let randomPrompt = `${category} scene: ${subjects[Math.floor(Math.random() * subjects.length)]} ${actions[Math.floor(Math.random() * actions.length)]}, ${settings[Math.floor(Math.random() * settings.length)]}, ${styles[Math.floor(Math.random() * styles.length)]}`;

      let enhancedPrompt = "";
      if (textGenerator) {
        try {
          enhancedPrompt = await textGenerator({
            instruction: `Make this hardcore prompt more explicit: "${randomPrompt}". Add details like body fluids, sounds (moans/slaps), anatomical reactions (clenching, twitching), and sensory descriptions (heat, friction, musk).`
          });
        } catch (e) {
          enhancedPrompt = randomPrompt;
        }
      } else {
        enhancedPrompt = randomPrompt;
      }

      ui.promptInput.value = String(enhancedPrompt || randomPrompt).trim();
    } finally {
      ui.randomPromptBtn.disabled = false;
      ui.randomPromptIndicator.hidden = true;
    }
  }
