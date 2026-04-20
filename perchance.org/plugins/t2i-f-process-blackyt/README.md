# t2i-f-process-blackyt

## Type
plugin

## Purpose
.replace(/, (?=[A-Z]\b(?![A-Z]))/g, '. ') // Makes it a new sentence if next word starts with capital e.g. ", Hello" into ". Hello"

## Files
- `t2i-f-process-blackyt.perchance`

## What It Does
- Provides plugin-level functionality inside `C:\Users\Rasmu\Documents\perchance.org-project-mosberg\mosberg-perchance.org\plugins\t2i-f-process-blackyt`.
- Is intended to be used together with the other modules in this repository.
- Exposes behavior through its `.perchance` implementation and optional `.html` companion page.

## Usage
Import with `{import:t2i-f-process-blackyt}` and evaluate it where needed in your generator/framework.

## Configuration
- Check the module's `.perchance` file for `settings`, ``, and exported functions/aliases.
- If this module is imported by wrappers/frameworks, configure it from the parent generator settings.

## Compatibility
- Built for Perchance module import patterns used in this repository.
- If dependencies are imported by name, ensure those imports are available in the same environment.

## Source Notes
- .replace(/, (?=[A-Z]\b(?![A-Z]))/g, '. ') // Makes it a new sentence if next word starts with capital e.g. ", Hello" into ". Hello"
- .replace(/[\[]/g, "\\[").replace(/[\]]/g, "\\]");
- else {
- return FinalData;
- }

