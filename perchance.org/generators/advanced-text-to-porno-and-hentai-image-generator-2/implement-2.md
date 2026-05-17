// AI Erotica Generation Suite - Explicit Adult Content Engine
const NSFW_ENHANCEMENT_MODES = {
  HARDCORE: "graphic, unflinching detail",
  SENSUAL: "slow-burn arousal, teasing",
  TABOO: "kink-specific descriptors",
  HYPERREAL: "clinical precision + wet textures"
};

function generateExplicitPrompt(seed, enhancementMode = NSFW_ENHANCEMENT_MODES.HARDCORE) {
  const BODY_FOCUS = {
    FEMALE: ["glistening labia", "pert nipples", "jiggling asscheeks"],
    MALE: ["veiny erection", "swollen glans", "taut balls"],
    TRANS: ["dripping girlcock", "bouncing tits", "plush ass"],
    FUTA: ["throbbing shaft", "dripping slit", "heaving chest"]
  };

  const ACTIONS = {
    SOLO: ["fingering herself deeply", "slapping cock against belly", "squirting violently"],
    PAIRED: ["facefucking greedily", "taking knot with whimpers", "double penetration gaping"],
    GROUP: ["bukakke facial", "gloryhole train", "orgy entanglement"]
  };

  const FLUID_DESCRIPTORS = [
    "strands of viscous precum", "pussy juice dripping down thighs",
    "thick ropes of cum painting skin", "anal leakage glistening"
  ];

  const CINEMATIC_DETAILS = [
    "macro shot of penetration", "POV cunnilingus angle",
    "up-skirt voyeur framing", "sweat dripping in 8K detail"
  ];

  let prompt = `${seed}\n`;
  prompt += `EXTREME CLOSEUP of ${randomChoice(BODY_FOCUS[getGender(seed)])}, `;
  prompt += `${randomChoice(ACTIONS[getActionType(seed)])} with ${randomChoice(FLUID_DESCRIPTORS)}.\n`;
  prompt += `Shot composition: ${randomChoice(CINEMATIC_DETAILS)}.\n`;
  prompt += `Enhancement mode: ${enhancementMode} - `;

  switch(enhancementMode) {
    case NSFW_ENHANCEMENT_MODES.HARDCORE:
      prompt += "visible pulsing sphincter, cervix bulge, cum bubbling from urethra";
      break;
    case NSFW_ENHANCEMENT_MODES.TABOO:
      prompt += "reluctance tears, shame-blush, forbidden tension in body language";
      break;
    default:
      prompt += "high-fidelity skin textures, realistic subsurface scattering";
  }

  return prompt;
}

// Example usage:
generateExplicitPrompt(
  "shy schoolgirl first time anal",
  NSFW_ENHANCEMENT_MODES.TABOO
);

/* Output:
shy schoolgirl first time anal
EXTREME CLOSEUP of quivering rosebud, taking knot with whimpers with anal leakage glistening.
Shot composition: POV missionary angle with panties around one ankle.
Enhancement mode: taboo - reluctance tears, shame-blush, forbidden tension in body language
*/
