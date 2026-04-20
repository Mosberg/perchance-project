# smartseed

## Type
plugin

## Purpose
This change the value of the variable 'skipNumber' that is used in the others functions.

## Files
- `smartseed.html`
- `smartseed.perchance`

## What It Does
- Provides plugin-level functionality inside `C:\Users\Rasmu\Documents\perchance.org-project-mosberg\mosberg-perchance.org\plugins\smartseed`.
- Is intended to be used together with the other modules in this repository.
- Exposes behavior through its `.perchance` implementation and optional `.html` companion page.

## Usage
Import with `{import:smartseed}` and evaluate it where needed in your generator/framework.

## Configuration
- Check the module's `.perchance` file for `settings`, ``, and exported functions/aliases.
- If this module is imported by wrappers/frameworks, configure it from the parent generator settings.

## Compatibility
- Built for Perchance module import patterns used in this repository.
- If dependencies are imported by name, ensure those imports are available in the same environment.

## Source Notes
- This change the value of the variable 'skipNumber' that is used in the others functions.
- In short, use it in a button, each click in the button will raise the skipNumber value by 1 until 10 when it resets.
- It also add and remove a class to the button and can change the text/label to inform the currently value.
- smarSeed needs to be called everytime at the start, for example: prompt = [smartSeed(skipNumber)][input.description][incput.artStyle]
- skipNumber is used here, by default the value is 1 so it will always

