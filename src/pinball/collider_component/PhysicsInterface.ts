import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, ConstraintStruct, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
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
    protected _inverse: number;
    protected _constraintStruct: ConstraintStruct;

    public get Id() { return this._id; }
    public get Tag() { return this._tag; }
    public get Transform() { return this._transform; }
    public get Inverse() { return this._inverse; }
    public get Constraint() { return this._constraintStruct; }

    constructor(id: number, tag: number, inverse: number, base_unit: number) {
        this._id = id;
        this._tag = tag;
        this._inverse = inverse;
        this._base_unit = base_unit;
    }

    set_transform(p_transform : PhysicsTransform, contraint_struct: ConstraintStruct) {
        this._transform = p_transform;

        if (contraint_struct != null && contraint_struct.rest_point != 0) {
            this._constraintStruct = contraint_struct;
            this._transform.rotation = contraint_struct.rest_point;
        }
    }

    abstract parse_collision_struct(collision_data: ColliderStruct): void;
    abstract parse_properties_struct(properties_data: string): void;

    abstract handle_collision(physicsObject: PhysicsTransform): void;
    abstract render_collider(graphics: Graphics, screen_height: number): void;
}