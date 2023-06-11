import { vec2 } from "gl-matrix";
import { IntVector2 } from "../../utility/UniversalType";
import { Vector2 } from "../../utility/VectorMath";

export interface PhysicsTransform {
    id : number,
    position: Vector2,
    scale: Vector2,
    rotation: number,

    velocity?: Vector2,
    acceleration?: Vector2,
    angular?: number,
    radius?: number,

    last_position?: Vector2,
    last_velocity?: Vector2,

    last_interact_object: number,
}
