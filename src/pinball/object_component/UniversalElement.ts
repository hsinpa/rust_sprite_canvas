import { CollisionCalResult, PhysicsInterface } from "../collider_component/PhysicsInterface";
import { PhysicsTransform } from "../utility/pinball_types";
import { PinBallElementInterface } from "./PinBallElementInterface";

export class UniversalElement extends PinBallElementInterface  {
    simulate(physicsInterface: PhysicsInterface, physicsObject: PhysicsTransform): void {
        if (physicsObject.last_interact_object > 0) return; //It is been process by other collider
        
        let collision_result = physicsInterface.handle_collision(physicsObject);

        if (collision_result == null) return;

        physicsObject.position.copy(collision_result.position);
        physicsObject.velocity.copy(collision_result.velocity);

        physicsObject.last_interact_object = physicsInterface.Id;
    }
}
