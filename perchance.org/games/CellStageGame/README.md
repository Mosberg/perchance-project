# Cell Stage | Phaser 4

A standalone Phaser 4 recreation of the Spore Cell Stage, built as a browser game prototype.

## Running the Game

Open `index.html` in a browser. For best results use a local static server if the browser blocks local file access.

### Optional local server

- Python 3: `python -m http.server 8000`
- Then open `http://localhost:8000` in your browser.

## Controls

- Arrow keys or WASD to move
- SPACE to attack nearby enemies
- Click the `Part Loadout` button to open the part selection menu

## Gameplay

- Collect plant matter and meat chunks to earn DNA.
- Unlock new parts by collecting meteor shards.
- Grow your cell and evolve to complete the stage.
- The HUD tracks DNA, health, progress, diet, and unlocked parts.

## Features

- Top-down swimming movement
- Plant and meat food items
- Evolving enemy AI with wandering, pursuit, and flee behavior
- Part selection menu to equip unlocked abilities
- Sound effects for pickups, combat, menu navigation, and evolution
- Growth and evolution progress tracking
- Simple end-state panel when evolution completes or the cell is defeated
