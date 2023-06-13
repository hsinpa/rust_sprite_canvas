import { Vector2 } from "../../utility/VectorMath";
import { CollisionCalResult, PhysicsInterface } from "../collider_component/PhysicsInterface";
import { PhysicsTransform } from "../utility/pinball_types";
import { PinBallElementInterface } from "./PinBallElementInterface";

export class Shooter extends PinBallElementInterface {
    simulate(physicsInterface: PhysicsInterface, physicsObject: PhysicsTransform): void {
        if (physicsObject.last_interact_object > 0) return; //It is been process by other collider

        let collision_result = physicsInterface.handle_collision(physicsObject);

        if (collision_result == null) return;

        let max_distance = physicsInterface.Constraint.rest_point - (physicsInterface.Constraint.rest_point + physicsInterface.Constraint.min_y)
        let normalize_str = (physicsInterface.Constraint.rest_point - physicsInterface.Transform.position.y) / max_distance;

        if (physicsInterface.Transform.velocity.y > 0.05 && normalize_str > 0.05) {

            let shooter_velocity = new Vector2(0, 1);
                shooter_velocity.scale( normalize_str * 2000);

            collision_result.bounce_velocity.copy(shooter_velocity);     
            
            collision_result.position.y += (100 * normalize_str);
        }

        physicsObject.position.copy(collision_result.position);
        physicsObject.velocity.copy(collision_result.bounce_velocity);
    }
}
