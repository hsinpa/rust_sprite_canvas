import { vec2 } from "gl-matrix";

export interface DynamicPhysicsObject {
    id : number,
    position: vec2,
    angular: number,
    velocity: vec2,
}