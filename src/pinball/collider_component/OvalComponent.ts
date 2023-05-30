import {PhysicsInterface, PositionTransformation} from './PhysicsInterface';
import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, SpriteLayoutStruct, OvalCollision } from "../utility/unity_sprite_struct";
import { IntVector2,  } from "../../utility/UniversalType";
import { PinballLayer } from '../utility/pinball_static';

import { PerpendicularClockwise, VectorSubstract, Normalize2D, VectorNumScale } from "../../utility/UtilityMethod";

import { Graphics, Matrix, Point } from 'pixi.js';
import {ConvertSphereToPoint, NormalizeSphereCollider, closestPointOnSegment} from './PhysicsHelper'

export default class OvalComponent extends PhysicsInterface {
    private _ovalCollision: OvalCollision;
    private _rotationMatrix: Matrix;
    private _ori_sphere_a: Point;
    private _ori_sphere_b: Point;

    private _sphere_a: Point;
    private _sphere_b: Point;

    constructor(id: number, tag: number, inverse: number, base_unit: number) {
        super(id, tag, inverse, base_unit);
        this._rotationMatrix = new Matrix();
        this._sphere_a = new Point();
        this._sphere_b = new Point();
    }   

    handle_collision(physicsObject: PhysicsTransform): void {
        if (physicsObject.radius == undefined) return;

        this._sphere_a = ConvertSphereToPoint(this._ovalCollision.sphere_a, this._transform, this._sphere_a, this._rotationMatrix);
        this._sphere_b = ConvertSphereToPoint(this._ovalCollision.sphere_b, this._transform, this._sphere_b, this._rotationMatrix);

        var closest = closestPointOnSegment(physicsObject.position, {x: this._sphere_a.x , y: this._sphere_a.y}, {x: this._sphere_b.x , y: this._sphere_b.y});
        
    }

    parse_properties_struct(properties_data: string): void {
        if (properties_data == null || properties_data == "") return;  
    }

    render_collider(graphics: Graphics): void {
        graphics.lineStyle(0);
        graphics.beginFill(0x8FD5FF, 0.5);
        graphics.drawCircle(this._sphere_a.x, this._sphere_a.y, this._ovalCollision.sphere_a.radius);
        graphics.endFill();

        graphics.beginFill(0x8FD5FF, 0.5);
        graphics.drawCircle(this._sphere_b.x, this._sphere_b.y, this._ovalCollision.sphere_b.radius);
        graphics.endFill();


        let direction = Normalize2D(VectorSubstract({x: this._sphere_b.x, y : this._sphere_b.y}, {x: this._sphere_a.x, y: this._sphere_a.y}));
        let perpendicular = PerpendicularClockwise(direction);
        let perpendicular_invert = VectorNumScale(perpendicular, -1);

        let line_a_top = VectorNumScale(perpendicular, this._ovalCollision.sphere_a.radius);
        let line_b_top = VectorNumScale(perpendicular, this._ovalCollision.sphere_b.radius);
        let line_a_bottom = VectorNumScale(perpendicular_invert, this._ovalCollision.sphere_a.radius);
        let line_b_bottom = VectorNumScale(perpendicular_invert, this._ovalCollision.sphere_b.radius);

        graphics.lineStyle(1, 0xffffff)
        .moveTo( this._sphere_a.x + line_a_top.x, this._sphere_a.y + line_a_top.y)
        .lineTo(this._sphere_b.x + line_b_top.x, this._sphere_b.y + line_b_top.y).endFill();


        graphics.lineStyle(1, 0xffffff)
        .moveTo( this._sphere_a.x + line_a_bottom.x, this._sphere_a.y + line_a_bottom.y)
        .lineTo(this._sphere_b.x + line_b_bottom.x, this._sphere_b.y + line_b_bottom.y).endFill();
    }

    parse_collision_struct(collision_data: ColliderStruct): void {
        this._ovalCollision = JSON.parse(collision_data.data);

        this._ovalCollision.sphere_a = NormalizeSphereCollider(this._ovalCollision.sphere_a, this._base_unit);
        this._ovalCollision.sphere_b = NormalizeSphereCollider(this._ovalCollision.sphere_b, this._base_unit);

        this._sphere_a = ConvertSphereToPoint(this._ovalCollision.sphere_a, this._transform, this._sphere_a, this._rotationMatrix);
        this._sphere_b = ConvertSphereToPoint(this._ovalCollision.sphere_b, this._transform, this._sphere_b, this._rotationMatrix);
    }
}