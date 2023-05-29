import {PhysicsInterface, PositionTransformation} from './PhysicsInterface';
import { PhysicsTransform } from "../utility/pinball_types";
import { ColliderStruct, SpriteLayoutStruct, LineCollision } from "../utility/unity_sprite_struct";
import { IntVector2 } from "../../utility/UniversalType";
import { Graphics, Matrix, Point, PI_2 } from 'pixi.js';
import {Lerp, PerpendicularClockwise, Normalize2D, VectorSubstract, VectorDistance} from '../../utility/UtilityMethod'


export default class LineComponent extends PhysicsInterface {
    private _lineCollision: LineCollision;
    private _rotationMatrix: Matrix;

    constructor(id: number, tag: number, base_unit: number) {
        super(id, tag, base_unit);
        this._rotationMatrix = new Matrix();
    }

    parse_collision_struct(collision_data: ColliderStruct): void {
        this._lineCollision = JSON.parse(collision_data.data);

        this._rotationMatrix = this._rotationMatrix.rotate(-this._transform.rotation);

        let new_point_a = this._rotationMatrix.apply(new Point(this._lineCollision.point_a.x, this._lineCollision.point_a.y) );
        let new_point_b = this._rotationMatrix.apply(new Point(this._lineCollision.point_b.x, this._lineCollision.point_b.y) );

        this._lineCollision.point_a.x = new_point_a.x * this._base_unit;
        this._lineCollision.point_a.y = new_point_a.y * this._base_unit;
        this._lineCollision.point_b.x = new_point_b.x * this._base_unit;
        this._lineCollision.point_b.y = new_point_b.y * this._base_unit;
    }

    render_collider(graphics: Graphics): void {
        let point_a : IntVector2 = {x: this._lineCollision.point_a.x, y: this._lineCollision.point_a.y};
        let point_b : IntVector2 = {x: this._lineCollision.point_b.x, y: this._lineCollision.point_b.y };

        let subtraction = VectorSubstract(point_a, point_b);
        let normal = PerpendicularClockwise(Normalize2D(subtraction));
        let center_x = Lerp(point_a.x, point_b.x, 0.5) + this._transform.position.x;
        let center_y = Lerp(point_a.y, point_b.y, 0.5) + this._transform.position.y;
        let normalDist = VectorDistance(point_a, point_b) * 0.2;

        let thickness = 2;
        graphics.lineStyle(thickness, 0xffffff)
        .moveTo(this._transform.position.x  + this._lineCollision.point_a.x, this._transform.position.y + this._lineCollision.point_a.y)
        .lineTo(this._transform.position.x  + this._lineCollision.point_b.x, this._transform.position.y + this._lineCollision.point_b.y).endFill();

        graphics.lineStyle(thickness, 0xd91ed3)
        .moveTo(center_x, center_y)
        .lineTo( center_x + (normal.x * normalDist), center_y + (normal.y * normalDist)).endFill();
    }

    parse_properties_struct(properties_data: string): void {
    }

    handle_collision(physicsObject: PhysicsTransform): void {

    }
}