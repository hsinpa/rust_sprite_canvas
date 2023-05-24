import { Config } from "../utility/pinball_static";
import { PhysicsTransform } from "../utility/pinball_types";

export class PinballPhysicsAsset {
    private _cacheDeleteObject: PhysicsTransform[] = [];
    private _dynamicObject: PhysicsTransform[] = [];
    
    

    push(dynamicObject: PhysicsTransform) {
        this._dynamicObject.push(dynamicObject);
    }

    delete(id: number) {

    }

    simulate() {


    }

}