import { Application, Sprite } from "pixi.js";
import { SpriteAssetManager } from "./SpriteAssetManager";
import { Config } from "./utility/pinball_static";
import { SpriteSyntaxStruct } from "./utility/unity_sprite_struct";
import MapLayoutManager from "./MapLayoutManager";

export class PinballManager {

    private _spriteAssets : SpriteAssetManager;
    private _mapLayoutManager: MapLayoutManager;
    private _pixi_app : Application;
    private _pixi_dom: HTMLCanvasElement;

    constructor(query: string, ) {
        this._spriteAssets = new SpriteAssetManager();
        this._mapLayoutManager = new MapLayoutManager(this._spriteAssets);
        this._pixi_dom = document.querySelector(query);

        this.prepare_layout_asset();
    }

    private async prepare_layout_asset() {
        //Load spritesheet
        await this._spriteAssets.prepare_spritesheet(Config.pinball_spritesheet);
        // let texture = this._spriteAssets.get_texture("pinball_sprite_5");

        //if (texture != null) {
            // let bumper_sprite = Sprite.from(texture);
            // bumper_sprite.transform.position.x = 320;
            // bumper_sprite.transform.position.y = 230;
            // bumper_sprite.transform.scale.set(1, 1);
            // bumper_sprite.anchor.set(0.5);
            
            // this._pixi_app.stage.addChild(bumper_sprite);
            // console.log(bumper_sprite);

        //}

        //Load map data
        let sceneLayout = await this._mapLayoutManager.load_map(Config.pinball_map_layout);
        let browser_width = document.documentElement.clientWidth;
        let aspect_ratio = sceneLayout.frame_height / sceneLayout.frame_width;
        let browser_heigth = browser_width * aspect_ratio;

        this._mapLayoutManager.set_browser_stat(browser_width, browser_heigth);
        console.log(sceneLayout);

        this._pixi_app = new Application({ width: browser_width, height: browser_heigth, background: '#c2bebf' });
        this._pixi_dom.appendChild<any>(this._pixi_app.view);

        this._mapLayoutManager.render_map(sceneLayout, this._pixi_app.stage);
    }

}