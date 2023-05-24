import { vec2 } from "gl-matrix";
import { IntVector2 } from "../../utility/UniversalType";

export interface PhysicsTransform {
    id : number,
    position: IntVector2,
    scale: IntVector2,
    rotation: number,

    velocity?: IntVector2,
    acceleration?: IntVector2,
    angular?: number,
    radius?: number,
}