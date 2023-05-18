import {SphereObject} from '../utility/pinball_types';

export const ThreadEventKey = Object.freeze( {
    WorldConstruct : "thread@world_contruct",
    Simulate : "thread@world_simulate",
    ObjectPush: "thread@object_push",
    ObjectDelete: "thread@object_delete",
    ObjectUpdate: "thread@object_update",
});

export interface ThreadEventInterface {
    id: string
}

export interface WorldConstructStruct extends ThreadEventInterface {
    world_width: number,
    world_heigth: number
}

export interface ObjectPushStruct extends ThreadEventInterface {
    spheres: SphereObject[]
}

export interface SimulateStruct extends ThreadEventInterface {
    delta_time: number
}
