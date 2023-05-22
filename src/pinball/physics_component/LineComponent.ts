import {PhysicsInterface, PositionTransformation} from './PhysicsInterface';
import { DynamicPhysicsObject } from "../utility/pinball_types";
import { ColliderStruct, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";

export default class LineComponent extends PhysicsInterface {
    handle_collision(physicsObject: DynamicPhysicsObject): void {

    }
}