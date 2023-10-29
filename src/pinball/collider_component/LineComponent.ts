import {CollisionCalResult, PhysicsInterface, PositionTransformation} from './PhysicsInterface';
import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, SpriteLayoutStruct, LineCollision } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { Graphics, Matrix, Point, PI_2 } from 'pixi.js';
import {Lerp, PerpendicularClockwise, Normalize2D, VectorSubstract, VectorDistance} from '../../utility/UtilityMethod'
import { ConvertSphereToVector, closestPointOnSegment } from './PhysicsHelper';
import { Vector2 } from '../../utility/VectorMath';
import { GameConfig } from '../utility/pinball_static';


export default class LineComponent extends PhysicsInterface {
    private _lineCollision: LineCollision;
    private _rotationMatrix: Matrix;

    private _point_a: Vector2 = new Vector2();
    private _point_b: Vector2 = new Vector2();
    private _closest_point: Vector2 = new Vector2();

    private _player_velocity: Vector2 = new Vector2();

    constructor(id: number, tag: number, inverse_value : number, base_unit: number) {
        super(id, tag, inverse_value, base_unit);
        this._rotationMatrix = new Matrix();
    }

    parse_collision_struct(collision_data: ColliderStruct): void {
        this._lineCollision = JSON.parse(collision_data.data);
        // this._rotationMatrix = this._rotationMatrix.rotate(this._transform.rotation);

        // let new_point_a = this._rotationMatrix.apply(new Point(this._lineCollision.point_a.x, this._lineCollision.point_a.y) );
        // let new_point_b = this._rotationMatrix.apply(new Point(this._lineCollision.point_b.x, this._lineCollision.point_b.y) );

        this._lineCollision.point_a.x = this._lineCollision.point_a.x * this._base_unit;
        this._lineCollision.point_a.y = this._lineCollision.point_a.y * this._base_unit;
        this._lineCollision.point_b.x = this._lineCollision.point_b.x * this._base_unit;
        this._lineCollision.point_b.y = this._lineCollision.point_b.y * this._base_unit;

        ConvertSphereToVector(this._lineCollision.point_a.x, this._lineCollision.point_a.y, this._transform, this._point_a, this._rotationMatrix);
        ConvertSphereToVector(this._lineCollision.point_b.x, this._lineCollision.point_b.y, this._transform, this._point_b, this._rotationMatrix);

        // this._point_a.set(this._lineCollision.point_a.x + this._transform.position.x, this._lineCollision.point_a.y + this._transform.position.y);
        // this._point_b.set(this._lineCollision.point_b.x + this._transform.position.x, this._lineCollision.point_b.y + this._transform.position.y);
    }

    render_collider(graphics: Graphics, screen_height: number): void {
        let subtraction = VectorSubstract(this._point_a, this._point_b);
        let normal = PerpendicularClockwise(Normalize2D(subtraction));
        normal.y = normal.y * -1;

        let center_x = Lerp(this._point_a.x, this._point_b.x, 0.5);
        let center_y =  screen_height - Lerp(this._point_a.y, this._point_b.y, 0.5);
        let normalDist = VectorDistance(this._point_a, this._point_b) * 0.2;

        let thickness = 2;
        graphics.lineStyle(thickness, 0xffffff)
        .moveTo(this._point_a.x, screen_height - this._point_a.y)
        .lineTo(this._point_b.x, screen_height - this._point_b.y).endFill();

        graphics.lineStyle(thickness, 0xd91ed3)
        .moveTo(center_x, center_y)
        .lineTo( center_x + (normal.x * normalDist), center_y + (normal.y * normalDist)).endFill();
    }

    parse_properties_struct(properties_data: string): void {
    }

    handle_collision(physicsObject: PhysicsTransform): CollisionCalResult {
        let position = this._collisionResult.position.copy(physicsObject.position);
        let velocity = this._collisionResult.bounce_velocity.copy(physicsObject.velocity);

        // ConvertSphereToVector(this._lineCollision.point_a.x, this._lineCollision.point_a.y, this._transform, this._point_a, this._rotationMatrix);
        // ConvertSphereToVector(this._lineCollision.point_b.x, this._lineCollision.point_b.y, this._transform, this._point_b, this._rotationMatrix);

        let closestStruct = closestPointOnSegment(position,  this._point_a, this._point_b, this._closest_point);
        const distance = VectorDistance(closestStruct.point, position);

        //console.log(this._a_vector, this._b_vector);
        //penetration_check(this._a_vector, this._b_vector, physicsObject)
        //console.log("DoIntersect " + isIntersect);

        //Out of reach
        if (distance > physicsObject.radius) return null;

        //Position
        velocity.normalize();
        position.add(velocity, -(physicsObject.radius - distance));
        
        //Bounce direction
        this._player_velocity.copy(physicsObject.velocity);
        this._player_velocity.normalize();
        this._player_velocity.scale(-1);


        velocity = Vector2.substract (this._point_a, this._point_b, velocity);
        velocity.normalize();
        velocity = Vector2.perpendicular(velocity, velocity);

        this._collisionResult.face_normal.copy(velocity);

        let likelihood = Vector2.dot(this._player_velocity, velocity);

        //velocity.scale(physicsObject.velocity.length() * GameConfig.Restitution);

        Vector2.reflect(velocity, this._player_velocity, velocity);

        return this._collisionResult;
    }
}