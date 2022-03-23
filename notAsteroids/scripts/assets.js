var engineSound = new Howl({
    src: ['./assets/audio/engine.ogg', './assets/audio/engine.mp3'],
    loop: true,
    volume: 0.3
});

var laserSound = new Howl({
    src: ['./assets/audio/laser.ogg', './assets/audio/laser.mp3'],
    volume: 0.5
});

var explosion1Sound = new Howl({
    src: ['./assets/audio/explosion_1.ogg', './assets/audio/explosion_1.mp3'],
    volume: 0.5
});

export { engineSound, laserSound, explosion1Sound };