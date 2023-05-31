import { IntVector2 } from "./UniversalType";
import { Lerp } from "./UtilityMethod";

export class Vector2 {
    x: number = 0;
    y: number = 0;

    constructor() {
        return new Vector2();
    }

    public set(x: number, y: number) {
        this.x = x;
        this.y = y;

        return this;
    }

    public eject(): IntVector2 {
        return {x: this.x, y: this.y}
    }

    public scale(value: number) {
        this.x *= value;
        this.y *= value;

        return this;
    }

    public add(vec: Vector2) {
        this.x += vec.x;
        this.y += vec.y;

        return this;
    }

    public substract(vec: Vector2) {
        this.x -= vec.x;
        this.y -= vec.y;

        return this;
    }


    public add_scalar(value: number) {
        this.x += value;
        this.y += value;

        return this;
    }

    public substract_scalar(value: number) {
        this.x -= value;
        this.y -= value;

        return this;
    }

    public length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); 
    }

    public normalize() {
        let vi = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        this.x = this.x / vi;
        this.y = this.y / vi;

        return this;        
    }
    //#region  Global Static

    public static PerpendicularClockwise(vector: Vector2, source? : Vector2) : Vector2
    {
        if (source == undefined) {
            source = new Vector2();
        }

        source.set(vector.y, -vector.x);
        return source;
    }

    public static from_value(x: number, y: number) {
        let v = new Vector2();
        v.x = x;
        v.y = y;
        return v;
    }

    public static copy_from(intvector: IntVector2) {
        return this.from_value(intvector.x, intvector.y);
    }

    public static distance(vec_a: Vector2, vec_b: Vector2) {
        return Math.sqrt(Math.pow(vec_b.x - vec_a.x, 2) + Math.pow(vec_b.y - vec_a.y, 2));
    }

    public static normalize2D(vector : Vector2) : Vector2 {
        let vi = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
        return this.from_value(vector.x / vi, vector.y / vi );
    }

    public static dot(vec_a: Vector2, vec_b : Vector2) {
        return (vec_a.x * vec_b.x) + (vec_a.y * vec_b.y);
    }

    public lerp(vec_a: Vector2, vec_b: Vector2, t: number, source?: Vector2) {
        if (source == undefined) source = new Vector2();

        source.set(
            Lerp(vec_a.x, vec_b.x, t),
            Lerp(vec_a.y, vec_b.y, t)
        );
        
        return source;
    }
    //#endregion

}