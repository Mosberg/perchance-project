**Mosberg's AI Studio (Perchance Generator) features a vast array of customizable inputs, buttons, toggles, and tools for generating AI images, primarily focused on anime, realistic, and art styles.** This master list compiles every identifiable feature from the Perchance list code in paste.txt, organized by category for clarity.

## Prompt Inputs
- **description**: Main prompt textarea for core image description; supports variables, modifiers from art styles; enter key triggers generation.
- **descriptionZero** (First Prompt): Initial description textarea; hidden by default; useVariables true.
- **description2** (Last Prompt): Final description textarea; hidden by default; useVariables true.
- **negative**: Negative prompt textarea; supports variables; hidden by default.
- **fullPrompt**: Full editable prompt paragraph (250px+ height); live input toggle; content lost on close.
- **fullNegativePrompt**: Full editable negative prompt paragraph (150px+ height); live input toggle.
- **FilterText**: Tags input for tools (shuffle/replace/add/remove/walk); separator toggle (comma, slash, newline); copy button.

## Notepads (Scratchpads)
10+ dedicated notepads (40vh height, parseVariables true, most excludeFromShareLink):
- **scratchpad** (Notepad 1): General; save/load as character list; refresh required.
- **scratchpad2** to **scratchpadex2** (Notepads 2-6): Colored icons; download buttons; some shareable.
- **scratchpadStyles** (Notepad Styles): For custom styles.
- **scratchpadCharacters** (Notepad Characters): For custom characters.
- **scratchpadOutfit** (Notepad Outfits): For clothes.
- **scratchpadBackground** (Notepad Backgrounds): For scenes/backgrounds.

## Art Styles (Select Dropdowns)
Three main style selectors (remember settings; options from imports like aagaStyles, perAnime):
- **artStyleOne** (Anime/Toon): 70+ options incl. random, AAGA exclusive, perAnime; tagWeights.
- **artStyleTwo** (Photo/Real): 23+ options incl. random, aagaRealistic.
- **artStyleThree** (Art Styles): 69+ options incl. random, aagaStyles.
- **userArtStyleMix** / Custom user styles: From myStyles localStorage.

## Character Options (Selects)
- **animeCharacter**: From aagaCHAR/everything-characters-flux.
- **userCharacter**: From myCharacters localStorage.
- **characterXES**: Gender/subject/possessive (e.g., "the character").
- **characterAngle**: Camera/pose angle.
- **characterBody**: Body type (e.g., slender, muscular).
- **characterChest**, **characterSkinColor**, **characterEyeColor**, **characterHairL** (hair color/length), **characterHairT** (type), **characterHairS** (style), **characterHairB** (bangs), **characterHairMisc**.
- **characterEmo** (expression), **characterGaze**, **characterAction**.

## Outfit/Fashion (Selects)
Multi-part clothing with color pickers (from Colors.corlist, Fashion.female-outfit-list-flux):
- **outfitSet**, **userOutfitSet** (from myOutfits), **outfitCosplay**.
- **outfitOutwear** + **outfitColor01**, **outfitSleeves** + **outfitColor02** (torso), **outfitWaist** + **outfitColor03**, **outfitLegs** + **outfitColor04**, **outfitFoot** + **outfitColor05**, **outfitHands** + **outfitColor06**, **outfitHead** + **outfitColor07**.
- **outfitAccA/B/C** (accessories) + **outfitColor08/09/10**.
- **outfitFabric**.

## Background/Scene (Selects)
- **userBackground** (from myBg localStorage).
- **bgExterior**, **bgInterior**.
- **bgAngle**, **bgScheme**, **bgTime**, **bgWeather**.

## Image Settings (Selects/Sliders)
| Setting | Type | Key Options/Range |
|---------|------|-------------------|
| **gScale** (CFG/Guidance Scale) | Select | Default 0 (uses style CFG), 1-30+, sequences (4-7, 7-10, etc.); best 6-10 for FLUX   |
| **shape** (Resolution) | Select | Portrait (512x768), Square (768x768), Landscape (768x512), Small square (512x512), sequences/random   |
| **numImages** (Qty) | Select | 1-100   |
| **qBooster** (Aesthetic) | Select + Toggle | - to 11 (Best Quality); sequences 11-0; toggle advAESTHETIC   |
| **seed** | Paragraph/Text | Smart Seed btn, Skip btn (disabled 1), Wipe btn; random -1   |

## Buttons & Toggles
- **Generate buttons**: generateBtnTwo (ghost), main generateButtonEl.
- **Copy buttons**: For prompts, negatives, FilterText, notepad downloads.
- **Live Input toggle** (liveInputBtn): Activates fullPrompt/fullNegativePrompt editing.
- **Notepad save/load**: userGiveName, setNotepadcharacter/outfits/etc..
- **Tools**: ShuffleWordsBtn (RNGKey), ShuffleNegBtn (NRNGKey), replaceTagPrompt (REPTGKey/etc.), addTagPrompt (ADDTGKey), removeTagPrompt (RMVTGKey), walkingTagPrompt (WALKey), fixedSeedShortcut.
- **Auto-gen**: autoGenButton (start/stop; gallery save/download toggles).
- **Other**: Img Metadata Reader, Old Shared Links converter, Scripts/Hack (userHack textarea), Title/Subtitle remember toggles, Display slider creator.
- **Style mode toggles**: basicMode, activeMainStyle (anime/realistic/other/custom).

## Advanced Features
- **Randomizers**: advRng for styles/colors/outfits; betterSEQUENCE; [RANDOM], [SEQUENCE], [COLOR], [COLORBASIC], [NATIONALITY] shortcuts.
- **Tools Functions**: Shuffle/replace/add/remove/walk tags; log variations (logShuffleTags/logAddRemoveTags); auto-reset permutations.
- **Gallery/Output**: Private save, auto-save/download, regenerate, remove background, image info, CFG display.
- **Comments/Chat**: Multi-channels (General, AI chat, Prompts, etc.); slash commands, emojis.
- **LocalStorage**: myStyles/Characters/Outfits/Bg lists; saved prompts (savedUserPrompt slots); remembers most inputs.
- **Other**: characterQualityPrompt toggle, autoCorrect/whitespace/filter1/qBooster processing, SharedLinkVerif, hacking area.
