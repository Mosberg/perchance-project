# dynamic-background-blackyt

## Type
plugin

## Purpose
This create the UI wallpaper for user interaction.

## Files
- `dynamic-background-blackyt.html`
- `dynamic-background-blackyt.perchance`

## What It Does
- Provides plugin-level functionality inside `C:\Users\Rasmu\Documents\perchance.org-project-mosberg\mosberg-perchance.org\plugins\dynamic-background-blackyt`.
- Is intended to be used together with the other modules in this repository.
- Exposes behavior through its `.perchance` implementation and optional `.html` companion page.

## Usage
Import with `{import:dynamic-background-blackyt}` and evaluate it where needed in your generator/framework.

## Configuration
- Check the module's `.perchance` file for `settings`, ``, and exported functions/aliases.
- If this module is imported by wrappers/frameworks, configure it from the parent generator settings.

## Compatibility
- Built for Perchance module import patterns used in this repository.
- If dependencies are imported by name, ensure those imports are available in the same environment.

## Source Notes
- This create the UI wallpaper for user interaction.
- CopyPaste, line 2 in perhance panel, line 3 and 4 in html panel.
- DBG = {import:dynamic-background-blackyt}
- <div id="bGround">[DBG.BGCustom(defaultImageList, defaultImageList, image1List)]</div>
- [DBG.MainRender]

