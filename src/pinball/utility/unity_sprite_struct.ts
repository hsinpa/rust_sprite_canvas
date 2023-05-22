import { IntVector2 } from "../../utility/UniversalType";

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
    id: number,
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

export enum CollisionType { Line = 0, Rect, Oval, Sphere }

export interface ColliderStruct {
    collisionType: CollisionType,
    data: string,
}

export interface LineCollision {
    point_a: IntVector2;
    point_b: IntVector2;
}

export interface RectCollision
{
    x: number;
    y: number;

    height: number;
    width: number;
}

export interface OvalCollision
{
    sphere_a : SphereCollision;
    sphere_b : SphereCollision;
}

export interface SphereCollision
{
    x: number;
    y: number;
    radius: number;
}