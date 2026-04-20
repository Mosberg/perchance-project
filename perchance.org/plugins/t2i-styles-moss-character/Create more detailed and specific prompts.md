# Create more detailed and specific prompts for anime-style character generation, with a focus on painterly art styles and various anime influences. The prompts should be designed to produce high-quality, detailed, and visually appealing anime character artwork, while also allowing for customization based on the input description and negative prompts.

```perchance
$output
  Painted Anime
    prompt // this style is biased towards female characters due to the biases of the artists mentioned, so we alter the description if 'male' is mentioned to boost 'maleness' and supress 'femaleness'
      [input.description], art by atey ghailan, painterly anime style at pixiv, art by kantoku, in art style of redjuice/necömi/rella/tiv pixiv collab, your name anime art style, masterpiece digital painting, exquisite lighting and composition, inspired by wlop art style, 8k, sharp, very detailed, high resolution, illustration.\n\nOverall, it's an absolute world-class masterpiece painterly anime-inspired digital art. It's an aesthetically pleasing painterly anime-inspired digital artwork with impeccable attention to detail and impressive composition. ^2
      painterly anime artwork, [input.description], world-class masterpiece, fine details, breathtaking artwork, painterly art style, high quality, 8k, very detailed, high resolution, exquisite composition and lighting.\n\nOverall, it's an absolute world-class masterpiece painterly anime artwork. It's an aesthetically pleasing painterly anime artwork with impeccable attention to detail and impressive composition.
    negative = [input.negative]
    meta:tags = [({anime:100, painting:100, paintedAnime:100, drawing:55, cartoon:50})]
    modifiers = [animeModifiers]

animeModifiers
  style
    Ghibli = , Ghibli art style, Spirited Away art style
    Your Name = , Your Name art style
    Paprika = , Paprika art style
    My Hero Academia = , My Hero Academia art style
    Hunter x Hunter = , Hunter x Hunter art style
    Attack on Titan = , Attack on Titan art style
  effect
    multi-view = , multiple views
    toon = , cartoon-style bold line work, vibrant colors, cel shading
    vintage = , cel shading, vintage anime
    ethereal = , glow, god rays, ethereal, dreamy, heavenly, otherworldly, dream-like, breathtaking, captivating, divine
    outline = , outline, white outline
```

## Create more detailed and specific prompts for:

- Simpsons Character Generation
- Pixar Character Generation
- Disney Character Generation
- Cartoon Character Generation
- Video Game Character Generation
- Comic Book Character Generation
- Pokemon Character Generation
- Marvel Character Generation
- DC Character Generation
- Anime Character Generation (with various art styles and influences)
