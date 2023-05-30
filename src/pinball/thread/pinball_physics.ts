import { Config, PinballLayer } from "../utility/pinball_static";
import { PhysicsTransform } from "../utility/pinball_types";
import { WorldConstructStruct } from "./pinball_thread_event";
import { VectorNumScale, VectorAdd, PushDictionaryArray, Clamp } from "../../utility/UtilityMethod";
import { CollisionType, SceneLayoutStruct, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import { Dictionary } from "typescript-collections";
import { PhysicsInterface } from "../collider_component/PhysicsInterface";
import { ObjectInterface } from "../object_component/ObjectInterface";
import { parse_collection_opt } from "../collider_component/PhysicsVisualizeTool";
import { IntVector2 } from "../../utility/UniversalType";

export class PinballPhysics {
    private _world_struct: SceneLayoutStruct;
    public physics_components : Dictionary<number, PhysicsInterface> = new Dictionary();
    private _physics_transform : PhysicsTransform[] = [];

    public physics_tags : Dictionary<number, number[]> = new Dictionary();

    public get simulated_object() { return this._physics_transform; } 

    set_constraint(data : SceneLayoutStruct) {
        this._world_struct = data;
        console.log(this._world_struct);
        
        parse_collection_opt(data, (spriteLayout, physicsInterface) => {
            this._physics_transform.push(physicsInterface.Transform);
            this.physics_components.setValue(spriteLayout.id, physicsInterface);
            this.physics_tags = PushDictionaryArray(spriteLayout.tag, spriteLayout.id, this.physics_tags);
        });
    }

    push(sphere_object : PhysicsTransform) {
    }

    parse_attribute_data(spriteLayoutStructs : SpriteLayoutStruct) {
        if (spriteLayoutStructs.properties == null || spriteLayoutStructs.properties == "") return;
        
    }

    world_boundary_collision(sphere_object: PhysicsTransform) {

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
        
        let index = 0;
        let gravity : IntVector2= {x: 0, y : -100};

        this.physics_components.forEach((id, physicsInterface) => {

            //Rotation
            if (physicsInterface.Transform.angular != undefined) {
                let rotation = physicsInterface.Transform.rotation + (physicsInterface.Transform.angular * delta_time * physicsInterface.Inverse);
                
                if (physicsInterface.Constraint != undefined && physicsInterface.Constraint.max_rotation != undefined && physicsInterface.Constraint.min_rotation != undefined ) {

                    rotation = Clamp(rotation, physicsInterface.Constraint.min_rotation, physicsInterface.Constraint.max_rotation);
                }
            
                physicsInterface.Transform.rotation = rotation;
            }

            //Translation
            if (physicsInterface.Tag == PinballLayer.Ball && physicsInterface.Transform.velocity != undefined) {

                let acceleration = gravity;
                let velocity = VectorAdd(physicsInterface.Transform.velocity, (VectorNumScale(acceleration, delta_time)));
                let position = VectorAdd(physicsInterface.Transform.position, (VectorNumScale(velocity, delta_time)));

                physicsInterface.Transform.velocity = velocity;
                physicsInterface.Transform.position = position;    
            }

            index++;
        });
    }
}