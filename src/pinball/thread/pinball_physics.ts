import { Config } from "../utility/pinball_static";
import { DynamicPhysicsObject, SphereObject } from "../utility/pinball_types";
import { WorldConstructStruct } from "./pinball_thread_event";
import { VectorNumScale, VectorAdd } from "../../utility/UtilityMethod";


export class PinballPhysics {
    private _world_struct: WorldConstructStruct;
    private _sphere_objects: SphereObject[] = [];

    public get simulated_object() { return this._sphere_objects; } 

    set_constraint(world_struct: WorldConstructStruct) {
        this._world_struct = world_struct;
    }

    push(sphere_object : SphereObject) {
        this._sphere_objects.push(sphere_object);
    }

    collision(sphere_object: SphereObject) {

        //Left
        if (sphere_object.position.x < sphere_object.radius) {
            sphere_object.position.x = sphere_object.radius;
            sphere_object.velocity.x = -sphere_object.velocity.x;
        }

        //Right
        if (sphere_object.position.x > this._world_struct.world_width - sphere_object.radius) {
            sphere_object.position.x = this._world_struct.world_width - sphere_object.radius;
            sphere_object.velocity.x = -sphere_object.velocity.x;
        }

        //Bottom
        if (sphere_object.position.y < sphere_object.radius) {
            sphere_object.position.y = sphere_object.radius;
            sphere_object.velocity.y = -sphere_object.velocity.y;
        }

        if (sphere_object.position.y > this._world_struct.world_heigth - sphere_object.radius) {
            sphere_object.position.y = this._world_struct.world_heigth - sphere_object.radius;
            sphere_object.velocity.y = -sphere_object.velocity.y;
        }

        return sphere_object;
    }

    simulate(delta_time: number) {
        if (this._sphere_objects == null) return;

        const lens = this._sphere_objects.length;
        
        for (let i = 0; i < lens; i++) {
            let d = this._sphere_objects[i];
        
            d.acceleration = {x: 0, y : -100};
            d.velocity = VectorAdd(d.velocity, (VectorNumScale(d.acceleration, delta_time)));
            d.position = VectorAdd(d.position, (VectorNumScale(d.velocity, delta_time)));

            d = this.collision(d);

            this._sphere_objects[i] = d;
        }
    }
}