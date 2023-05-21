export interface  SpriteSyntaxStruct {
    name: string,
    sprites: SpriteStruct[],
    width: number,
    height: number,
}

export interface  SpriteStruct {
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,

    pivot_x: number,
    pivot_y: number,

    bound_width: number,
    bound_height: number,

    vertices: number[],
    triangle: number[],
}

export interface SceneLayoutStruct {
    name: string,
    frame_height: number,
    frame_width: number,

    screen_height: number,
    screen_width: number,

    spriteLayoutStructs : SpriteLayoutStruct[]
}

export interface SpriteLayoutStruct {
    texture_name: string,
    sprite_name: string,

    x: number,
    y: number,
    scale_x: number,
    scale_y: number,
    rotation: number,

    flip_x: number,
    flip_y: number,

    tag: number,
    properties: string,
}