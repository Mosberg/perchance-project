# limitless-ai

## Type
generator

## Purpose
AI text to image generator. Generate AI art from text, completely free, no login or sign-up, no daily credit limits, and it's fast. Most AI art generators have daily credits and require sign-up, or are slow - not this one. Use this AI to generate high quality art, photos, cartoons, drawings, anime, and more. Create OCs, anime characters, sexy villains, fanfic artwork, and pretty much anything else. It's an AI-based image generator that uses the Stable Diffusion text-to-image model. No watermark, no signup/login, unlimited images. Type words, get pics.

## Files
- `limitless-ai.html`
- `limitless-ai.perchance`

## What It Does
- Provides generator-level functionality inside `C:\Users\Rasmu\Documents\perchance.org-project-mosberg\mosberg-perchance.org\generators\limitless-ai`.
- Is intended to be used together with the other modules in this repository.
- Exposes behavior through its `.perchance` implementation and optional `.html` companion page.

## Usage
Open the generator's `.perchance` file in Perchance and run/publish as normal.

## Configuration
- Check the module's `.perchance` file for `settings`, ``, and exported functions/aliases.
- If this module is imported by wrappers/frameworks, configure it from the parent generator settings.

## Compatibility
- Built for Perchance module import patterns used in this repository.
- If dependencies are imported by name, ensure those imports are available in the same environment.

## Source Notes
- Feel free to edit the settings below and then save your own copy of this generator!
- You'll probably just want to scroll down to the artStyle list and edit those - it's pretty self-explanatory, just follow the format.
- note: the t2i-framework-plugin makes all user inputs from the `userInputs` list accessible by name as [input.theNameOfTheInput], as shown here:
- we use artstyle-specific random prompts if available, otherwise fall back to randomDescriptions list:
- we use artstyle-specific random prompts if available, otherwise fall back to randomDescriptions list:

