import { Matrix, Point } from "pixi.js";
import { PhysicsTransform } from "../utility/pinball_types";
import { SphereCollision } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { VectorSubstract, VectorDot, Clamp, VectorNumScale, VectorAdd} from "../../utility/UtilityMethod";
import { Vector2 } from "../../utility/VectorMath";

export interface ClosestPointStruct {
    point: Vector2,
    t: number,
}

export function NormalizeSphereCollider(sphereCollision: SphereCollision, baseUnit: number) {
    sphereCollision.x *= baseUnit;
    sphereCollision.y *= baseUnit;
    sphereCollision.radius *= baseUnit;

    return sphereCollision;
}

export function ConvertSphereToVector(sphereCollision: SphereCollision, transform: PhysicsTransform, sourcePoint: Vector2, sourceMatrix: Matrix) {
    let rotationMatrix = sourceMatrix.identity().rotate(-transform.rotation);

    sourcePoint = sourcePoint.set(sphereCollision.x, sphereCollision.y);

    rotationMatrix.apply(sourcePoint, sourcePoint);

    sourcePoint.x += transform.position.x;
    sourcePoint.y += transform.position.y;

    return sourcePoint;
}

export function closestPointOnSegment(point: Vector2, a : Vector2, b : Vector2, source? :Vector2) : ClosestPointStruct {
    if (source == undefined) source = new Vector2();

    let ab = Vector2.substract(b, a);
    let t = Vector2.dot(ab, ab);
        t = (Vector2.dot(point, ab) - Vector2.dot(a, ab)) / t;
        t = Clamp(t, 0 , 1);

    let offset = ab.scale(t);
    return {point: Vector2.add(a, offset, source ), t: t} ;    
}
