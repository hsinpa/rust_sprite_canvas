import {PhysicsInterface, PositionTransformation} from './PhysicsInterface';
import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, SpriteLayoutStruct, OvalCollision } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { Graphics } from 'pixi.js';

export default class OvalComponent extends PhysicsInterface {
    private _ovalCollision: OvalCollision;

    handle_collision(physicsObject: PhysicsTransform): void {

    }

    render_collider(graphics: Graphics): void {

    }

    parse_collision_struct(collision_data: ColliderStruct): void {
        this._ovalCollision = JSON.parse(collision_data.data);
    }
}