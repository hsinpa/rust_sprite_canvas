import { CollisionCalResult, PhysicsInterface } from "../collider_component/PhysicsInterface";
import { PhysicsTransform } from "../utility/pinball_types";
import { ObjectInterface } from "./ObjectInterface";

export class SideBumper extends ObjectInterface {
    simulate(physicsInterface: PhysicsInterface, physicsObject: PhysicsTransform): void {
        let collision_result = physicsInterface.handle_collision(physicsObject);

        physicsObject.position.copy(collision_result.position);
        physicsObject.velocity.copy(collision_result.velocity);
    }
}
