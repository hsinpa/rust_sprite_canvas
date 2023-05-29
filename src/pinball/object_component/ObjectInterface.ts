import { PhysicsInterface } from "../collider_component/PhysicsInterface";

export interface ObjectInterface {
    simulate(delta_time: number): void,
    setup(physicsInterface: PhysicsInterface): void
}