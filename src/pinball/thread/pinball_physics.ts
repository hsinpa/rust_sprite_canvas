import { Config, PinballLayer } from "../utility/pinball_static";
import { PhysicsTransform } from "../utility/pinball_types";
import { WorldConstructStruct } from "./pinball_thread_event";
import { VectorNumScale, VectorAdd, PushDictionaryArray } from "../../utility/UtilityMethod";
import { CollisionType, SceneLayoutStruct, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import { Dictionary } from "typescript-collections";
import { PhysicsInterface } from "../collider_component/PhysicsInterface";
import { ObjectInterface } from "../object_component/ObjectInterface";
import { parse_collection_opt } from "../collider_component/PhysicsVisualizeTool";

export class PinballPhysics {
    private _world_struct: SceneLayoutStruct;
    private _sphere_objects: PhysicsTransform[] = [];
    public physics_components : Dictionary<number, PhysicsInterface> = new Dictionary();
    public physics_tags : Dictionary<number, number[]> = new Dictionary();

    public get simulated_object() { return this._sphere_objects; } 

    set_constraint(data : SceneLayoutStruct) {
        this._world_struct = data;
        console.log(this._world_struct);
        
        parse_collection_opt(data, (spriteLayout, physicsInterface) => {
            this.physics_components.setValue(spriteLayout.id, physicsInterface);
            this.physics_tags = PushDictionaryArray(spriteLayout.tag, spriteLayout.id, this.physics_tags);
        });
    }

    push(sphere_object : PhysicsTransform) {
        this._sphere_objects.push(sphere_object);
    }

    parse_attribute_data(spriteLayoutStructs : SpriteLayoutStruct) {
        if (spriteLayoutStructs.properties == null || spriteLayoutStructs.properties == "") return;
        
    }

    collision(sphere_object: PhysicsTransform) {

        //Left
        if (sphere_object.position.x < sphere_object.radius) {
            sphere_object.position.x = sphere_object.radius;
            sphere_object.velocity.x = -sphere_object.velocity.x;
        }

        //Right
        if (sphere_object.position.x > this._world_struct.screen_width - sphere_object.radius) {
            sphere_object.position.x = this._world_struct.screen_width - sphere_object.radius;
            sphere_object.velocity.x = -sphere_object.velocity.x;
        }

        //Bottom
        if (sphere_object.position.y < sphere_object.radius) {
            sphere_object.position.y = sphere_object.radius;
            sphere_object.velocity.y = -sphere_object.velocity.y;
        }

        if (sphere_object.position.y > this._world_struct.screen_width - sphere_object.radius) {
            sphere_object.position.y = this._world_struct.screen_width - sphere_object.radius;
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