import { Config } from "../utility/pinball_static";
import { ThreadEventKey, WorldConstructStruct, ObjectPushStruct, SimulateStruct} from "./pinball_thread_event";
import {PinballPhysics} from './pinball_physics';

interface MessageEventInterface {
    [key: string]: (msg: MessageEvent<any>) => void
}
class PinballThread {

    _eventTable: MessageEventInterface = {};
    _physicsEngine: PinballPhysics;

    constructor() {
        this._physicsEngine = new PinballPhysics();
        this._eventTable[ThreadEventKey.WorldConstruct] = this.on_world_construct_event.bind(this);
        this._eventTable[ThreadEventKey.Simulate] = this.on_simulate.bind(this);
        this._eventTable[ThreadEventKey.ObjectPush] = this.on_object_push.bind(this);
    }

    handle_event(message : MessageEvent<any>) {
        if (message.data.id in this._eventTable) {
            this._eventTable[message.data.id](message);
        }
    }

    on_world_construct_event(msg: MessageEvent<any>) {
        console.log("on_world_construct_event");

        const data : WorldConstructStruct = msg.data;
        this._physicsEngine.set_constraint(data);
    }

    on_simulate(msg: MessageEvent<any>) {
        const data : SimulateStruct = msg.data;
        this._physicsEngine.simulate(data.delta_time);

        postMessage({id: ThreadEventKey.ObjectUpdate, objects: this._physicsEngine.simulated_object});
    }

    on_object_push(msg: MessageEvent<any>) {
        console.log("on_object_push");

        const data : ObjectPushStruct = msg.data;
        let dLens = data.spheres.length;
        for (let i = 0; i < dLens; i++)
            this._physicsEngine.push(data.spheres[i]);
    }
}

let pinballThread = new PinballThread();
console.log('message from main');

self.onmessage = (msg) => {
    //console.log('message from main', msg.data);

    pinballThread.handle_event(msg);
    //postMessage('message sent from worker');
};

