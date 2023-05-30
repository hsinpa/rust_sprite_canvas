import { Matrix, Point } from "pixi.js";
import { PhysicsTransform } from "../utility/pinball_types";
import { SphereCollision } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { VectorSubstract, VectorDot, Clamp, VectorNumScale, VectorAdd} from "../../utility/UtilityMethod";

export function NormalizeSphereCollider(sphereCollision: SphereCollision, baseUnit: number) {
    sphereCollision.x *= baseUnit;
    sphereCollision.y *= baseUnit;
    sphereCollision.radius *= baseUnit;

    return sphereCollision;
}

export function ConvertSphereToPoint(sphereCollision: SphereCollision, transform: PhysicsTransform, sourcePoint: Point, sourceMatrix: Matrix) {
    let rotationMatrix = sourceMatrix.identity().rotate(transform.rotation);

    sourcePoint = sourcePoint.set(sphereCollision.x, sphereCollision.y);

    rotationMatrix.apply(sourcePoint, sourcePoint);

    sourcePoint.x += transform.position.x;
    sourcePoint.y += transform.position.y;

    return sourcePoint;
}

export function closestPointOnSegment(point: IntVector2, a : IntVector2, b : IntVector2) {
    let ab = VectorSubstract(b, a);
    let t = VectorDot(ab, ab);
        t = (VectorDot(point, ab) - VectorDot(a, ab)) / t;
        t = Clamp(t, 0 , 1);

    let offset = VectorNumScale(ab, t);
    return VectorAdd(a, offset);
}
