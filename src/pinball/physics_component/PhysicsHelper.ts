import { Matrix, Point } from "pixi.js";
import { PhysicsTransform } from "../utility/pinball_types";
import { SphereCollision } from "../utility/unity_sprite_struct";

export function ConvertSphereToPoint(sphereCollision: SphereCollision, transform: PhysicsTransform, sourcePoint: Point, sourceMatrix: Matrix, baseUnit: number) {
    let rotationMatrix = sourceMatrix.identity().rotate(-transform.rotation);

    sphereCollision.x *= baseUnit;
    sphereCollision.y *= baseUnit;
    sphereCollision.radius *= baseUnit;

    sourcePoint = sourcePoint.set(sphereCollision.x, sphereCollision.y);

    rotationMatrix.apply(sourcePoint, sourcePoint);

    sourcePoint.x += transform.position.x;
    sourcePoint.y += transform.position.y;

    return sourcePoint;
}