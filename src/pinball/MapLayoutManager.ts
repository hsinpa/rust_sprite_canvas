import { Container, DisplayObject, Sprite, Point } from 'pixi.js';
import { SpriteAssetManager } from './SpriteAssetManager';
import {load_textfile} from './utility/map_loader';
import {SceneLayoutStruct, SpriteLayoutStruct} from './utility/unity_sprite_struct';
import {PinballLayer} from './utility/pinball_static';

export default class MapLayoutManager {
    
    private _pinball_sprite_struct : SceneLayoutStruct
    private _sprite_assets: SpriteAssetManager;
    private _width: number;
    private _height: number;
    private _canvas_dom: HTMLCanvasElement;
    private _aspect_ratio : number;
    private _sprite_layout: SceneLayoutStruct;
    
    _flipper_right: Sprite;
    _flipper_left: Sprite;

    public get width() { return this._width};
    public get height() { return this._height};

    constructor(sprite_assets: SpriteAssetManager) {
        this._sprite_assets = sprite_assets;
        window.addEventListener("resize", this.auto_resize_canvas.bind(this));
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

    private convert_position(x: number, y: number) {
        let half_width = this._pinball_sprite_struct.frame_width * 0.5;
        let half_height = this._pinball_sprite_struct.frame_height * 0.5;

        let x_ratio =  ( ((half_width) + x) / this._pinball_sprite_struct.frame_width);
        let y_ratio = 1 - ( ( (half_height) + y) / this._pinball_sprite_struct.frame_height);

        return new Point(x_ratio * this._width, y_ratio * this._height);
    }

    private convert_scale(value: number, unity_x: number, world_x: number) {
        let diff =(world_x - unity_x)  
    }

    render_map(sprite_layout: SceneLayoutStruct, container: Container<DisplayObject>) {
        if (this._pinball_sprite_struct == null) return;

        this._sprite_layout = sprite_layout;
        let sprite_lens = sprite_layout.spriteLayoutStructs.length;
        
        for (let i = 0; i < sprite_lens; i++) {
            let spriteLayout : SpriteLayoutStruct = sprite_layout.spriteLayoutStructs[i];
            let texture = this._sprite_assets.get_texture(spriteLayout.sprite_name);
            let spriteStruct = this._sprite_assets.get_sprite_struct(spriteLayout.sprite_name);

            let sprite = Sprite.from(texture);

            //Position
            let point = this.convert_position(spriteLayout.x, spriteLayout.y);
            sprite.transform.position.x = point.x;
            sprite.transform.position.y = point.y;

            //Rotation
            sprite.anchor.set(spriteStruct.pivot_x, spriteStruct.pivot_y);
            sprite.rotation = -spriteLayout.rotation;
            
            //Scale
            this.convert_scale(spriteLayout.scale_x * spriteLayout.flip_x, sprite_layout.frame_width, this._width);
            sprite.transform.scale.set( spriteLayout.scale_x * spriteLayout.flip_x, 
                                        spriteLayout.scale_y * spriteLayout.flip_y);


            if (spriteLayout.tag == PinballLayer.Flipper_Left)
                this._flipper_left = sprite;

            if (spriteLayout.tag == PinballLayer.Flipper_Left)
                this._flipper_right = sprite;

            container.addChild(sprite);
        }
    }

}