import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { Graphics } from "pixi.js";

export interface PositionTransformation {
    (local_position: IntVector2): IntVector2;
}

export abstract class PhysicsInterface {

    protected _id: number;
    protected _tag: number;

    protected _base_unit: number;
    protected _positionTransformCallback: PositionTransformation;
    protected _transform: PhysicsTransform;
    public get Id() { return this._id; }

    constructor(id: number, tag: number, base_unit: number) {
        this._id = id;
        this._tag = tag;
        this._base_unit = base_unit;
    }

    update_transform(p_transform : PhysicsTransform) {
        this._transform = p_transform;
    }

    

    abstract parse_collision_struct(collision_data: ColliderStruct): void;
    abstract parse_properties_struct(properties_data: string): void;

    abstract handle_collision(physicsObject: PhysicsTransform): void;
    abstract render_collider(graphics: Graphics, screen_height: number): void;
}