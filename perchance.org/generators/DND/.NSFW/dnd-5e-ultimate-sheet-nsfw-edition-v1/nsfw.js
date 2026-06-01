      // --- Randomize (NSFW Enhanced) ---
      function rand(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      function rollStat() {
        let rolls = Array.from(
          { length: 4 },
          () => Math.floor(Math.random() * 6) + 1,
        ).sort((a, b) => b - a);
        return rolls[0] + rolls[1] + rolls[2];
      }

      const TABLES = {
        names: [
          "Arin", "Belwyn", "Cade", "Dorian", "Elira", "Fenric", "Galen", "Hestia", "Ilya", "Kael",
          "Thorne", "Lyra", "Magnus", "Seraphina", "Orion", "Aelion", "Aeris", "Bromdur", "Dagnir",
          "Bibble", "Coggle", "Brakka", "Drogath", "Alistair", "Beatrice", "Cedric", "Aurelia",
          "Caelus", "Azazel", "Braxia", "Cindros", "Arjhan", "Balasar", "Donaar", "Lysandra",
          "Morgana", "Velvet", "Scarlett", "Raven", "Jasmine", "Lola", "Candy", "Bambi", "Sienna",
          "Dahlia", "Violet", "Ruby", "Roxanne", "Chastity", "Faith", "Hope", "Mercy", "Prudence",
          "Temperance", "Verity", "Grace",
        ],
        races: [
          "Human", "High Elf", "Wood Elf", "Dwarf", "Halfling", "Tiefling", "Dragonborn", "Gnome",
          "Half-Orc", "Aasimar", "Goliath", "Fairy", "Nymph", "Succubus/Incubus", "Drow", "Half-Elf",
          "Tabaxi", "Kenku",
        ],
        classes: [
          "Courtesan", "Pleasure Slave", "Entertainer", "Bard", "Sorcerer", "Warlock", "Rogue", "Monk",
          "Cleric - Love Domain", "Paladin - Oath of Lust", "Druid", "Fighter", "Wizard", "Ranger",
        ],
        backgrounds: [
          "Pleasure Slave", "Courtesan", "Escort", "Dancer", "Seductress/Seducer", "Harem Dweller",
          "Brothel Worker", "Street Walker", "Noble's Mistress", "Temple Prostitute", "Pirate's Toy",
          "Gladiator", "Slave", "Servant", "Noble", "Acolyte", "Criminal", "Entertainer", "Outlander",
        ],
        alignments: [
          "Chaotic Good", "Chaotic Neutral", "Chaotic Evil", "Neutral Good", "True Neutral",
          "Neutral Evil", "Lawful Good", "Lawful Neutral", "Lawful Evil",
        ],
        bodyTypes: [
          "Slender", "Athletic", "Curvy", "Voluptuous", "Petite", "Muscular", "Hourglass", "Pear",
          "Apple", "BBW", "Slim-thick",
        ],
        genders: [
          "Female", "Male", "Futanari", "Femboy", "Sissy", "Crossdresser", "Ladyboy", "Shemale",
          "Transgender", "Genderfluid", "Non-binary", "Hermaphrodite",
        ],
        orientations: [
          "Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Lesbian", "Gay", "Demisexual",
          "Polyamorous",
        ],
        kinkLevels: ["Vanilla", "Curious", "Exploring", "Experienced", "Kinky", "Extreme", "Depraved"],
      };

      function randomizeSheet() {
        setValue("charName", rand(TABLES.names));
        setValue("race", rand(TABLES.races));
        let cls = rand(TABLES.classes);
        setValue("classLevel", `${cls} 1`);
        setValue("background", rand(TABLES.backgrounds));
        setValue("alignment", rand(TABLES.alignments));
        setValue("level", 1);
        setValue("gender", rand(TABLES.genders));
        setValue("bodyType", rand(TABLES.bodyTypes));
        setValue("sexualOrientation", rand(TABLES.orientations));
        setValue("kinkLevels", rand(TABLES.kinkLevels));

        ["str", "dex", "con", "int", "wis", "cha"].forEach((ab) =>
          setValue(`${ab}Score`, rollStat()),
        );

        // NSFW Specific Randomization
        setValue("cockSize", `${randomInt(1, 10)} inches`);
        setValue("chestSize", `${randomInt(1, 40)}${rand(["A", "B", "C", "D", "DD", "E"])}`);
        setValue("bodyHair", rand(EROTIC_TAGS.genitalDetails.hair));
        setValue("libido", randomInt(1, 10));
        setValue("stamina", randomInt(1, 10));

        let kinks = EROTIC_TAGS.kinks.sort(() => 0.5 - Math.random()).slice(0, randomInt(2, 5));
        setValue("primaryKinks", kinks.join(", "));

        document.querySelectorAll(".save-prof, .skill-prof").forEach((cb) => {
          cb.checked = Math.random() < 0.3;
        });
        document
          .querySelectorAll('[id^="exp_"], [id^="saveExp_"]')
          .forEach((cb) => {
            cb.checked = Math.random() < 0.1;
          });

        recalc();
      }

      // --- NSFW Portrait Generator (Enhanced) ---
      async function generateNSFWPortrait() {
        let btn = document.getElementById("generatePortraitBtn");
        let img = document.getElementById("portraitImg");
        let ph = document.getElementById("portraitPlaceholder");
        let name = document.getElementById("charName").value || "Beautiful Stranger";
        let race = document.getElementById("race").value || "Human";
        let gender = document.getElementById("gender").value || "Female";
        let bodyType = document.getElementById("bodyType").value || "Curvy";
        let kinks = document.getElementById("primaryKinks").value || "";
        let level = document.getElementById("settingNSFWLevel")?.value || "explicit";

        btn.disabled = true;
        btn.textContent = "✨ Generating...";
        ph.textContent = "Creating explicit portrait...";

        try {
          if (root.generateImage) {
            let explicitLevel = level === "extreme" ? "Hardcore explicit" : level === "explicit" ? "Explicit" : "Suggestive";

            // Generate tags
            let tags = [...NSFW_TAGS].sort(() => 0.5 - Math.random()).slice(0, 3);
            let pose = randomElement(NSFW_CONFIG.portraitOptions.poses);
            let clothing = level === "extreme" ? "nude" : level === "explicit" ? "nude" : randomElement(["partially clothed", "lingerie"]);
            let arousal = level === "mild" ? "none" : randomElement(["medium", "high"]);

            let prompt = `Hyper-detailed erotic portrait of a ${race} ${gender} fantasy character named ${name}. `;
            prompt += `${bodyType} body type. `;

            if (level === "explicit" || level === "extreme") {
              prompt += `${explicitLevel} content. ${clothing}. ${pose} pose. ${arousal} arousal. `;
              prompt += `Detailed anatomical correctness, realistic textures, dynamic lighting. `;
              prompt += `Tags: ${tags.join(", ")}. `;
            } else {
              prompt += `Suggestive pose, ${clothing} barely covering intimate areas. `;
            }

            prompt += `High quality digital art, sensual lighting, erotic and explicit adult content.`;

            let dataUrl = await root.generateImage(prompt, { resolution: "512x512" });

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
          btn.textContent = "✨ Generate NSFW Portrait";
        }
      }

      // --- Adult Spell Generator ---
      async function generateAdultSpell() {
        let school = randomElement(EROTIC_SCHOOLS);
        let type = randomElement(ADULT_SPELL_TYPES);
        let level = Math.floor(Math.random() * 4); // 0-3

        let spell = {
          level,
          school,
          name: `${type} of ${randomElement(["Ecstasy", "Submission", "Dominance", "Arousal", "Lust", "Pleasure"])}`,
          castTime: randomElement(["1 action", "1 bonus action", "1 hour"]),
          range: randomElement(["Touch", "Self", "30 ft", "60 ft"]),
          components: "V, S",
          duration: randomElement(["Instantaneous", "Concentration, up to 1 min", "1 hour"]),
          prepared: true,
          concentration: Math.random() > 0.5,
          ritual: false,
          notes: `Erotic spell of ${school.toLowerCase()}. Inflicts ${type.toLowerCase()} effects on targets.`,
        };

        addRepeaterRow("spells", spell);
        recalc();
      }

      // --- NSFW Backstory Generator (Enhanced) ---
      async function generateNSFWBackstory() {
        let btn = document.getElementById("aiBackstoryBtn");
        let target = document.getElementById("featuresTraits");
        let name = document.getElementById("charName").value || "The Lover";
        let race = document.getElementById("race").value || "Human";
        let cls = document.getElementById("classLevel").value || "Courtesan";
        let bg = document.getElementById("background").value || "Pleasure Slave";
        let gender = document.getElementById("gender").value || "Female";
        let orientation = document.getElementById("sexualOrientation").value || "Pansexual";
        let kinkLevel = document.getElementById("kinkLevels").value || "Experienced";
        let level = document.getElementById("settingNSFWLevel")?.value || "explicit";

        btn.disabled = true;
        btn.textContent = "⏳ Writing...";
        target.value += "\n\nGenerating explicit backstory...";

        try {
          if (root.generateText) {
            let explicitInstruction = "";

            if (level === "extreme") {
               explicitInstruction = `Write an extremely explicit, detailed backstory (about 300 words) for a D&D character named ${name}, a ${gender} ${race} ${cls} with the ${bg} background. They are ${orientation} and have ${kinkLevel} experience. Include detailed descriptions of their sexual experiences, first times, major encounters, how they discovered their sexuality, and any traumatic or transformative sexual events. Describe their genitalia and erogenous zones. Be very explicit with sexual details, descriptions of anatomy, and intimate acts.`;
            } else if (level === "explicit") {
               explicitInstruction = `Write an explicit, detailed backstory (about 250 words) for a D&D character named ${name}, a ${gender} ${race} ${cls} with the ${bg} background. They are ${orientation} and have ${kinkLevel} experience. Include detailed descriptions of their sexual experiences, how they discovered their desires, notable encounters, and the sexual nature of their background. Be explicit with intimate details and adult themes.`;
            } else {
               explicitInstruction = `Write a sensual, romantic backstory (about 200 words) for a D&D character named ${name}, a ${gender} ${race} ${cls} with the ${bg} background. They are ${orientation} and have ${kinkLevel} experience. Include their romantic history, how they discovered their sexuality, and intimate relationships. Focus on desire and passion.`;
            }

            let story = await root.generateText(explicitInstruction);
            target.value = story;
            recalc();
          } else {
            target.value += "\nAI text generator unavailable.";
          }
        } catch (e) {
          target.value += "\nError generating backstory.";
        } finally {
          btn.disabled = false;
          btn.textContent = "✨ Generate NSFW Backstory";
        }
      }

      // --- NSFW Sexual History Generator (Enhanced) ---
      async function generateSexHistory() {
        let btn = document.getElementById("aiSexHistoryBtn");
        let target = document.getElementById("sexualHistory");
        let name = document.getElementById("charName").value || "Nameless";
        let gender = document.getElementById("gender").value || "Female";
        let race = document.getElementById("race").value || "Human";
        let age = document.getElementById("level").value || "Young";
        let kinkLevel = document.getElementById("kinkLevels").value || "Experienced";
        let level = document.getElementById("settingNSFWLevel")?.value || "explicit";

        btn.disabled = true;
        btn.textContent = "⏳ Writing...";

        try {
          if (root.generateText) {
            let instruction = `Write a detailed sexual history (about 200 words) for ${name}, a ${age}-year-old ${gender} ${race} who has ${kinkLevel} kink experience. ${level === "extreme" ? "Include explicit details of first sexual experiences, number of partners, specific acts performed, most memorable encounters, how they discovered their kinks, any unusual or extreme sexual experiences, and describe their current sexual practices in detail. Be very explicit." : level === "explicit" ? "Include explicit details of their sexual awakening, first experiences, number and types of partners, memorable encounters, discovery of kinks, and describe their current sexual practices. Be explicit with intimate details." : "Describe their romantic and sexual history, including first loves, significant relationships, and how they discovered their sexuality."}`;

            let text = await root.generateText(instruction);
            target.value = text;
          } else {
            target.value += "\nAI generator unavailable.";
          }
        } catch (e) {
          console.error(e);
        } finally {
          btn.disabled = false;
          btn.textContent = "✨ Generate History";
        }
      }

      // --- NSFW Complications Generator ---
      async function generateComplications() {
        let btn = document.getElementById("aiComplicationsBtn");
        let target = document.getElementById("sexualComplications");

        btn.disabled = true;
        btn.textContent = "⏳ Writing...";

        try {
          if (root.generateText) {
            let text = await root.generateText(
              "Generate 5-8 dark, explicit sexual complications or vices for a D&D character in an adult campaign. Include addictions, dangerous attractions, unhealthy sexual patterns, taboo desires, risky behaviors, and consequences of their lifestyle. Be explicit and creative.",
            );
            target.value = text;
          } else {
            target.value += "\nAI generator unavailable.";
          }
        } catch (e) {
          console.error(e);
        } finally {
          btn.disabled = false;
          btn.textContent = "✨ Generate";
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
              "Write 3 creative, sensual descriptions for combat actions in a NSFW D&D 5e campaign. Include erotic undertones and be explicit.",
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
