# ai-text-to-image-generator

## Type
generator

## Purpose
A *fast*, unlimited, no login (ever!!!), AI image generator. Generate large *batches* of images all in just a few seconds. Generate AI art from text, completely free, online, no login or sign-up, no daily credit limits/restrictions/gimmicks, and it's fast. Other AI art generators often have annoying daily credit limits and require sign-up, or are slow - this one doesn't. Use this AI to generate high quality art, photos, cartoons, drawings, anime, thumbnails, pfps, and more. Create OCs, anime characters, AI villains, fanfic artwork, and pretty much anything else. It's an AI-based image generator - i.e. a text-to-image model. No watermark, no account needed, unlimited images. Type words, make pics.

## Files
- `ai-text-to-image-generator.html`
- `ai-text-to-image-generator.perchance`

## What It Does
- Provides generator-level functionality inside `C:\Users\Rasmu\Documents\perchance.org-project-mosberg\mosberg-perchance.org\generators\ai-text-to-image-generator`.
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
- It looks more intimidating than it actually is - you can ignore almost everything here.
- You'll probably just want to scroll down to the 'artStyle' list and edit those - it's pretty self-explanatory, just follow the format.
- Note: the t2i-framework-plugin makes all user inputs from the `userInputs` list accessible by name as [input.theNameOfTheInput], as shown here:
- Note: imageOptions can instead be a JavaScript function, like this:

