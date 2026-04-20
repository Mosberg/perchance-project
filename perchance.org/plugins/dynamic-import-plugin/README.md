# dynamic-import-plugin

## Type
plugin

## Purpose
TODO: I should allow generatorName to be an array of names so they can be preloaded/loaded with a single request.

## Files
- `dynamic-import-plugin.html`
- `dynamic-import-plugin.perchance`

## What It Does
- Provides plugin-level functionality inside `C:\Users\Rasmu\Documents\perchance.org-project-mosberg\mosberg-perchance.org\plugins\dynamic-import-plugin`.
- Is intended to be used together with the other modules in this repository.
- Exposes behavior through its `.perchance` implementation and optional `.html` companion page.

## Usage
Import with `{import:dynamic-import-plugin}` and evaluate it where needed in your generator/framework.

## Configuration
- Check the module's `.perchance` file for `settings`, ``, and exported functions/aliases.
- If this module is imported by wrappers/frameworks, configure it from the parent generator settings.

## Compatibility
- Built for Perchance module import patterns used in this repository.
- If dependencies are imported by name, ensure those imports are available in the same environment.

## Source Notes
- TODO: I should allow generatorName to be an array of names so they can be preloaded/loaded with a single request.
- And in that case it'd return an object like {foo:fooRootOr$output, bar:barRootOr$output, ...}
- *synchronously* download the lists text (and cache it):
- This is endpoint is public, stable, and has a backwards-compatibility guarantee, so you're free to use it in your own plugins.
- You give it a list of comma-separated names like generatorNames=foo,bar and it returns an object like {success:true, generators:{foo:{name:"foo", code:"...", imports:[...]}, bar: ... }

