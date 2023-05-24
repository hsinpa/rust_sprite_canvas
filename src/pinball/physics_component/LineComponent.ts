import {PhysicsInterface, PositionTransformation} from './PhysicsInterface';
import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, SpriteLayoutStruct, LineCollision } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { Graphics } from 'pixi.js';

export default class LineComponent extends PhysicsInterface {
    private _lineCollision: LineCollision;

    parse_collision_struct(collision_data: ColliderStruct): void {
        this._lineCollision = JSON.parse(collision_data.data);
    }

    render_collider(graphics: Graphics): void {

    }

    handle_collision(physicsObject: PhysicsTransform): void {

    }
}