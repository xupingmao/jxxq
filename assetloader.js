/**
 * Asset pre-loader object. Loads all images
 */
var assetLoader = (function() {
    // images dictionary
    this.imgs = {
        'bg': 'imgs/bg.jpg',
        'bg_old': 'imgs/bg_old.png',
        'sky': 'imgs/sky.png',
        'backdrop': 'imgs/backdrop.png',
        'backdrop2': 'imgs/backdrop_ground.png',
        'grass': 'imgs/grass.png',
        'space_grass': 'imgs/space_grass.png',
        // 'avatar_normal' : 'imgs/normal_walk.png',
        'head': 'imgs/head.png',
        'tail': 'imgs/tail.png',
        'body_1': 'imgs/body_1.png',
        'body_2': 'imgs/body_2.png',
        'body_3': 'imgs/body_3.png',
        'avatar_normal': 'imgs/actor_nzj.png',
        'water': 'imgs/water.png',
        'grass1': 'imgs/grassMid1.png',
        'grass2': 'imgs/grassMid2.png',
        'bridge': 'imgs/bridge.png',
        'plant': 'imgs/plant.png',
        'bush1': 'imgs/bush1.png',
        'bush2': 'imgs/bush2.png',
        'cliff': 'imgs/grassCliffRight.png',
        'spikes': 'imgs/spikes.png',
        'slime': 'imgs/slime.png',
        'bullet': 'imgs/bullet.png',
        'bullet_1': 'imgs/bullet_1.png',
        'bullet_2': 'imgs/bullet_2.png',
        'enemy_1': 'imgs/enemy_1.png',
        'enemy_2': 'imgs/enemy_2.png',
        'enemy_3': 'imgs/enemy_3.png',
        'enemy_4': 'imgs/enemy_4.png',
        'enemy_5': 'imgs/enemy_5.png',
        'enemy_6': 'imgs/enemy_6.png',
        'enemy_7': 'imgs/enemy_7.png',
        'enemy_8': 'imgs/enemy_8.png',
        'enemy_9': 'imgs/enemy_9.png',
        'box_1': 'imgs/box_1.png',
        'hit_effect_01': 'imgs/hit_effect_01.png',
        'foreground_1': 'imgs/foreground_1.png',
        'foreground_2': 'imgs/foreground_2.png',
        'foreground_3': 'imgs/foreground_3.png',
        'sgp_bullet_2': 'imgs/sgp_bullet_2.png',
        'numbers': 'imgs/numbers.png',
        'numbers_red': 'imgs/numbers_red.png',
        'kill': 'imgs/kill.png',
        'life': 'imgs/life.png',
        'score': 'imgs/score.png',
    };

  // sounds dictionary
  this.sounds      = {
    'bg'            : 'sounds/bg.mp3',
    'jump'          : 'sounds/jump.mp3',
    'gameOver'      : 'sounds/gameOver.mp3',
    'bullet_attack': 'sounds/bullet_attack.wav',
    'bom_attack': 'sounds/bom_attack.wav',
  };

  var assetsLoaded = 0;                                // how many assets have been loaded
  var numImgs      = Object.keys(this.imgs).length;    // total number of image assets
  var numSounds    = Object.keys(this.sounds).length;  // total number of sound assets
  this.totalAssest = numImgs;                          // total number of assets

  /**
   * Ensure all assets are loaded before using them
   * @param {number} dic  - Dictionary name ('imgs', 'sounds', 'fonts')
   * @param {number} name - Asset name in the dictionary
   */
  function assetLoaded(dic, name) {
    // don't count assets that have already loaded
    if (this[dic][name].status !== 'loading') {
      return;
    }

    this[dic][name].status = 'loaded';
    assetsLoaded++;

    // progress callback
    if (typeof this.progress === 'function') {
      this.progress(assetsLoaded, this.totalAssest);
    }

    // finished callback
    if (assetsLoaded === this.totalAssest && typeof this.finished === 'function') {
      this.finished();
    }
  }

  /**
   * Check the ready state of an Audio file.
   * @param {object} sound - Name of the audio asset that was loaded.
   */
  function _checkAudioState(sound) {
    if (this.sounds[sound].status === 'loading' && this.sounds[sound].readyState === 4) {
      assetLoaded.call(this, 'sounds', sound);
    }
  }

  /**
   * Create assets, set callback for asset loading, set asset source
   */
  this.downloadAll = function() {
    var _this = this;
    var src;

    // load images
    for (var img in this.imgs) {
      if (this.imgs.hasOwnProperty(img)) {
        src = this.imgs[img];

        // create a closure for event binding
        (function(_this, img) {
          var element = new Image();
          _this.imgs[img] = element;
          _this.imgs[img].status = 'loading';
          _this.imgs[img].name = img;
          _this.imgs[img].onload = function() { assetLoaded.call(_this, 'imgs', img) };
          _this.imgs[img].src = src;
          element.style.display = "none";
          document.body.appendChild(element);
        })(_this, img);
      }
    }

    // load sounds
    for (var sound in this.sounds) {
      if (this.sounds.hasOwnProperty(sound)) {
        src = this.sounds[sound];

        // create a closure for event binding
        (function(_this, sound) {
          _this.sounds[sound] = new Audio();
          _this.sounds[sound].status = 'loading';
          _this.sounds[sound].name = sound;
          _this.sounds[sound].addEventListener('canplay', function() {
            _checkAudioState.call(_this, sound);
          });
          _this.sounds[sound].src = src;
          _this.sounds[sound].preload = 'auto';
          _this.sounds[sound].load();
        })(_this, sound);
      }
    }
  }

  this.pauseSounds = function () {
    for (var sound in this.sounds) {
      if (this.sounds.hasOwnProperty(sound)) {
        sound = this.sounds[sound];
        sound.pause();
      }
    }
  }

  return {
    imgs: this.imgs,
    sounds: this.sounds,
    totalAssest: this.totalAssest,
    downloadAll: this.downloadAll,
    pauseSounds: this.pauseSounds,
  };
})();

/**
 * Show asset loading progress
 * @param {integer} progress - Number of assets loaded
 * @param {integer} total - Total number of assets
 */
assetLoader.progress = function(progress, total) {
  var pBar = document.getElementById('progress-bar');
  pBar.value = progress / total;
  document.getElementById('p').innerHTML = Math.round(pBar.value * 100) + "%";
}

/**
 * Load the main menu
 */
assetLoader.finished = function() {
  mainMenu();
}
