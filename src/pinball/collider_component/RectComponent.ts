import {PhysicsInterface, PositionTransformation} from './PhysicsInterface';
import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, RectCollision, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { Graphics } from 'pixi.js';

export default class RectComponent extends PhysicsInterface {
    private _rectCollision: RectCollision;

    handle_collision(physicsObject: PhysicsTransform): void {

    }

    render_collider(graphics: Graphics): void {

    }
    parse_collision_struct(collision_data: ColliderStruct): void {
        this._rectCollision = JSON.parse(collision_data.data);
    }

    parse_properties_struct(properties_data: string): void {
        
    }
}