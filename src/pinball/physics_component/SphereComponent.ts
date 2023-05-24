import {PhysicsInterface, PositionTransformation} from './PhysicsInterface';
import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, SphereCollision, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { Graphics } from 'pixi.js';

export default class SphereComponent extends PhysicsInterface {

    private _sphereCollision: SphereCollision;

    handle_collision(physicsObject: PhysicsTransform): void {

    }

    parse_collision_struct(collision_data: ColliderStruct): void {
       this._sphereCollision = JSON.parse(collision_data.data);

       this._sphereCollision.x = this._sphereCollision.x * this._base_unit;
       this._sphereCollision.y = this._sphereCollision.y * this._base_unit;
    }

    render_collider(graphics: Graphics, screen_height: number): void {

        console.log(this._transform.position);
        console.log(this._sphereCollision);

        let position_x = this._transform.position.x + this._sphereCollision.x;
        let position_y = this._transform.position.y + this._sphereCollision.y;

        graphics.beginFill(0x8FD5FF, 0.5);
        graphics.drawCircle(position_x, position_y, this._sphereCollision.radius * this._base_unit);
        graphics.endFill();
    }
}