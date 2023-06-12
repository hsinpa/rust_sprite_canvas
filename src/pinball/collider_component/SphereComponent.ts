import {CollisionCalResult, PhysicsInterface, PositionTransformation} from './PhysicsInterface';
import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, ConstraintStruct, SphereCollision, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { Graphics } from 'pixi.js';
import { Vector2 } from '../../utility/VectorMath';
import { GameConfig } from '../utility/pinball_static';

export default class SphereComponent extends PhysicsInterface {

    private _sphereCollision: SphereCollision;

    handle_collision(physicsObject: PhysicsTransform): CollisionCalResult {
        let dist = Vector2.distance(this.Transform.position, physicsObject.position);
        let radius = physicsObject.radius + this.Transform.radius;

        //No collision
        if (dist > radius) return null;

        let position = this._collisionResult.position;
            position.copy(this.Transform.position);

        let velocity = this._collisionResult.bounce_velocity;

        velocity = Vector2.substract(physicsObject.position, this.Transform.position, velocity);
        velocity.normalize();

        position.add(velocity, radius);
        velocity.scale(physicsObject.velocity.length() * GameConfig.Restitution);

        this._collisionResult.position.copy(position);
        this._collisionResult.bounce_velocity.copy(velocity);

        return this._collisionResult;
    }

    parse_properties_struct(properties_data: string): void {
        
    }

    parse_collision_struct(collision_data: ColliderStruct): void {
       this._sphereCollision = JSON.parse(collision_data.data);

       this._sphereCollision.x = this._sphereCollision.x * this._base_unit;
       this._sphereCollision.y = this._sphereCollision.y * this._base_unit;
       this._sphereCollision.radius *= this._base_unit;

       this._transform.radius = this._sphereCollision.radius;
    }

    render_collider(graphics: Graphics, screen_height: number): void {
        let position_x = this._transform.position.x + this._sphereCollision.x;
        let position_y = this._transform.position.y + this._sphereCollision.y;
        
        graphics.lineStyle(0);
        graphics.beginFill(0x8FD5FF, 0.5);
        graphics.drawCircle(position_x, screen_height - position_y, this._sphereCollision.radius);
        graphics.endFill();
    }
}