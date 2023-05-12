import { Config } from "../utility/pinball_static";
import { DynamicPhysicsObject } from "../utility/pinball_types";

export class PinballPhysicsAsset {
    private _cacheDeleteObject: DynamicPhysicsObject[] = [];
    private _dynamicObject: DynamicPhysicsObject[] = [];
    
    

    push(dynamicObject: DynamicPhysicsObject) {
        this._dynamicObject.push(dynamicObject);
    }

    delete(id: number) {

    }

    simulate() {


    }

}