export const Config = Object.freeze({
    pinball_spritesheet: "./config/pinball_sprite.json",
    pinball_texture: "./texture/pinball_sprite.png",

    pinball_map_layout: "./config/SampleScene.json",
});

export const PinballLayer = Object.freeze({
    "Default": 0,
    "Flipper_Left": 6,
    "Flipper_Right": 7,
    "Ball": 8,
    "SphereBumper": 9,
    "SideBumper": 10,
    "Shooter": 11,

});

export const GRAVITY = -10;
export const GameConfig = Object.freeze({
    Gravity : -10,
    SideBumperStrength : 600,
    SphereBumperStrength : 700,
    Restitution: 0.8
});