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