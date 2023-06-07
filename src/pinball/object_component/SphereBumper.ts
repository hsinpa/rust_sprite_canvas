import { CollisionCalResult, PhysicsInterface } from "../collider_component/PhysicsInterface";
import { PhysicsTransform } from "../utility/pinball_types";
import { PinBallElementInterface } from "./PinBallElementInterface";


const bumper_strength = 7;

export class SphereBumper extends PinBallElementInterface {


    simulate(physicsInterface: PhysicsInterface, physicsObject: PhysicsTransform): void {
        let collision_result = physicsInterface.handle_collision(physicsObject);

        if (collision_result == null) return;

        physicsObject.position.copy(collision_result.position);
        physicsObject.velocity.copy(collision_result.velocity.scale(bumper_strength));
    }
}
