import { Graphics, PI_2 } from "pixi.js";
import { CollisionType, SceneLayoutStruct, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import LineComponent from "./LineComponent";
import OvalComponent from "./OvalComponent";
import { PhysicsInterface } from "./PhysicsInterface";
import RectComponent from "./RectComponent";
import SphereComponent from "./SphereComponent";
import { IntVector2 } from "../../utility/UniversalType";
import { Vector2 } from "../../utility/VectorMath";

export function parse_collision_data(spriteLayoutStructs : SpriteLayoutStruct, base_unit : number) : PhysicsInterface {
    if (spriteLayoutStructs.collisionStruct == null || spriteLayoutStructs.collisionStruct.data == "") return;

    let inverse_value = (spriteLayoutStructs.flip_x == 1) ? -1 : 1;

    if (spriteLayoutStructs.collisionStruct.collisionType == CollisionType.Line) return new LineComponent(spriteLayoutStructs.id, spriteLayoutStructs.tag, inverse_value, base_unit);
    if (spriteLayoutStructs.collisionStruct.collisionType == CollisionType.Oval) return new OvalComponent(spriteLayoutStructs.id, spriteLayoutStructs.tag, inverse_value, base_unit);
    if (spriteLayoutStructs.collisionStruct.collisionType == CollisionType.Rect) return new RectComponent(spriteLayoutStructs.id, spriteLayoutStructs.tag, inverse_value, base_unit);
    if (spriteLayoutStructs.collisionStruct.collisionType == CollisionType.Sphere) return new SphereComponent(spriteLayoutStructs.id, spriteLayoutStructs.tag, inverse_value,base_unit);

    return null;
}

export function parse_sprite_struct(sprite_layout: SpriteLayoutStruct) {

}

export function parse_collection_opt(layout: SceneLayoutStruct, callback: (spriteLayout: SpriteLayoutStruct, physicsInterface: PhysicsInterface) => void) {
    const base_width = layout.screen_width / layout.frame_width;    
    let objectLens = layout.spriteLayoutStructs.length;
    const zero_vector : IntVector2 = {x : 0, y: 0};

    for (let i = 0; i < objectLens; i++) {
        let spriteStruct = layout.spriteLayoutStructs[i];
        let physicsInterface = parse_collision_data(spriteStruct, base_width);
        if (physicsInterface == null) continue;

        physicsInterface.set_transform({
            velocity: new Vector2(), acceleration: new Vector2(), angular: 0,
            id: spriteStruct.id, rotation: spriteStruct.rotation,
            position: new Vector2(spriteStruct.x, spriteStruct.y), scale: new Vector2(spriteStruct.scale_x, spriteStruct.scale_y)
            
        }, spriteStruct.constraintStruct);

        physicsInterface.parse_collision_struct(spriteStruct.collisionStruct);
        physicsInterface.parse_properties_struct(spriteStruct.properties);

        callback(spriteStruct, physicsInterface);
    }
}

export function parse_collision_array(layout: SceneLayoutStruct) {
    let physicsComponents: PhysicsInterface[] = [];

    parse_collection_opt(layout, (spriteLayout, physicsInterface) => {
        physicsComponents.push(physicsInterface);
    });

    return physicsComponents;
}

export class PhysicsVisualizeTool {

    private _physicsComponents: PhysicsInterface[] = [];
    private _screen_height: number;
    private _primitives : Graphics;

    public get Primitives() { return this._primitives;}

    constructor(layout: SceneLayoutStruct) {
        this._primitives = new Graphics();

        this._screen_height = layout.screen_height;
        this._physicsComponents = parse_collision_array(layout);
    }

    public visualize() {
        let objectLens = this._physicsComponents.length;
    
        for (let i = 0; i < objectLens; i++) { 
            this._physicsComponents[i].render_collider(this._primitives, this._screen_height);
        }
    }
}