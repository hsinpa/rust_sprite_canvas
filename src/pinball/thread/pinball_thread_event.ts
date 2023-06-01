import { ButtonState } from '../../utility/Input/InputHandler';
import { Vector2 } from '../../utility/VectorMath';
import {PhysicsTransform} from '../utility/pinball_types';
import { SceneLayoutStruct } from '../utility/unity_sprite_struct';

export const ThreadEventKey = Object.freeze( {
    WorldConstruct : "thread@world_contruct",
    Simulate : "thread@world_simulate",
    ObjectPush: "thread@object_push",
    ObjectDelete: "thread@object_delete",
    ObjectUpdate: "thread@object_update",
    Input: "thread@input"
});

export interface ThreadEventInterface {
    id: string
}

export interface WorldConstructStruct extends ThreadEventInterface {
    scene_layout: SceneLayoutStruct,
    vector: Vector2
}

export interface ObjectPushStruct extends ThreadEventInterface {
}

export interface SimulateStruct extends ThreadEventInterface {
    delta_time: number
}

export interface InputStruct extends ThreadEventInterface {
    state: ButtonState,
}