import { Config, PinballLayer } from "../utility/pinball_static";
import { PhysicsTransform } from "../utility/pinball_types";
import { WorldConstructStruct } from "./pinball_thread_event";
import { VectorNumScale, VectorAdd, PushDictionaryArray, Clamp } from "../../utility/UtilityMethod";
import { CollisionType, SceneLayoutStruct, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import { Dictionary } from "typescript-collections";
import { PhysicsInterface } from "../collider_component/PhysicsInterface";
import { PinBallElementInterface } from "../object_component/PinBallElementInterface";
import { parse_collection_opt } from "../collider_component/PhysicsVisualizeTool";
import { IntVector2 } from "../../utility/UniversalType";
import { Vector2 } from "../../utility/VectorMath";
import { SphereBumper } from "../object_component/SphereBumper";
import { Flipper } from "../object_component/Flipper";
import { UniversalElement } from "../object_component/UniversalElement";
import { SideBumper } from "../object_component/SideBumper";

export class PinballPhysics {
    private _world_struct: SceneLayoutStruct;
    public physics_components : Dictionary<number, PhysicsInterface> = new Dictionary();
    private _physics_transform : PhysicsTransform[] = [];

    public physics_tags : Dictionary<number, number[]> = new Dictionary();

    public get simulated_object() { return this._physics_transform; }
    private _world_acceleration = new Vector2(0, -300);

    private _sideBumperWorker : SideBumper = new SideBumper();
    private _sphereBumperWorker : SphereBumper = new SphereBumper();
    private _universalElementWorker : UniversalElement = new UniversalElement();

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

        ball_object.last_interact_object = 0;

        //Left Flipper
        this.pinball_element_opt(PinballLayer.Flipper_Left, this._universalElementWorker, ball_object);
        //Right Flipper
        this.pinball_element_opt(PinballLayer.Flipper_Right, this._universalElementWorker, ball_object);

        //Sphere Bumper
        this.pinball_element_opt(PinballLayer.SphereBumper, this._sphereBumperWorker, ball_object);
        this.pinball_element_opt(PinballLayer.SideBumper, this._sideBumperWorker, ball_object);

        //Others / Wall
        this.pinball_element_opt(PinballLayer.Default, this._universalElementWorker, ball_object);
    }

    world_boundary_collision(ball_object: PhysicsTransform) {
        if (ball_object.radius == undefined) return ball_object;

        let decay = 0.7;
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


            //Translation
            if (physicsInterface.Tag == PinballLayer.Ball && physicsInterface.Transform.velocity != undefined) {
                let acceleration = physicsInterface.Transform.acceleration;
                    acceleration.set(this._world_acceleration.x, this._world_acceleration.y);                    

                physicsInterface.Transform.velocity.scale(decay);
                physicsInterface.Transform.velocity.add(acceleration, delta_time);
                physicsInterface.Transform.position.add(physicsInterface.Transform.velocity, delta_time);                
                
                this.world_object_collision(physicsInterface.Transform);
                this.world_boundary_collision(physicsInterface.Transform);

                if (physicsInterface.Transform.last_position == undefined) {
                    physicsInterface.Transform.last_position = physicsInterface.Transform.position.clone();
                    physicsInterface.Transform.last_velocity = physicsInterface.Transform.velocity.clone();
                } else {
                    physicsInterface.Transform.last_position.copy(physicsInterface.Transform.position);
                    physicsInterface.Transform.last_velocity.copy(physicsInterface.Transform.velocity);
                }
            }

            index++;
        });
    }

    private pinball_element_opt(layer: number, element: PinBallElementInterface, ball_object: PhysicsTransform, opt: (x : PhysicsInterface) => void = null) {
        let layer_number = this.physics_tags.getValue(layer);

        if (layer_number == null) return;

        layer_number.forEach(x => {
            let physicsInterface = this.physics_components.getValue(x)

            if (physicsInterface != null) element.simulate(physicsInterface, ball_object);

            if (physicsInterface != null && opt != null) opt(physicsInterface);
        });

    }
}