# image-regeneration-byt

## Type
plugin

## Purpose
Update 04/03/26

## Files
- `image-regeneration-byt.html`
- `image-regeneration-byt.perchance`

## What It Does
- Provides plugin-level functionality inside `C:\Users\Rasmu\Documents\perchance.org-project-mosberg\mosberg-perchance.org\plugins\image-regeneration-byt`.
- Is intended to be used together with the other modules in this repository.
- Exposes behavior through its `.perchance` implementation and optional `.html` companion page.

## Usage
Import with `{import:image-regeneration-byt}` and evaluate it where needed in your generator/framework.

## Configuration
- Check the module's `.perchance` file for `settings`, ``, and exported functions/aliases.
- If this module is imported by wrappers/frameworks, configure it from the parent generator settings.

## Compatibility
- Built for Perchance module import patterns used in this repository.
- If dependencies are imported by name, ensure those imports are available in the same environment.

## Source Notes
- Update 04/03/26
- Negatives disabled: e-negative display set to none; negative with Copy function is an empty string
- newImg = {import:image-regeneration-byt}
- newImg.regenerateNewImg(data)
- :: :: //

