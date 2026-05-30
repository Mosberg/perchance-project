import gameConfig from './config/game.js';
import partsData from './data/parts.js';
import enemiesData from './data/enemies.js';

class CellStageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CellStageScene' });
  }

  create() {
    this.worldWidth = gameConfig.worldWidth || 2520;
    this.worldHeight = gameConfig.worldHeight || 1580;
    this.cameras.main.setBackgroundColor(0x04111f);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    this.settings = Object.assign({}, gameConfig.defaults || {}, {
      difficulty: 'Normal',
      muted: false,
      volume: 0.22,
      showCurrents: true,
      autoAttack: false,
    });
    this.spawnSpeedFactor = 1.0;

    this.spawnFields = this.add.group();
    this.spawnPlants(gameConfig.initialPlants || 35);
    this.spawnMeat(gameConfig.initialMeat || 14);
    this.spawnEnemies(gameConfig.initialEnemies || 10);
    this.spawnMeteorShards(gameConfig.initialShards || 2);

    this.spawnEvents = [];

    this.createCurrentField();
    this.createPlayer();
    this.createControls();
    this.createUI();
    this.updateDifficulty();
    this.initAudio();
    this.createColliders();

    if (!this.settings.showCurrents) {
      this.currentField.getChildren().forEach(zone => zone.setVisible(false));
    }

    this.scheduleSpawnEvents();

    this.updateHud();
    this.showHint('Collect DNA, grow your cell, and evolve your species. Use arrows/WASD to swim. SPACE attacks nearby foes.');
  }

  createPlayer() {
    this.player = this.add.circle(640, 360, 22, 0x7bf1c8).setDepth(2);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true).setBounce(0.25).setDrag(190, 190);
    this.player.radius = 22;
    this.player.maxHealth = 10;
    this.player.health = 10;
    this.player.dna = 0;
    this.player.progress = 0;
    this.player.speed = 210;
    this.player.parts = {
      filterMouth: true,
      jaw: false,
      proboscis: false,
      spike: false,
      cilia: false,
      electric: false,
      poison: false,
    };
    this.player.equippedParts = {
      filterMouth: true,
      jaw: false,
      proboscis: false,
      spike: false,
      cilia: false,
      electric: false,
      poison: false,
    };
    this.player.diet = { plant: 0, meat: 0, egg: 0 };
    this.player.evolved = false;

    this.cameraCenter = this.cameras.main.centerOn(this.player.x, this.player.y);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
  }

  createCurrentField() {
    this.currentField = this.add.group();
    for (let i = 0; i < 14; i++) {
      const x = Phaser.Math.Between(120, this.worldWidth - 120);
      const y = Phaser.Math.Between(120, this.worldHeight - 120);
      const zone = this.add.rectangle(x, y, 220, 100, 0x1a4b78, 0.12).setDepth(0.5);
      this.currentField.add(zone);
    }
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  createUI() {
    this.dnaValue = document.getElementById('dnaValue');
    this.healthValue = document.getElementById('healthValue');
    this.progressValue = document.getElementById('progressValue');
    this.dietValue = document.getElementById('dietValue');
    this.difficultyValue = document.getElementById('difficultyValue');
    this.partsValue = document.getElementById('partsValue');
    this.goalValue = document.getElementById('goalValue');
    this.messagePanel = document.getElementById('messagePanel');
    this.messageText = document.getElementById('messageText');
    this.restartBtn = document.getElementById('restartBtn');
    this.menuToggleBtn = document.getElementById('menuToggleBtn');
    this.partMenu = document.getElementById('partMenu');
    this.partMenuList = document.getElementById('partMenuList');
    this.closeMenuBtn = document.getElementById('closeMenuBtn');
    this.difficultySelect = document.getElementById('difficultySelect');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.currentsToggleBtn = document.getElementById('currentsToggleBtn');
    this.autoAttackToggleBtn = document.getElementById('autoAttackToggleBtn');

    // Replace interactive DOM elements to remove any old listeners from prior scene runs
    this.restartBtn = this._replaceElement(this.restartBtn);
    this.menuToggleBtn = this._replaceElement(this.menuToggleBtn);
    this.closeMenuBtn = this._replaceElement(this.closeMenuBtn);
    this.difficultySelect = this._replaceElement(this.difficultySelect);
    this.soundToggleBtn = this._replaceElement(this.soundToggleBtn);
    this.volumeSlider = this._replaceElement(this.volumeSlider);
    this.currentsToggleBtn = this._replaceElement(this.currentsToggleBtn);
    this.autoAttackToggleBtn = this._replaceElement(this.autoAttackToggleBtn);

    this.restartBtn.addEventListener('click', () => this.restartGame());
    this.menuToggleBtn.addEventListener('click', () => this.togglePartMenu());
    this.closeMenuBtn.addEventListener('click', () => this.togglePartMenu());
    this.difficultySelect.addEventListener('change', () => this.updateDifficulty());
    this.soundToggleBtn.addEventListener('click', () => this.toggleSound());
    this.volumeSlider.addEventListener('input', () => this.updateVolume());
    this.currentsToggleBtn.addEventListener('click', () => this.toggleCurrents());
    this.autoAttackToggleBtn.addEventListener('click', () => this.toggleAutoAttack());

    this.soundToggleBtn.textContent = this.settings.muted ? 'Unmute' : 'Mute';
    this.currentsToggleBtn.textContent = this.settings.showCurrents ? 'Hide' : 'Show';
    this.autoAttackToggleBtn.textContent = this.settings.autoAttack ? 'On' : 'Off';

    this.buildPartMenu();
  }

  _replaceElement(el) {
    if (!el || !el.parentNode) return el;
    try {
      const clone = el.cloneNode(true);
      el.parentNode.replaceChild(clone, el);
      return clone;
    } catch (e) {
      return el;
    }
  }

  updateDifficulty() {
    this.settings = this.settings || {};
    this.settings.difficulty = this.difficultySelect.value;
    this.difficultyValue.textContent = this.settings.difficulty;
    const level = this.settings.difficulty;
    if (level === 'Easy') {
      this.player.maxHealth = 13;
      this.spawnSpeedFactor = 0.85;
    } else if (level === 'Hard') {
      this.player.maxHealth = 8;
      this.spawnSpeedFactor = 1.35;
    } else {
      this.player.maxHealth = 10;
      this.spawnSpeedFactor = 1.0;
    }
    this.player.health = Math.min(this.player.health, this.player.maxHealth);
    this.updateHud();
    this.resetSpawnTimers();
  }

  toggleCurrents() {
    this.settings.showCurrents = !this.settings.showCurrents;
    if (this.currentsToggleBtn) {
      this.currentsToggleBtn.textContent = this.settings.showCurrents ? 'Hide' : 'Show';
    }
    this.currentField.getChildren().forEach(zone => zone.setVisible(this.settings.showCurrents));
    this.playSound(this.settings.showCurrents ? 400 : 180, 0.1, 'triangle', 0.14);
  }

  toggleAutoAttack() {
    this.settings.autoAttack = !this.settings.autoAttack;
    if (this.autoAttackToggleBtn) {
      this.autoAttackToggleBtn.textContent = this.settings.autoAttack ? 'On' : 'Off';
    }
    this.playSound(this.settings.autoAttack ? 520 : 220, 0.08, 'square', 0.16);
  }

  scheduleSpawnEvents() {
    this.spawnEvents = [
      { delay: 4200, callback: () => this.spawnPlants(3) },
      { delay: 9400, callback: () => this.spawnMeat(2) },
      { delay: 14800, callback: () => this.spawnEnemies(1) },
      { delay: 22000, callback: () => this.spawnMeteorShards(1) },
    ].map(entry => this.time.addEvent({ delay: entry.delay / this.spawnSpeedFactor, callback: entry.callback, loop: true }));
  }

  resetSpawnTimers() {
    this.spawnEvents?.forEach(event => event.destroy());
    this.scheduleSpawnEvents();
  }

  toggleSound() {
    this.settings = this.settings || {};
    this.settings.muted = !this.settings.muted;
    this.soundToggleBtn.textContent = this.settings.muted ? 'Unmute' : 'Mute';
    this.playSound(260, 0.08, 'square', 0.12);
  }

  updateVolume() {
    this.settings = this.settings || {};
    this.settings.volume = parseFloat(this.volumeSlider.value);
  }

  initAudio() {
    this.audioCtx = null;
  }

  ensureAudioContext() {
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      return this.audioCtx;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    this.audioCtx = new AudioCtx();
    return this.audioCtx;
  }

  playSound(frequency, duration = 0.12, type = 'sine', volume = 0.18) {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;
    if (this.settings?.muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume * (this.settings?.volume ?? 1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    osc.start(now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.stop(now + duration);
  }

  togglePartMenu() {
    if (this.partMenu.hidden) {
      this.partMenu.hidden = false;
      this.playSound(360, 0.08, 'triangle', 0.18);
    } else {
      this.partMenu.hidden = true;
      this.playSound(180, 0.06, 'triangle', 0.15);
    }
  }

  restartGame() {
    if (this.messagePanel) {
      try { this.messagePanel.hidden = true; } catch(e) {}
      try { this.messagePanel.style.display = 'none'; } catch(e) {}
    }
    if (this.partMenu) {
      try { this.partMenu.hidden = true; } catch(e) {}
      try { this.partMenu.style.display = 'none'; } catch(e) {}
    }
    // clean up spawn timers, groups and audio before restart
    try { this.spawnEvents?.forEach(ev => ev.destroy()); } catch (e) {}
    try { this.spawnFields?.clear(true); } catch (e) {}
    try { this.plantGroup?.clear(true); this.meatGroup?.clear(true); this.enemyGroup?.clear(true); this.pickupGroup?.clear(true); } catch (e) {}
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch (e) {}
      this.audioCtx = null;
    }
    if (this.physics && this.physics.resume) this.physics.resume();
    // small delay to allow DOM updates before restarting
    this.time.delayedCall(80, () => this.scene.restart());
  }

  buildPartMenu() {
    const definitions = Array.isArray(partsData) ? partsData : [];

    this.partMenuList.innerHTML = definitions.map(def => {
      const owned = this.player.parts[def.key];
      const equipped = this.player.equippedParts[def.key];
      return `
        <div class="partRow">
          <div>
            <label>${def.label}</label>
            <div class="partDescription">${def.desc}</div>
          </div>
          <div>
            <input type="checkbox" data-key="${def.key}" ${owned ? '': 'disabled'} ${equipped ? 'checked' : ''} />
            <div class="partStatus">${owned ? 'Unlocked' : 'Locked'}</div>
          </div>
        </div>
      `;
    }).join('');

    this.partMenuList.querySelectorAll('input[type="checkbox"]').forEach(input => {
      // replace input nodes to ensure no stale listeners
      const fresh = this._replaceElement(input);
      fresh.addEventListener('change', (event) => {
        const key = event.target.dataset.key;
        const enabled = event.target.checked;
        this.togglePartEquip(key, enabled);
      });
    });
  }

  togglePartEquip(key, enabled) {
    if (!this.player.parts[key]) return;
    this.player.equippedParts[key] = enabled;
    this.updateHud();
    this.playSound(enabled ? 380 : 180, 0.08, enabled ? 'sine' : 'triangle', 0.18);
  }

  handleEnemyContact(player, enemy) {
    if (!enemy.active) return;
    const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
    if (distance > enemy.radius + this.player.radius + 16) {
      return;
    }

    const canAttack = this.player.equippedParts.spike || this.player.equippedParts.jaw || this.player.equippedParts.electric || this.player.equippedParts.proboscis;
    if (this.attackKey.isDown && canAttack) {
      const power = this.player.equippedParts.electric ? 4 : this.player.equippedParts.spike ? 3 : this.player.equippedParts.jaw ? 2 : 2;
      enemy.health -= power;
      const flashStyle = this.player.equippedParts.electric ? 0x87fffb : 0xffa2d1;
      enemy.setFillStyle(flashStyle, 1);
      this.playSound(420, 0.08, this.player.equippedParts.electric ? 'sawtooth' : 'square', 0.24);
      this.time.delayedCall(80, () => enemy.setFillStyle(0xd250f5, 0.92));
      if (enemy.health <= 0) {
        this.defeatEnemy(enemy);
      }
      return;
    }

    if (enemy.sizeCategory > 1 && enemy.health > 0) {
      this.player.health -= enemy.attack * 0.6;
      this.player.body.setVelocity(this.player.body.velocity.x * 0.4, this.player.body.velocity.y * 0.4);
      this.playSound(120, 0.08, 'triangle', 0.14);
      this.updateHud();
      if (this.player.health <= 0) {
        this.endGame('Your cell was consumed. Restart to try a new evolutionary path.');
      }
    }
  }

  createColliders() {
    this.plantGroup = this.physics.add.group();
    this.meatGroup = this.physics.add.group();
    this.enemyGroup = this.physics.add.group();
    this.pickupGroup = this.physics.add.group();

    this.gatherPlants();
    this.gatherMeat();
    this.gatherEnemies();
    this.gatherPickups();

    this.physics.add.overlap(this.player, this.plantGroup, this.handlePlant, null, this);
    this.physics.add.overlap(this.player, this.meatGroup, this.handleMeat, null, this);
    this.physics.add.overlap(this.player, this.pickupGroup, this.handlePickup, null, this);
    this.physics.add.overlap(this.player, this.enemyGroup, this.handleEnemyContact, null, this);
  }

  gatherPlants() {
    this.spawnFields.getChildren().forEach(child => {
      if (child.foodType === 'plant') {
        this.plantGroup.add(child);
      }
    });
  }

  gatherMeat() {
    this.spawnFields.getChildren().forEach(child => {
      if (child.foodType === 'meat') {
        this.meatGroup.add(child);
      }
    });
  }

  gatherEnemies() {
    this.enemyGroup.clear(true);
    this.spawnFields.getChildren().forEach(child => {
      if (child.foodType === 'enemy') {
        this.enemyGroup.add(child);
      }
    });
  }

  gatherPickups() {
    this.pickupGroup.clear(true);
    this.spawnFields.getChildren().forEach(child => {
      if (child.foodType === 'pickup') {
        this.pickupGroup.add(child);
      }
    });
  }

  spawnPlants(amount) {
    for (let i = 0; i < amount; i++) {
      const x = Phaser.Math.Between(80, this.worldWidth - 80);
      const y = Phaser.Math.Between(80, this.worldHeight - 80);
      const radius = Phaser.Math.Between(9, 16);
      const plant = this.add.circle(x, y, radius, 0x44c96a, 0.9).setDepth(1);
      plant.foodType = 'plant';
      plant.value = 5;
      plant.body = this.physics.add.existing(plant, true).body;
      this.spawnFields.add(plant);
      this.plantGroup?.add(plant);
    }
  }

  spawnMeat(amount) {
    for (let i = 0; i < amount; i++) {
      const x = Phaser.Math.Between(100, this.worldWidth - 100);
      const y = Phaser.Math.Between(100, this.worldHeight - 100);
      const radius = Phaser.Math.Between(10, 18);
      const meat = this.add.circle(x, y, radius, 0xee5f5f, 0.92).setDepth(1);
      meat.foodType = 'meat';
      meat.value = 10;
      meat.body = this.physics.add.existing(meat, true).body;
      this.spawnFields.add(meat);
      this.meatGroup?.add(meat);
    }
  }

  spawnEnemies(amount) {
    const templates = Array.isArray(enemiesData) ? enemiesData : [];
    for (let i = 0; i < amount; i++) {
      const x = Phaser.Math.Between(120, this.worldWidth - 120);
      const y = Phaser.Math.Between(120, this.worldHeight - 120);
      const tmpl = templates.length ? templates[Phaser.Math.Between(0, templates.length - 1)] : { minRadius: 18, maxRadius: 34, baseHealth: 3, baseAttack: 1, speed: 28 };
      const radius = Phaser.Math.Between(tmpl.minRadius, tmpl.maxRadius);
      const enemy = this.add.circle(x, y, radius, 0xd250f5, 0.92).setDepth(1.4);
      enemy.foodType = 'enemy';
      enemy.sizeCategory = radius > 28 ? 3 : radius > 20 ? 2 : 1;
      enemy.health = (tmpl.baseHealth || 2) + enemy.sizeCategory * (tmpl.baseHealth || 2);
      enemy.attack = (tmpl.baseAttack || 1) + (enemy.sizeCategory - 1);
      enemy.speed = (tmpl.speed || 20) + enemy.sizeCategory * 8;
      enemy.body = this.physics.add.existing(enemy).body;
      enemy.body.setCollideWorldBounds(true).setBounce(1, 1).setVelocity(Phaser.Math.Between(-enemy.speed, enemy.speed), Phaser.Math.Between(-enemy.speed, enemy.speed));
      enemy.aiState = 'wander';
      enemy.nextStateTime = Phaser.Math.Between(1000, 2400);
      enemy.alertRange = 260 + enemy.sizeCategory * 10;
      enemy.fleeRange = 160;
      enemy.attackCooldown = 0;
      this.spawnFields.add(enemy);
      this.enemyGroup?.add(enemy);
    }
  }

  spawnMeteorShards(amount) {
    for (let i = 0; i < amount; i++) {
      const x = Phaser.Math.Between(140, this.worldWidth - 140);
      const y = Phaser.Math.Between(140, this.worldHeight - 140);
      const shard = this.add.star(x, y, 5, 10, 22, 0xffe066).setDepth(1.2);
      shard.foodType = 'pickup';
      shard.partKey = this.nextUnlockPart();
      shard.body = this.physics.add.existing(shard, true).body;
      this.spawnFields.add(shard);
      this.pickupGroup?.add(shard);
    }
  }

  nextUnlockPart() {
    const order = Array.isArray(partsData) ? partsData.map(p => p.key) : ['jaw','proboscis','spike','cilia','electric','poison'];
    for (const key of order) {
      if (!this.player || !this.player.parts[key]) return key;
    }
    return order.length ? order[0] : 'jaw';
  }

  handlePlant(player, plant) {
    if (!this.player.equippedParts.filterMouth && !this.player.equippedParts.proboscis) {
      return;
    }
    this.collectFood(plant, 'plant');
  }

  handleMeat(player, meat) {
    if (!this.player.equippedParts.jaw) {
      return;
    }
    this.collectFood(meat, 'meat');
  }

  handlePickup(player, pickup) {
    const key = pickup.partKey;
    this.player.parts[key] = true;
    this.player.equippedParts[key] = true;
    pickup.destroy();
    this.playSound(520, 0.16, 'sawtooth', 0.24);
    this.addDNA(16);
    this.showHint(`Unlocked ${this.humanPartName(key)}! Equip it in the Part Loadout menu.`);
    this.buildPartMenu();
    this.updateHud();
  }

  humanPartName(key) {
    const labels = {
      jaw: 'Jaw',
      proboscis: 'Proboscis',
      spike: 'Spike',
      cilia: 'Cilia',
      electric: 'Electric',
      poison: 'Poison',
    };
    return labels[key] || key;
  }

  defeatEnemy(enemy) {
    const reward = 16 + enemy.sizeCategory * 3;
    const meatChunks = Phaser.Math.Between(1, enemy.sizeCategory + 1);
    for (let i = 0; i < meatChunks; i++) {
      this.spawnMeat(1);
    }
    this.playSound(200 + enemy.sizeCategory * 40, 0.14, 'square', 0.24);
    this.addDNA(reward);
    enemy.destroy();
    this.cameras.main.shake(120, 0.004);
    this.updateHud();
  }

  collectFood(food, type) {
    const reward = type === 'plant' ? 6 : type === 'meat' ? 12 : 0;
    const dietKey = type === 'plant' ? 'plant' : 'meat';
    this.player.diet[dietKey] += reward;
    this.addDNA(reward);
    this.updateHud();
    this.showHint(type === 'plant' ? 'Plant matter consumed. Herbivore DNA rising.' : 'Meat chunk consumed. Carnivore DNA rising.');
    this.playSound(type === 'plant' ? 320 : 180, 0.1, type === 'plant' ? 'triangle' : 'square', 0.16);
    food.destroy();
  }

  addDNA(amount) {
    this.player.dna = Math.min(100, this.player.dna + amount);
    this.player.progress = Math.min(100, this.player.dna);
    this.updateGrow();
    if (this.player.progress >= 100 && !this.player.evolved) {
      this.completeEvolution();
    }
  }

  updateGrow() {
    const scale = 1 + Math.min(1.0, this.player.dna / 120);
    this.player.setScale(scale);
    this.player.radius = 22 * scale;
    this.player.body.setVelocity(this.player.body.velocity.x, this.player.body.velocity.y);
  }

  completeEvolution() {
    this.player.evolved = true;
    const diet = this.currentTrait();
    const text = `Your cell has evolved into a ${diet} trait card! This path will shape your Creature Stage growth.`;
    this.playSound(600, 0.28, 'triangle', 0.28);
    this.endGame(text, true);
  }

  currentTrait() {
    const { plant, meat } = this.player.diet;
    if (plant >= meat * 1.35) return 'Herbivore';
    if (meat >= plant * 1.35) return 'Carnivore';
    return 'Omnivore';
  }

  updateHud() {
    this.dnaValue.textContent = `${Math.round(this.player.dna)}`;
    this.healthValue.textContent = `${Math.max(0, Math.round(this.player.health))} / ${this.player.maxHealth}`;
    this.progressValue.textContent = `${Math.round(this.player.progress)}%`;
    this.dietValue.textContent = this.currentTrait();
    this.difficultyValue.textContent = this.settings?.difficulty || 'Normal';
    const equipped = Object.keys(this.player.equippedParts).filter(key => this.player.equippedParts[key]);
    this.partsValue.textContent = equipped.length ? equipped.map(key => this.humanPartName(key)).join(', ') : 'None';
  }

  showHint(text) {
    this.goalValue.textContent = text;
  }

  endGame(finalText, success = false) {
    this.messageText.textContent = finalText;
    document.getElementById('messageTitle').textContent = success ? 'Evolution Complete' : 'Game Over';
    this.messagePanel.hidden = false;
    this.physics.pause();
    this.playSound(success ? 540 : 140, 0.28, success ? 'triangle' : 'square', 0.24);
  }

  update(time, delta) {
    if (this.messagePanel && !this.messagePanel.hidden) {
      return;
    }
    const input = this.readMovement();
    const speed = this.player.equippedParts.cilia ? this.player.speed * 1.08 : this.player.speed;
    this.player.body.setAcceleration(input.x * speed * 3, input.y * speed * 3);

    this.player.body.setMaxSpeed(340);
    if (input.x === 0 && input.y === 0) {
      this.player.body.setAcceleration(0, 0);
    }

    this.updateEnemies(delta);
  }

  updateEnemies(delta) {
    this.enemyGroup.getChildren().forEach((enemy) => {
      if (!enemy.active) return;
      enemy.attackCooldown = Math.max(0, enemy.attackCooldown - delta);
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const distance = Math.hypot(dx, dy);

      if (distance < enemy.alertRange) {
        if (distance < enemy.fleeRange && this.player.dna > enemy.health * 4) {
          enemy.aiState = 'flee';
        } else {
          enemy.aiState = 'pursue';
        }
      } else if (enemy.nextStateTime <= 0) {
        enemy.aiState = 'wander';
        enemy.nextStateTime = Phaser.Math.Between(1200, 2600);
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        enemy.body.setVelocity(Math.cos(angle) * enemy.speed * 0.65, Math.sin(angle) * enemy.speed * 0.65);
      }

      if (enemy.aiState === 'pursue' && distance > 0) {
        const speed = enemy.speed * 1.2;
        enemy.body.setVelocity((dx / distance) * speed, (dy / distance) * speed);
      }

      if (enemy.aiState === 'flee' && distance > 0) {
        const speed = enemy.speed * 1.05;
        enemy.body.setVelocity((-dx / distance) * speed, (-dy / distance) * speed);
      }

      if (enemy.aiState === 'wander') {
        enemy.nextStateTime -= delta;
      }

      if (distance < enemy.radius + this.player.radius + 22 && enemy.attackCooldown <= 0) {
        enemy.attackCooldown = 700;
        if (!this.attackKey.isDown && enemy.sizeCategory > 1) {
          this.player.health -= enemy.attack * 0.4;
          this.playSound(120, 0.08, 'triangle', 0.12);
          this.updateHud();
          if (this.player.health <= 0) {
            this.endGame('Your cell was consumed. Restart to try a new evolutionary path.');
          }
        }
      }
    });
  }

  readMovement() {
    const x = (this.cursors.left.isDown || this.wasd.a.isDown ? -1 : 0) + (this.cursors.right.isDown || this.wasd.d.isDown ? 1 : 0);
    const y = (this.cursors.up.isDown || this.wasd.w.isDown ? -1 : 0) + (this.cursors.down.isDown || this.wasd.s.isDown ? 1 : 0);
    const magnitude = Math.hypot(x, y) || 1;
    return { x: x / magnitude, y: y / magnitude };
  }
}

export default CellStageScene;
