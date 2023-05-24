import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { Graphics } from "pixi.js";

export interface PositionTransformation {
    (local_position: IntVector2): IntVector2;
}

export abstract class PhysicsInterface {

    protected _id: number;
    protected _collision_data: ColliderStruct;
    protected _base_unit: number;
    protected _positionTransformCallback: PositionTransformation;
    protected _transform: PhysicsTransform;
    public get Id() { return this._id; }

    constructor(id: number, base_unit: number, collision_data: ColliderStruct) {
        this._id = id;
        this._base_unit = base_unit;
        this._collision_data = collision_data;

        this.parse_collision_struct(this._collision_data);
    }

    update_transform(p_transform : PhysicsTransform) {
        this._transform = p_transform;
    }

    abstract parse_collision_struct(collision_data: ColliderStruct): void;
    abstract handle_collision(physicsObject: PhysicsTransform): void;
    abstract render_collider(graphics: Graphics, screen_height: number): void;
}