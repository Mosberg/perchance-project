import CellStageScene from './scene.js';
import gameConfig from './config/game.js';

const cfg = Object.assign({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [CellStageScene],
}, gameConfig.renderer || {});

window.addEventListener('load', () => {
  // expose config to window for debugging
  window._CELL_GAME_CONFIG = gameConfig;
  new Phaser.Game(cfg);
});
