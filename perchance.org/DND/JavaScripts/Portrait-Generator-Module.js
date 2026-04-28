// --- Portrait Generator Module ---

async function generatePortrait() {
  let btn = document.getElementById("generatePortraitBtn");
  let img = document.getElementById("portraitImg");
  let ph = document.getElementById("portraitPlaceholder");
  let name = document.getElementById("charName").value || "Hero";
  let race = document.getElementById("race").value || "Human";
  let cls = document.getElementById("classLevel").value || "Adventurer";

  btn.disabled = true;
  btn.textContent = "✨ Generating...";
  ph.textContent = "Painting portrait...";

  try {
    // aiImageGenerator Plugin equivalent: root.generateImage
    if (root.generateImage) {
      let dataUrl = await root.generateImage(
        `Fantasy digital art portrait of a D&D character. A ${race} ${cls} named ${name}. Highly detailed, cinematic lighting.`,
        { resolution: "512x512" },
      );
      img.src = dataUrl;
      img.style.display = "block";
      ph.style.display = "none";
      saveToKV();
    } else {
      ph.textContent = "AI generator unavailable.";
    }
  } catch (e) {
    ph.textContent = "Generation failed. Try again.";
    console.error(e);
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Generate Portrait";
  }
}

async function generateBackstory() {
  let btn = document.getElementById("aiBackstoryBtn");
  let target = document.getElementById("featuresTraits");
  let name = document.getElementById("charName").value || "The Hero";
  let race = document.getElementById("race").value || "Human";
  let cls = document.getElementById("classLevel").value || "Wizard";
  let bg = document.getElementById("background").value || "Soldier";
  let trait =
    document.getElementById("personalityTraits").value || "brave but secretive";

  btn.disabled = true;
  btn.textContent = "⏳ Writing...";
  target.value += "\n\nGenerating backstory...";

  try {
    if (root.generateText) {
      let story = await root.generateText(
        `Write a creative, engaging backstory (about 200 words) for a D&D character named ${name}, a ${race} ${cls} with the ${bg} background. Their personality is: ${trait}. Include a secret they are hiding.`,
      );
      target.value = story;
      recalc();
    } else {
      target.value += "\nAI text generator unavailable.";
    }
  } catch (e) {
    target.value += "\nError generating backstory.";
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Generate Backstory";
  }
}

async function generateFlavorText() {
  let btn = document.getElementById("aiAttackNotesBtn");
  let target = document.getElementById("attackNotes");

  btn.disabled = true;
  btn.textContent = "⏳ Writing...";

  try {
    if (root.generateText) {
      let text = await root.generateText(
        "Write 3 creative descriptions for combat actions in D&D 5e. Keep it brief.",
      );
      target.value = text;
    } else {
      target.value += "\nAI text generator unavailable.";
    }
  } catch (e) {
    console.error(e);
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Flavor Text";
  }
}
