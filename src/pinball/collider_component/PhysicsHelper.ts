import { Matrix, Point } from "pixi.js";
import { PhysicsTransform } from "../utility/pinball_types";
import { SphereCollision } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { VectorSubstract, VectorDot, Clamp, VectorNumScale, VectorAdd} from "../../utility/UtilityMethod";

export function ConvertSphereToPoint(sphereCollision: SphereCollision, transform: PhysicsTransform, sourcePoint: Point, sourceMatrix: Matrix, baseUnit: number) {
    let rotationMatrix = sourceMatrix.identity().rotate(transform.rotation);

    sphereCollision.x *= baseUnit;
    sphereCollision.y *= baseUnit;
    sphereCollision.radius *= baseUnit;

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

export function getFlipperPhysics(id: number, max_rotation: number, min_rotation: number) : PhysicsTransform {
    return {
        id : id,
        position: {x: 0, y: 0},
        velocity:  {x: 0, y: 0},
        acceleration:  {x: 0, y: 0},
        scale:{x: 1, y: 1},
        rotation: min_rotation,
        angular: 0,
    };
}