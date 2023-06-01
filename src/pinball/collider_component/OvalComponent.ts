import {PhysicsInterface, PositionTransformation} from './PhysicsInterface';
import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, SpriteLayoutStruct, OvalCollision } from "../utility/unity_sprite_struct";
import { IntVector2,  } from "../../utility/UniversalType";
import { PinballLayer } from '../utility/pinball_static';

import { PerpendicularClockwise, VectorSubstract, Normalize2D, VectorNumScale, Lerp, VectorDistance } from "../../utility/UtilityMethod";

import { Graphics, Matrix, Point } from 'pixi.js';
import {ConvertSphereToVector, NormalizeSphereCollider, closestPointOnSegment} from './PhysicsHelper'
import { Vector2 } from '../../utility/VectorMath';

export default class OvalComponent extends PhysicsInterface {
    private _ovalCollision: OvalCollision;
    private _rotationMatrix: Matrix;

    private _sphere_a: Point;
    private _sphere_b: Point;

    private _dir_vector: Vector2;
    private _velocity_vector: Vector2;

    private _a_vector: Vector2;
    private _b_vector: Vector2;
    private _reflection_vector: Vector2;


    constructor(id: number, tag: number, inverse: number, base_unit: number) {
        super(id, tag, inverse, base_unit);
        this._rotationMatrix = new Matrix();
        this._sphere_a = new Point();
        this._sphere_b = new Point();
        this._a_vector = new Vector2();
        this._b_vector = new Vector2();
        this._dir_vector = new Vector2();
        this._velocity_vector = new Vector2();
        this._reflection_vector = new Vector2();
    }  


    handle_collision(physicsObject: PhysicsTransform): void {
        if (physicsObject.radius == undefined) return;

        ConvertSphereToVector(this._ovalCollision.sphere_a, this._transform, this._a_vector, this._rotationMatrix);
        ConvertSphereToVector(this._ovalCollision.sphere_b, this._transform, this._b_vector, this._rotationMatrix);

        let closestStruct = closestPointOnSegment(physicsObject.position,  this._a_vector, this._b_vector, this._velocity_vector);
        let lerp_radius = Lerp(this._ovalCollision.sphere_a.radius, this._ovalCollision.sphere_b.radius, closestStruct.t);
        let distance = VectorDistance(closestStruct.point, physicsObject.position);
        let nativeDir = VectorSubstract(physicsObject.position, closestStruct.point);
        let flipperDir = Vector2.substract(this._a_vector, this._b_vector);
            flipperDir.normalize();
            flipperDir = Vector2.perpendicular(flipperDir, flipperDir);

        this._dir_vector.set(nativeDir.x, nativeDir.y);

        //Out of reach
        if (distance == 0 || distance > physicsObject.radius + lerp_radius) return;

        //Normalize direction
        this._dir_vector.scale(1 / distance);

        //Position
        let corr = (physicsObject.radius + lerp_radius - distance);
        physicsObject.position.add(this._dir_vector, corr);

        //Velocity
        let reverse_ball_velocity_nor = physicsObject.velocity.clone().scale(-1).normalize();

        let radius = this._velocity_vector;
        radius.add(this._dir_vector, lerp_radius);
        radius.substract(this._a_vector);

        let surfaceVel = Vector2.perpendicular(radius, radius);
        let surfaceVelNormal = Vector2.normalize(surfaceVel);

        Vector2.reflect(flipperDir, reverse_ball_velocity_nor, this._reflection_vector);
        //console.log(reverse_ball_velocity_nor, flipperDir);

        surfaceVel.scale(this.Transform.angular);

        let v = Vector2.dot(physicsObject.velocity, this._dir_vector);
        let vnew = Vector2.dot(surfaceVel, this._dir_vector);


        let origin_power = physicsObject.velocity.length() * 0.7;
        // physicsObject.velocity.set(this._reflection_vector.x, this._reflection_vector.y);
        // physicsObject.velocity.scale(origin_power);
        console.log(v);

        physicsObject.velocity.add(this._dir_vector, (vnew - v) * 0.9);
    }

    parse_properties_struct(properties_data: string): void {
        if (properties_data == null || properties_data == "") return;  
    }

    render_collider(graphics: Graphics, screen_height: number): void {
        this._sphere_a.set(this._a_vector.x, this._a_vector.y);
        this._sphere_b.set(this._b_vector.x, this._b_vector.y);

        graphics.lineStyle(0);
        graphics.beginFill(0x8FD5FF, 0.5);
        graphics.drawCircle(this._sphere_a.x, screen_height - this._sphere_a.y, this._ovalCollision.sphere_a.radius);
        graphics.endFill();

        graphics.beginFill(0x8FD5FF, 0.5);
        graphics.drawCircle(this._sphere_b.x, screen_height - this._sphere_b.y, this._ovalCollision.sphere_b.radius);
        graphics.endFill();


        let direction = Normalize2D(VectorSubstract({x: this._sphere_b.x, y : this._sphere_b.y}, {x: this._sphere_a.x, y: this._sphere_a.y}));
        let perpendicular = PerpendicularClockwise(direction);
        let perpendicular_invert = VectorNumScale(perpendicular, -1);

        let line_a_top = VectorNumScale(perpendicular, this._ovalCollision.sphere_a.radius);
        let line_b_top = VectorNumScale(perpendicular, this._ovalCollision.sphere_b.radius);
        let line_a_bottom = VectorNumScale(perpendicular_invert, this._ovalCollision.sphere_a.radius);
        let line_b_bottom = VectorNumScale(perpendicular_invert, this._ovalCollision.sphere_b.radius);

        graphics.lineStyle(1, 0xffffff)
        .moveTo( this._sphere_a.x + line_a_top.x, screen_height - this._sphere_a.y + line_a_top.y)
        .lineTo(this._sphere_b.x + line_b_top.x, screen_height -this._sphere_b.y + line_b_top.y).endFill();


        graphics.lineStyle(1, 0xffffff)
        .moveTo( this._sphere_a.x + line_a_bottom.x, screen_height - this._sphere_a.y + line_a_bottom.y)
        .lineTo(this._sphere_b.x + line_b_bottom.x, screen_height - this._sphere_b.y + line_b_bottom.y).endFill();
    }

    parse_collision_struct(collision_data: ColliderStruct): void {
        this._ovalCollision = JSON.parse(collision_data.data);

        this._ovalCollision.sphere_a = NormalizeSphereCollider(this._ovalCollision.sphere_a, this._base_unit);
        this._ovalCollision.sphere_b = NormalizeSphereCollider(this._ovalCollision.sphere_b, this._base_unit);

        ConvertSphereToVector(this._ovalCollision.sphere_a, this._transform, this._a_vector, this._rotationMatrix);
        ConvertSphereToVector(this._ovalCollision.sphere_b, this._transform, this._b_vector, this._rotationMatrix);
    }
}