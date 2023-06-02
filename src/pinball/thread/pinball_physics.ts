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
import { Vector2 } from "../../utility/VectorMath";

export class PinballPhysics {
    private _world_struct: SceneLayoutStruct;
    public physics_components : Dictionary<number, PhysicsInterface> = new Dictionary();
    private _physics_transform : PhysicsTransform[] = [];

    public physics_tags : Dictionary<number, number[]> = new Dictionary();

    public get simulated_object() { return this._physics_transform; }
    private _world_acceleration = new Vector2(0, -200);

    set_constraint(data : SceneLayoutStruct) {
        this._world_struct = data;
        console.log(this._world_struct);
        
        parse_collection_opt(data, (spriteLayout, physicsInterface) => {
            this.physics_components.setValue(spriteLayout.id, physicsInterface);
            this.physics_tags = PushDictionaryArray(spriteLayout.tag, spriteLayout.id, this.physics_tags);

            //Don't process static object
            if (physicsInterface.Tag == 0) return;
            this._physics_transform.push(physicsInterface.Transform);
        });
    }

    push(sphere_object : PhysicsTransform) {
    }

    parse_attribute_data(spriteLayoutStructs : SpriteLayoutStruct) {
        if (spriteLayoutStructs.properties == null || spriteLayoutStructs.properties == "") return;
        
    }

    world_object_collision(ball_object: PhysicsTransform) {

        //Left Flipper
        let l_flippers = this.physics_tags.getValue(PinballLayer.Flipper_Left);
        l_flippers.forEach(x => {
            this.physics_components.getValue(x).handle_collision(ball_object);
        });

        //Right Flipper
        let r_flippers = this.physics_tags.getValue(PinballLayer.Flipper_Right);
        r_flippers.forEach(x => {
            this.physics_components.getValue(x).handle_collision(ball_object);
        });
    }

    world_boundary_collision(ball_object: PhysicsTransform) {
        if (ball_object.radius == undefined) return ball_object;

        let decay = 0.8;
        //Left
        if (ball_object.position.x < ball_object.radius) {
            ball_object.position.x = ball_object.radius;
            ball_object.velocity.x = -ball_object.velocity.x;
            ball_object.velocity.x *= decay;
            ball_object.velocity.y *= decay;
        }

        //Right
        if (ball_object.position.x > this._world_struct.screen_width - ball_object.radius) {
            ball_object.position.x = this._world_struct.screen_width - ball_object.radius;
            ball_object.velocity.x = -ball_object.velocity.x;
            ball_object.velocity.x *= decay;
            ball_object.velocity.y *= decay;
        }

        //Bottom
        if (ball_object.position.y < ball_object.radius) {
            ball_object.position.y = ball_object.radius;
            ball_object.velocity.y = -ball_object.velocity.y;
            ball_object.velocity.x *= decay;
            ball_object.velocity.y *= decay;
        }

        if (ball_object.position.y > this._world_struct.screen_height - ball_object.radius) {
            ball_object.position.y = this._world_struct.screen_height - ball_object.radius;
            ball_object.velocity.y = -ball_object.velocity.y;
            ball_object.velocity.x *= decay;
            ball_object.velocity.y *= decay;
        }

        return ball_object;
    }

    simulate(delta_time: number) {
        
        let index = 0;
        let decay = 0.998;
        this.physics_components.forEach((id, physicsInterface) => {
            if (physicsInterface.Tag != PinballLayer.Ball) return;
            //Rotation
            // if (physicsInterface.Transform.angular != undefined) {
            //     let rotation = physicsInterface.Transform.rotation + (physicsInterface.Transform.angular * delta_time * physicsInterface.Inverse);
                
            //     if (physicsInterface.Constraint != undefined && physicsInterface.Constraint.max_rotation != undefined && physicsInterface.Constraint.min_rotation != undefined ) {

            //         rotation = Clamp(rotation, physicsInterface.Constraint.min_rotation, physicsInterface.Constraint.max_rotation);
            //     }
            
            //     physicsInterface.Transform.rotation = rotation;
            // }

            //Translation
            if (physicsInterface.Tag == PinballLayer.Ball && physicsInterface.Transform.velocity != undefined) {
                let acceleration = physicsInterface.Transform.acceleration;
                    acceleration.set(this._world_acceleration.x, this._world_acceleration.y);                    


                physicsInterface.Transform.velocity.scale(decay);
                physicsInterface.Transform.velocity.add(acceleration, delta_time);
                physicsInterface.Transform.position.add(physicsInterface.Transform.velocity, delta_time);                
                
                this.world_object_collision(physicsInterface.Transform);
                this.world_boundary_collision(physicsInterface.Transform);

            }

            index++;
        });
    }
}