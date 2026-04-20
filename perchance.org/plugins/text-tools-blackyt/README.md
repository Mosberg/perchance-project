# text-tools-blackyt

## Type
plugin

## Purpose
ðŸ‘„ðŸ†

## Files
- `text-tools-blackyt.html`
- `text-tools-blackyt.perchance`

## What It Does
- Provides plugin-level functionality inside `C:\Users\Rasmu\Documents\perchance.org-project-mosberg\mosberg-perchance.org\plugins\text-tools-blackyt`.
- Is intended to be used together with the other modules in this repository.
- Exposes behavior through its `.perchance` implementation and optional `.html` companion page.

## Usage
Import with `{import:text-tools-blackyt}` and evaluate it where needed in your generator/framework.

## Configuration
- Check the module's `.perchance` file for `settings`, ``, and exported functions/aliases.
- If this module is imported by wrappers/frameworks, configure it from the parent generator settings.

## Compatibility
- Built for Perchance module import patterns used in this repository.
- If dependencies are imported by name, ensure those imports are available in the same environment.

## Source Notes
- ðŸ‘„ðŸ†
- Transform based on caseType
- If there was no selection, just return transformed text
- Replace selection in textarea/input
- Restore selection

