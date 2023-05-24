import { Graphics } from "pixi.js";
import { CollisionType, SceneLayoutStruct, SpriteLayoutStruct } from "../utility/unity_sprite_struct";
import LineComponent from "./LineComponent";
import OvalComponent from "./OvalComponent";
import { PhysicsInterface } from "./PhysicsInterface";
import RectComponent from "./RectComponent";
import SphereComponent from "./SphereComponent";

export function parse_collision_data(spriteLayoutStructs : SpriteLayoutStruct, base_unit : number) : PhysicsInterface {
    if (spriteLayoutStructs.collisionStruct == null || spriteLayoutStructs.collisionStruct.data == "") return;

    if (spriteLayoutStructs.collisionStruct.collisionType == CollisionType.Line) return new LineComponent(spriteLayoutStructs.id, base_unit);
    if (spriteLayoutStructs.collisionStruct.collisionType == CollisionType.Oval) return new OvalComponent(spriteLayoutStructs.id, base_unit);
    if (spriteLayoutStructs.collisionStruct.collisionType == CollisionType.Rect) return new RectComponent(spriteLayoutStructs.id, base_unit);
    if (spriteLayoutStructs.collisionStruct.collisionType == CollisionType.Sphere) return new SphereComponent(spriteLayoutStructs.id, base_unit);

    return null;
}

export function parse_collision_array(layout: SceneLayoutStruct) {
    const base_width = layout.screen_width / layout.frame_width;
    const base_height = layout.screen_height / layout.frame_height;
    
    let objectLens = layout.spriteLayoutStructs.length;
    let physicsComponents: PhysicsInterface[] = [];

    for (let i = 0; i < objectLens; i++) {
        let spriteStruct = layout.spriteLayoutStructs[i];
        let physicsInterface = parse_collision_data(spriteStruct, base_width);

        if (physicsInterface == null) continue;

        physicsInterface.parse_collision_struct(spriteStruct.collisionStruct);
        physicsInterface.update_transform({
            id: spriteStruct.id, rotation: spriteStruct.rotation,
            position: {x: spriteStruct.x, y: spriteStruct.y }, scale: {x: spriteStruct.scale_x, y: spriteStruct.scale_y}});

        physicsComponents.push(physicsInterface);
    }

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