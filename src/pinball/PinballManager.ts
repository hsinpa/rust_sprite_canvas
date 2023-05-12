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

    private _previous_timestamp: number;

    public DeltaTime : number;

    private _physics_worker: Worker;

    constructor(query: string) {

        this._physics_worker = new Worker(
            new URL('./pinball/thread/pinball_thread.ts', import.meta.url), {type: 'module'}
        );

        this._physics_worker.onmessage = (msg) => {
            console.log('message received from worker', msg.data);
        };
        
        this._physics_worker.postMessage('message sent to worker');
    
        this._spriteAssets = new SpriteAssetManager();
        this._mapLayoutManager = new MapLayoutManager(this._spriteAssets);
        this._pixi_dom = document.querySelector(query);

        this.prepare_layout_asset();

        this.update_loop(0);
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

        this._mapLayoutManager.set_browser_stat(sceneLayout.screen_width, sceneLayout.screen_height);
        console.log(sceneLayout);

        this._pixi_app = new Application({ width: sceneLayout.screen_width, height: sceneLayout.screen_height, background: '#c2bebf' });
        this._pixi_dom.appendChild<any>(this._pixi_app.view);

        this._mapLayoutManager.render_map(sceneLayout, this._pixi_app.stage);
    }

    private update_loop(timestamp: number) {
        this.DeltaTime = (timestamp - this._previous_timestamp) * 0.001;
        this._previous_timestamp = timestamp;

        window.requestAnimationFrame(this.update_loop.bind(this));
    }

}