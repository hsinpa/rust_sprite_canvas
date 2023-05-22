import { vec2 } from "gl-matrix";
import { IntVector2 } from "../../utility/UniversalType";

export interface DynamicPhysicsObject {
    id : number,
    position: IntVector2,
    velocity: IntVector2,
    acceleration: IntVector2,

    rotation: number,
    angular: number,
}

export interface SphereObject extends DynamicPhysicsObject{
    radius: number,
}

export enum DynamicsType {
    Sphere = 0,
}