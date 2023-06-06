import { PhysicsInterface, CollisionCalResult } from "../collider_component/PhysicsInterface";
import { PhysicsTransform } from "../utility/pinball_types";

export abstract class ObjectInterface {
    abstract simulate(physicsInterface: PhysicsInterface, physicsObject: PhysicsTransform): void;
}