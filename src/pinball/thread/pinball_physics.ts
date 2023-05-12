import { Config } from "../utility/pinball_static";
import { DynamicPhysicsObject } from "../utility/pinball_types";

export class PinballPhysics {

    simulate(dynamicObject: DynamicPhysicsObject[], max_width: number, max_height: number,) {
        if (dynamicObject == null) return;

        const lens = dynamicObject.length;
        
        for (let i = 0; i < lens; i++) {
            
        }
    }
}