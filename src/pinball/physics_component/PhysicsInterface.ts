import { DynamicPhysicsObject } from "../utility/pinball_types";
import { ColliderStruct, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";

export interface PositionTransformation {
    (local_position: IntVector2): IntVector2;
}

export abstract class PhysicsInterface {

    protected _sprite_layout: SpriteLayoutStruct;
    protected _collision_data: ColliderStruct;
    protected _positionTransformCallback: PositionTransformation;
    
    constructor(sprite_layout: SpriteLayoutStruct, collision_data: ColliderStruct, positionTransformCallback: PositionTransformation) {
        this._sprite_layout = sprite_layout;
        this._collision_data = collision_data;
        this._positionTransformCallback = positionTransformCallback;
    }

    abstract handle_collision(physicsObject: DynamicPhysicsObject): void;
}