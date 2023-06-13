import { Dictionary } from "typescript-collections";
import { ActionMapTable, InputEventTitle } from "../../utility/Input/KeycodeTable";
import { InputStruct } from "./pinball_thread_event";
import { ButtonStatus } from "../../utility/Input/InputHandler";
import { PinballPhysics } from "./pinball_physics";
import { PinballLayer } from "../utility/pinball_static";
import { Clamp } from "../../utility/UtilityMethod";
import { PhysicsInterface } from "../collider_component/PhysicsInterface";

export class SimulationState {
 
    private _input_state_table: Dictionary<string, number> = new Dictionary();
    private _pinball_physics: PinballPhysics;

    constructor(pinball_physics: PinballPhysics) {
        this._pinball_physics = pinball_physics;
        this._input_state_table = new Dictionary();
    }

    get_input_state(id: string): number {
        let value = this._input_state_table.getValue(id);

        if (value === undefined) return 0;

        return value;
    }

    on_input(input: InputStruct) {
        const value = (input.state.status == ButtonStatus.Begin) ? 1 : 0;

        if (input.state.keycode in ActionMapTable) {
            //console.log(input.state.keycode, value);
            this._input_state_table.setValue(input.state.keycode, value);
        }
    }

    perform_presimulation_stage(delta_time: number) {
        //Handle Flipper
        this.handle_flipper(PinballLayer.Flipper_Left, InputEventTitle.z, delta_time);
        this.handle_flipper(PinballLayer.Flipper_Right, InputEventTitle.l_slash, delta_time);

        this.handle_shooter(delta_time);
    }

    private handle_flipper(tag: number, state_id: string, delta_time: number) {
        const flipper_strength = 15;

        this.process_element_opt(tag, state_id, (physicsComp, state) => {
            const flipper_normalize = (state * 2) - 1; // Normalize to -1 and 1

            let previous_rotation = physicsComp.Transform.rotation;
            let angular = flipper_normalize * flipper_strength;

            let rotation = previous_rotation + (angular * delta_time * physicsComp.Inverse);
                rotation = Clamp(rotation, physicsComp.Constraint.min_rotation, physicsComp.Constraint.max_rotation);
            
                physicsComp.Transform.rotation = rotation;
                physicsComp.Transform.angular = (rotation - previous_rotation) / delta_time;
        });
    }

    private handle_shooter(delta_time: number) {
        this.process_element_opt(PinballLayer.Shooter, InputEventTitle.space, (physicsComp, state) => {
            let down_velocity = -20;
            let up_velocity = 800;
            let velocity = ((state) ? down_velocity : up_velocity) * delta_time; 

            let position_y = physicsComp.Transform.position.y + velocity;
                position_y = Clamp(position_y, physicsComp.Constraint.rest_y + physicsComp.Constraint.min_y , physicsComp.Constraint.rest_y + physicsComp.Constraint.max_y);
            let position_x = physicsComp.Transform.position.x;

            physicsComp.Transform.velocity.set(0, velocity);
            physicsComp.Transform.position.set(position_x, position_y);
        });
    }

    private process_element_opt(tag: number, state_id: string, callback: (element: PhysicsInterface, input_state: number) => void) {
        let state = this._input_state_table.getValue(state_id);
        let tags = this._pinball_physics.physics_tags.getValue(tag);

        if (tags === undefined || state === undefined) return;
        let tagLens = tags.length;

        for (let i = tagLens - 1; i >= 0; i--) {
            let physicsComp = this._pinball_physics.physics_components.getValue(tags[i]);
            
            if (physicsComp === undefined) continue;

            callback(physicsComp, state);
        }
    }
}