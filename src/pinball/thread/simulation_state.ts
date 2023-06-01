import { Dictionary } from "typescript-collections";
import { ActionMapTable, InputEventTitle } from "../../utility/Input/KeycodeTable";
import { InputStruct } from "./pinball_thread_event";
import { ButtonStatus } from "../../utility/Input/InputHandler";
import { PinballPhysics } from "./pinball_physics";
import { PinballLayer } from "../utility/pinball_static";
import { Clamp } from "../../utility/UtilityMethod";

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
            this._input_state_table.setValue(input.state.keycode, value);
        }
    }

    perform_presimulation_stage(delta_time: number) {
        //Handle Flipper
        this.handle_flipper(PinballLayer.Flipper_Left, InputEventTitle.z, delta_time);
        this.handle_flipper(PinballLayer.Flipper_Right, InputEventTitle.l_slash, delta_time);
    }

    private handle_flipper(tag: number, state_id: string, delta_time: number) {
        let tags = this._pinball_physics.physics_tags.getValue(tag);
        let state = this._input_state_table.getValue(state_id);

        if (tags === undefined || state === undefined) return;
        let tagLens = tags.length;
        const flipper_strength = 15;
        const flipper_normalize = (state * 2) - 1; // Normalize to -1 and 1
        for (let i = tagLens - 1; i >= 0; i--) {
            let physicsComp = this._pinball_physics.physics_components.getValue(tags[i]);
            
            if (physicsComp === undefined) continue;

            let previous_rotation = physicsComp.Transform.rotation;
            let angular = flipper_normalize * flipper_strength;

            let rotation = previous_rotation + (angular * delta_time * physicsComp.Inverse);
                rotation = Clamp(rotation, physicsComp.Constraint.min_rotation, physicsComp.Constraint.max_rotation);
            
                physicsComp.Transform.rotation = rotation;
                physicsComp.Transform.angular = (rotation - previous_rotation) / delta_time;
        }
    }
}