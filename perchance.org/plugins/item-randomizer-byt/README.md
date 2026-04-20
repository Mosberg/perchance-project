# item-randomizer-byt

## Type
plugin

## Purpose
AdvRS = {import:item-randomizer-byt}

## Files
- `item-randomizer-byt.html`
- `item-randomizer-byt.perchance`

## What It Does
- Provides plugin-level functionality inside `C:\Users\Rasmu\Documents\perchance.org-project-mosberg\mosberg-perchance.org\plugins\item-randomizer-byt`.
- Is intended to be used together with the other modules in this repository.
- Exposes behavior through its `.perchance` implementation and optional `.html` companion page.

## Usage
Import with `{import:item-randomizer-byt}` and evaluate it where needed in your generator/framework.

## Configuration
- Check the module's `.perchance` file for `settings`, ``, and exported functions/aliases.
- If this module is imported by wrappers/frameworks, configure it from the parent generator settings.

## Compatibility
- Built for Perchance module import patterns used in this repository.
- If dependencies are imported by name, ensure those imports are available in the same environment.

## Source Notes
- AdvRS = {import:item-randomizer-byt}
- Choose a random item
- Those are the variable names, the 'name' in the argument is only to give a name for those variables so they can be 'unique' and this function can be used in others differents styles without overwritten them (without having to create several functions too).
- so the names will be (change 'name' by the choose name):
- nameRandomItem -> it will have the values including prompt and negative, but to call those values is necessary to use like this: nameRandomItem.prompt, if the list have mixed items: [nameRandomItem.prompt || nameRandomItem].

