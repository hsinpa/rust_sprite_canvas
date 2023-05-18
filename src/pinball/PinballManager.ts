import { Application, Sprite } from "pixi.js";
import { SpriteAssetManager } from "./SpriteAssetManager";
import { Config } from "./utility/pinball_static";
import { SpriteSyntaxStruct } from "./utility/unity_sprite_struct";
import MapLayoutManager from "./MapLayoutManager";
import {ThreadEventKey} from "./thread/pinball_thread_event";
import {DynamicRenderer} from './DynamicRenderer';
import { vec2 } from "gl-matrix";
import { DynamicsType, SphereObject } from "./utility/pinball_types";

export class PinballManager {

    private _spriteAssets : SpriteAssetManager;
    private _mapLayoutManager: MapLayoutManager;
    private _pixi_app : Application;
    private _pixi_dom: HTMLCanvasElement;

    private _previous_timestamp: number = 0;
    private _dynamicsRenderer: DynamicRenderer;

    public DeltaTime : number;

    private _physics_worker: Worker;
    private _woker_ready_flag: boolean = false;
    private demo_sphere: SphereObject;
    private _objects: any[] = [];

    constructor(query: string) {
        this._physics_worker = new Worker(
            new URL('./thread/pinball_thread.ts', import.meta.url), {type: 'module'}
        );

        this._physics_worker.onmessage = this.on_worker_callback.bind(this);

        this._spriteAssets = new SpriteAssetManager();
        this._mapLayoutManager = new MapLayoutManager(this._spriteAssets);
        this._dynamicsRenderer = new DynamicRenderer(this._mapLayoutManager);
        this._pixi_dom = document.querySelector(query);

        this.demo_sphere = {
            id : 323,
            angular: 0,
            position: {x: 200, y: 200},
            velocity:  {x: 0, y: 0},
            acceleration:  {x: 0, y: 0},
            rotation: 0,
            type: DynamicsType.Sphere,
            radius: 20
        };
        this._objects.push(this.demo_sphere);
        this.prepare_layout_asset();
        this.update_loop(0);
    }

    private async prepare_layout_asset() {
        //Load spritesheet
        await this._spriteAssets.prepare_spritesheet(Config.pinball_spritesheet);

        //Load map data
        let sceneLayout = await this._mapLayoutManager.load_map(Config.pinball_map_layout);
        let browser_width = document.documentElement.clientWidth;
        let aspect_ratio = sceneLayout.frame_height / sceneLayout.frame_width;
        let browser_heigth = browser_width * aspect_ratio;

        this._mapLayoutManager.set_browser_stat(sceneLayout.screen_width, sceneLayout.screen_height);
        console.log(sceneLayout);

        this._physics_worker.postMessage({id: ThreadEventKey.WorldConstruct, world_width: sceneLayout.screen_width, world_height: sceneLayout.screen_height });
        this._physics_worker.postMessage({id: ThreadEventKey.ObjectPush, 
                                                spheres: [this.demo_sphere] });

        this._pixi_app = new Application({ width: sceneLayout.screen_width, height: sceneLayout.screen_height, background: '#c2bebf' });
        this._pixi_dom.appendChild<any>(this._pixi_app.view);

        this._pixi_app.stage.addChild(this._dynamicsRenderer.get_primitive_grapics);

        this._mapLayoutManager.render_map(sceneLayout, this._pixi_app.stage);
        this._woker_ready_flag = true;
    }

    private on_worker_callback(msg: MessageEvent<any>) {
        this._woker_ready_flag = true;

        if ("id" in msg.data) {
            if (msg.data.id == ThreadEventKey.ObjectUpdate) {
                this._objects = msg.data.objects;
            }
        }
    }

    private update_loop(timestamp: number) {
        if (this._woker_ready_flag) {

            this._woker_ready_flag = false;

            this.DeltaTime = (timestamp - this._previous_timestamp) * 0.001;
            this._previous_timestamp = timestamp;
            this._physics_worker.postMessage({id: ThreadEventKey.Simulate, delta_time: this.DeltaTime});    
        }
        //console.log("Update");

        this._dynamicsRenderer.draw(this._objects);

        window.requestAnimationFrame(this.update_loop.bind(this));
    }

}