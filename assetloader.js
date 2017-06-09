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
        'box': 'imgs/boxCoin.png',
        'slime': 'imgs/slime.png',
        'bullet': 'imgs/bullet.png',
        'enemy_1': 'imgs/enemy_1.png',
        'enemy_2': 'imgs/enemy_2.png',
        'foreground_1': 'imgs/foreground_1.png',
        'foreground_2': 'imgs/foreground_2.png',
        'foreground_3': 'imgs/foreground_3.png',
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
          _this.imgs[img] = new Image();
          _this.imgs[img].status = 'loading';
          _this.imgs[img].name = img;
          _this.imgs[img].onload = function() { assetLoaded.call(_this, 'imgs', img) };
          _this.imgs[img].src = src;
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

  return {
    imgs: this.imgs,
    sounds: this.sounds,
    totalAssest: this.totalAssest,
    downloadAll: this.downloadAll
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
