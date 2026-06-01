Create a Perchance generator named generate-character-metadata-from-url.

The generator must:

• Accept one or more URLs
• Scrape character information from each URL
• Map extracted data into either:
  - ultra-detailed-character-metadata-v2.schema.json
  - ultra-detailed-character-metadata-nsfw-v2.schema.json
• Output a JSON object matching the exact schema structure you provided
• Allow optional JSON editing
• Allow downloading the final JSON
• Support queueing multiple URLs → output becomes an array under "character"

---

# **⚙️ Perchance UI Options (Final Form)**

```js
options:
  schema_type:
    type: dropdown
    label: "Schema Type"
    values:
      - "normal"
      - "nsfw"

  url_input:
    type: text
    label: "URL Input"
    placeholder: "Enter one or more URLs separated by commas"

  enable_json_editor:
    type: checkbox
    label: "Enable JSON Editor"

  generate_button:
    type: button
    label: "Generate Metadata"

  json_output:
    type: textarea
    label: "JSON Output"

  download_json:
    type: button
    label: "Download JSON"
```

---

# **🧠 Core Logic (Perchance‑Optimized)**
This version now maps directly into your schema fields.

```js
urls = url_input.split(",").map(u => u.trim()).filter(u => u.length > 0);

schema = schema_type;

characters = [];

for (url of urls) {
    html = superFetch(url);
    parsed = scrapeCharacterFromHTML(html);
    mapped = mapToSchema(parsed, schema);
    characters.push(mapped);
}

json_output = JSON.stringify(
    { character: characters },
    null,
    2
);
```

---

# **🕸️ URL Scraping Pseudocode (Upgraded for Your Schema)**
This version fills **identity**, **appearance**, **personality**, **background**, **skills**, **relationships**, **equipment**, **meta**, **physiology**, **psychology**, **game_stats**, **misc**, and **nsfw** (if selected).

---

## **1. Universal Scraper Pipeline**

```js
function scrapeCharacterFromHTML(html) {
    doc = parseHTML(html);

    if (isFandomWiki(doc)) return scrapeFandom(doc);
    if (isWikipedia(doc)) return scrapeWikipedia(doc);
    if (isAO3(doc)) return scrapeAO3(doc);
    if (isCharacterCard(doc)) return scrapeCard(doc);

    readable = extractReadableContent(doc);
    return scrapeGeneric(readable);
}
```

---

# **2. Site‑Specific Scrapers (Schema‑Aware)**

## **Fandom / Wiki**

```js
function scrapeFandom(doc) {
    return {
        name: extract(".pi-title"),
        aliases: extractAliases(doc),
        universe: extractBreadcrumbs(doc),
        origin: extractOrigin(doc),
        type: "fictional character",
        pronouns: guessPronouns(doc),
        species: extractInfoboxField(doc, "Species"),
        gender: extractInfoboxField(doc, "Gender"),
        age: extractInfoboxField(doc, "Age"),
        appearance: extractSection(doc, "Appearance"),
        personality: extractSection(doc, "Personality"),
        background: extractSection(doc, "Background"),
        abilities: extractList(doc, "Powers and Abilities"),
        relationships: extractList(doc, "Relationships"),
        avatar: extractImage(doc),
        tags: extractTags(doc)
    };
}
```

---

## **Wikipedia**

```js
function scrapeWikipedia(doc) {
    return {
        name: extract("#firstHeading"),
        universe: extractInfoboxField(doc, "Series"),
        origin: extractInfoboxField(doc, "Created by"),
        type: "fictional character",
        appearance: extractParagraphs(doc, 2),
        background: extractParagraphs(doc, 4),
        avatar: extractInfoboxImage(doc)
    };
}
```

---

## **AO3**

```js
function scrapeAO3(doc) {
    return {
        name: extractAO3Tag(doc, "Character"),
        universe: extractAO3Tag(doc, "Fandom"),
        relationships: extractAO3TagList(doc, "Relationships"),
        tags: extractAO3Tags(doc),
        background: extractAO3Summary(doc)
    };
}
```

---

## **Generic Fallback**

```js
function scrapeGeneric(readable) {
    return {
        name: guessName(readable),
        background: extractFirstParagraph(readable),
        appearance: extractAppearanceGuess(readable),
        personality: extractPersonalityGuess(readable),
        abilities: extractAbilityGuess(readable),
        tags: extractKeywordTags(readable)
    };
}
```

---

# **3. Schema Mapping Layer (Exact to Your Schema)**
This is the **final, production‑ready mapping**.

---

## **Normal Schema Mapping**

```js
function mapToSchema(p, schema) {
    if (schema === "nsfw") return mapToNSFWSchema(p);
    return mapToNormalSchema(p);
}
```

---

## **Normal Version**

```js
function mapToNormalSchema(p) {
    return {
        identity: {
            name: p.name || "",
            aliases: p.aliases || [],
            universe: p.universe || "",
            origin: p.origin || "",
            type: p.type || "",
            pronouns: p.pronouns || [],
            title: "",
            birth_date: "",
            death_date: "",
            languages: [],
            voice_actor: "",
            concept_artist: ""
        },

        appearance: {
            species: p.species || "",
            subspecies: "",
            gender: p.gender || "",
            sex: "",
            age: p.age || "",
            height: "",
            weight: "",
            build: "",
            posture: "",
            hair: { color: "", length: "", style: "", texture: "" },
            eyes: { color: "", shape: "", expression: "" },
            skin: { color: "", texture: "", temperature: "", scars: [] },
            distinctive_features: [],
            markings: [],
            mutations: [],
            body_modifications: [],
            clothing_style: [],
            scent: "",
            voice: ""
        },

        personality: {
            traits_positive: [],
            traits_negative: [],
            traits_neutral: [],
            archetype: "",
            temperament: "",
            moral_alignment: "",
            motivations: [],
            fears: [],
            values: [],
            quirks: [],
            cognitive_biases: [],
            emotional_triggers: [],
            mental_illnesses: [],
            coping_mechanisms: []
        },

        background: {
            role: "",
            alignment: "",
            occupation: "",
            previous_occupations: [],
            education: "",
            faction: "",
            homeworld: "",
            current_residence: "",
            economic_status: "",
            notable_events: [],
            backstory_summary: p.background || "",
            secrets: []
        },

        skills: {
            combat_style: [],
            abilities: p.abilities || [],
            magic_type: "",
            power_level: "",
            specializations: [],
            weaknesses: [],
            training: [],
            learning_style: "",
            iq: "",
            eq: "",
            adaptability: ""
        },

        relationships: {
            allies: [],
            rivals: [],
            enemies: [],
            family: [],
            romantic_history: [],
            current_partners: [],
            friends: [],
            acquaintances: [],
            mentors: [],
            students: [],
            favor_status: "",
            trust_level: ""
        },

        equipment: {
            weapons: [],
            items: [],
            armor: [],
            signature_item: "",
            inventory: [],
            wealth: "",
            technology_access: ""
        },

        meta: {
            genre: [],
            tags: p.tags || [],
            inspiration: [],
            tropes: [],
            archetypes: [],
            symbolism: [],
            leith_motif: "",
            themes: []
        },

        physiology: {
            metabolism: "",
            sleep_patterns: "",
            eating_habits: "",
            immune_system: "",
            healing_factor: "",
            pain_tolerance: "",
            drug_resistance: "",
            poison_resistance: "",
            disease_resistance: "",
            temperature_tolerance: "",
            radiation_resistance: "",
            biological_rhythms: []
        },

        psychology: {
            intelligence_type: "",
            memory_capacity: "",
            attention_span: "",
            learning_rate: "",
            decision_making_style: "",
            problem_solving_approach: "",
            creativity_level: "",
            empathy_level: "",
            psychic_defenses: []
        },

        game_stats: {
            charisma: "",
            strength: "",
            intelligence: "",
            dexterity: "",
            constitution: "",
            wisdom: "",
            luck: "",
            perception: "",
            willpower: ""
        },

        misc: {
            theme_song: "",
            catchphrase: "",
            signature_move: "",
            hobbies: [],
            pet_peeves: [],
            guilty_pleasures: [],
            bucket_list: [],
            unusual_habits: [],
            collection: []
        }
    };
}
```

---

# **NSFW Schema Mapping**

```js
function mapToNSFWSchema(p) {
    base = mapToNormalSchema(p);

    base.nsfw = [
        {
            sexual_orientation: "",
            relationship_status: "",
            partner_preferences: {
                gender: [],
                species: [],
                personality_traits: [],
                physical_traits: []
            },
            kinks: [],
            fetishes: [],
            turn_offs: [],
            sexual_experience: "",
            libido: "",
            attitude_toward_sex: "",
            sexual_health: {
                std_status: "",
                contraception: "",
                fertility: ""
            },
            explicit_content: {
                allowed_scenarios: [],
                limits: [],
                aftercare_preferences: []
            },
            bodily_fluids: {
                blood: "",
                sweat: "",
                saliva: "",
                semen: "",
                vaginal_fluids: "",
                urine: "",
                feces: ""
            },
            consent_dynamics: {
                initiation_style: "",
                power_exchange: "",
                safeword: ""
            }
        }
    ];

    return base;
}
```

---

## 1. Automatic schema validation

### High-level approach

- **Goal:** Ensure generated objects conform to either the **normal** or **NSFW** schema before they hit `json_output`.
- **Strategy:**
  - Define a **lightweight validator** that checks required paths and types.
  - Collect errors per character and show them in a **Validation Panel**.

### UI additions

```js
options:
  show_validation:
    type: checkbox
    label: "Show Schema Validation Results"

  validation_output:
    type: textarea
    label: "Validation Results"
```

### Core validation hook

Call this right after `characters` is built and before `json_output` is assigned:

```js
validation_results = [];

for (i = 0; i < characters.length; i++) {
    const result = validateCharacter(characters[i], schema);
    validation_results.push({ index: i, ...result });
}

if (show_validation) {
    validation_output = validation_results
        .map(r => `Character #${r.index + 1}:\n` +
                  (r.valid ? "  ✔ Valid\n" :
                             "  ✖ Invalid\n" +
                             r.errors.map(e => "    - " + e).join("\n")))
        .join("\n\n");
}
```

### Example validator (targeting your schema)

```js
function validateCharacter(c, schema) {
    const errors = [];

    // Identity
    if (!c.identity || !c.identity.name || c.identity.name.trim() === "") {
        errors.push("identity.name is required");
    }

    // Appearance
    if (!c.appearance || typeof c.appearance.species !== "string") {
        errors.push("appearance.species must be a string");
    }

    // NSFW-specific
    if (schema === "nsfw") {
        if (!Array.isArray(c.nsfw) || c.nsfw.length === 0) {
            errors.push("nsfw array must exist and contain at least one entry");
        } else {
            const n = c.nsfw[0];
            if (!n.sexual_orientation) {
                errors.push("nsfw[0].sexual_orientation is required");
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
```

---

## 2. Avatar auto‑cropping + face detection

We’ll treat this as a **post‑processing step** on `avatar` URLs.

### Conceptual pipeline

1. Extract avatar URL from scraping (`p.avatar`).
2. Send it through a **face-detection + crop** service (or plugin).
3. Replace `avatar` with the processed URL.

### Hook in mapping layer

```js
async function processAvatar(p) {
    if (!p.avatar) return p;

    const faceCropUrl = await autoCropFace(p.avatar); // external/plugin
    p.avatar = faceCropUrl || p.avatar;
    return p;
}
```

Integrate into main loop:

```js
characters = [];

for (url of urls) {
    html = superFetch(url);
    parsed = scrapeCharacterFromHTML(html);
    parsed = await processAvatar(parsed);
    mapped = mapToSchema(parsed, schema);
    characters.push(mapped);
}
```

### Pseudocode for `autoCropFace`

```js
async function autoCropFace(imageUrl) {
    // Pseudocode: call external service / plugin
    const result = await callFaceService({
        image: imageUrl,
        mode: "crop_to_face",
        aspect_ratio: "1:1"
    });

    if (result && result.cropped_url) {
        return result.cropped_url;
    }
    return null;
}
```

---

## 3. Multi‑URL batch processing with progress UI

We’ll add a **progress bar + status text** and process URLs sequentially so the UI can update.

### UI additions

```js
options:
  show_progress:
    type: checkbox
    label: "Show Batch Progress"

  progress_text:
    type: text
    label: "Progress"

  progress_percent:
    type: number
    label: "Progress %"
```

### Batch loop with progress updates

```js
characters = [];
total = urls.length;

for (i = 0; i < total; i++) {
    const url = urls[i];

    if (show_progress) {
        progress_text = `Processing ${i + 1} / ${total}: ${url}`;
        progress_percent = Math.round(((i + 1) / total) * 100);
    }

    html = superFetch(url);
    parsed = scrapeCharacterFromHTML(html);
    parsed = await processAvatar(parsed);
    mapped = mapToSchema(parsed, schema);
    characters.push(mapped);
}

if (show_progress) {
    progress_text = `Done. Processed ${total} URL(s).`;
    progress_percent = 100;
}

json_output = JSON.stringify({ character: characters }, null, 2);
```

---

## 4. AI‑powered field inference for missing schema fields

This is where it gets fun—using the scraped text to **auto‑fill** empty schema fields.

### High-level idea

- Build a **context blob** from scraped data (background, appearance, personality, tags).
- Run an **inference function** that returns best‑guess values for missing fields.
- Merge those into the mapped schema object.

### UI toggle

```js
options:
  enable_ai_inference:
    type: checkbox
    label: "AI Inference for Missing Fields"
```

### Integration point

Right after `mapToSchema`:

```js
mapped = mapToSchema(parsed, schema);

if (enable_ai_inference) {
    mapped = inferMissingFields(mapped, parsed);
}

characters.push(mapped);
```

### Inference pseudocode

```js
function inferMissingFields(c, parsed) {
    const context = buildContext(parsed);

    // Example: infer archetype
    if (!c.personality.archetype || c.personality.archetype === "") {
        c.personality.archetype = inferArchetypeFromContext(context);
    }

    // Example: infer moral alignment
    if (!c.personality.moral_alignment || c.personality.moral_alignment === "") {
        c.personality.moral_alignment = inferAlignmentFromContext(context);
    }

    // Example: infer combat_style from abilities / tags
    if (!c.skills.combat_style || c.skills.combat_style.length === 0) {
        c.skills.combat_style = inferCombatStyle(context);
    }

    // Example: infer genre / themes
    if (!c.meta.genre || c.meta.genre.length === 0) {
        c.meta.genre = inferGenre(context);
    }
    if (!c.meta.themes || c.meta.themes.length === 0) {
        c.meta.themes = inferThemes(context);
    }

    return c;
}
```

### Context builder

```js
function buildContext(p) {
    return [
        p.background || "",
        p.appearance || "",
        p.personality || "",
        (p.abilities || []).join(", "),
        (p.tags || []).join(", ")
    ].join("\n\n");
}
```

### Example inference stubs

```js
function inferArchetypeFromContext(ctx) {
    ctxLower = ctx.toLowerCase();
    if (ctxLower.includes("reluctant hero")) return "Reluctant Hero";
    if (ctxLower.includes("anti-hero")) return "Anti-Hero";
    if (ctxLower.includes("mentor")) return "Mentor";
    if (ctxLower.includes("villain")) return "Villain";
    return "Undefined";
}

function inferAlignmentFromContext(ctx) {
    ctxLower = ctx.toLowerCase();
    if (ctxLower.includes("selfless") || ctxLower.includes("protect")) return "Lawful Good";
    if (ctxLower.includes("chaotic") && ctxLower.includes("good")) return "Chaotic Good";
    if (ctxLower.includes("selfish") || ctxLower.includes("cruel")) return "Chaotic Evil";
    return "Neutral";
}
```

---

This specification ensures a robust, user-friendly generator that meets the needs of users seeking detailed character metadata from web sources.
