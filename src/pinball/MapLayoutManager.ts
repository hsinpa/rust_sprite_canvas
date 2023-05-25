import { Container, DisplayObject, Sprite, Point } from 'pixi.js';
import { SpriteAssetManager } from './SpriteAssetManager';
import {load_textfile} from './utility/map_loader';
import {SceneLayoutStruct, SpriteLayoutStruct} from './utility/unity_sprite_struct';
import {PinballLayer} from './utility/pinball_static';
import {convert_position} from './utility/map_loader';
import {Dictionary} from 'typescript-collections';


export default class MapLayoutManager {
    
    private _pinball_sprite_struct : SceneLayoutStruct
    private _sprite_assets: SpriteAssetManager;
    private _width: number;
    private _height: number;
    private _canvas_dom: HTMLCanvasElement;
    private _aspect_ratio : number;
    private _sprite_layout: SceneLayoutStruct;
    private _sprite_dict: Dictionary<number, Sprite> = new Dictionary();
    
    _flipper_right: Sprite;
    _flipper_left: Sprite;

    public get width() { return this._width};
    public get height() { return this._height};

    constructor(sprite_assets: SpriteAssetManager) {
        this._sprite_assets = sprite_assets;
        window.addEventListener("resize", this.auto_resize_canvas.bind(this));
    }

    public get_sprite(id: number) {
        return this._sprite_dict.getValue(id);
    }

    public push_sprite(id: number, sprite: Sprite) {
        this._sprite_dict.setValue(id, sprite);
    }
    
    public remove_sprite(id: number) {
        this._sprite_dict.remove(id);
    }

    set_browser_stat(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._aspect_ratio = this._height / this._width;

        this.auto_resize_canvas();
    }

    async load_map(file_path: string) : Promise<SceneLayoutStruct> {
        let scene_layout = await load_textfile(file_path);
        this._pinball_sprite_struct = JSON.parse(scene_layout);

        return this._pinball_sprite_struct;
    }

    private auto_resize_canvas() {
        if (this._canvas_dom == null) 
            this._canvas_dom = document.getElementsByTagName("canvas")[0];

        if (this._canvas_dom == null) return;

        let current_ratio = window.innerHeight / window.innerWidth;
        this._canvas_dom.style.maxWidth = this._width + "px";
        this._canvas_dom.style.maxHeight = this._height + "px";

        if (current_ratio >= this._aspect_ratio) {
            this._canvas_dom.style.width = "100%";
            this._canvas_dom.style.height = "auto";
        } else {
            this._canvas_dom.style.width = "auto";
            this._canvas_dom.style.height = "100%";
        }
    }

    private convert_scale(value: number, unity_x: number, world_x: number) {
        let diff =(world_x - unity_x)  
    }

    render_map(sprite_layout: SceneLayoutStruct, container: Container<DisplayObject>) {
        if (this._pinball_sprite_struct == null) return;

        this._sprite_layout = sprite_layout;
        let sprite_lens = sprite_layout.spriteLayoutStructs.length;
        
        for (let i = 0; i < sprite_lens; i++) {
            let singleLayout : SpriteLayoutStruct = sprite_layout.spriteLayoutStructs[i];
            let texture = this._sprite_assets.get_texture(singleLayout.sprite_name);
            let spriteStruct = this._sprite_assets.get_sprite_struct(singleLayout.sprite_name);

            let sprite = Sprite.from(texture);

            //Position
            let point = convert_position(singleLayout.x, singleLayout.y, sprite_layout.frame_width, sprite_layout.frame_height, sprite_layout.screen_width, sprite_layout.screen_height);
            sprite.transform.position.x = point.x;
            sprite.transform.position.y = point.y;
            
            sprite_layout.spriteLayoutStructs[i].x = point.x;
            sprite_layout.spriteLayoutStructs[i].y = point.y;

            
            //Scale
            this.convert_scale(singleLayout.scale_x * singleLayout.flip_x, sprite_layout.frame_width, this._width);
            sprite.transform.scale.set( singleLayout.scale_x * singleLayout.flip_x, 
                                        singleLayout.scale_y * singleLayout.flip_y);
            
            //Rotation
            sprite.anchor.set(spriteStruct.pivot_x, 1-spriteStruct.pivot_y);
            sprite.rotation = -singleLayout.rotation;

            if (singleLayout.tag == PinballLayer.Flipper_Left)
                this._flipper_left = sprite;

            if (singleLayout.tag == PinballLayer.Flipper_Right)
                this._flipper_right = sprite;

            this._sprite_dict.setValue(singleLayout.id, sprite);

            container.addChild(sprite);
        }
    }

}