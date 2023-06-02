import { Application, Sprite } from "pixi.js";
import { SpriteAssetManager } from "./SpriteAssetManager";
import { Config, PinballLayer } from "./utility/pinball_static";
import { SpriteSyntaxStruct } from "./utility/unity_sprite_struct";
import MapLayoutManager from "./MapLayoutManager";
import {ThreadEventKey} from "./thread/pinball_thread_event";
import {DynamicRenderer} from './DynamicRenderer';
import { vec2 } from "gl-matrix";
import { PhysicsTransform } from "./utility/pinball_types";
import { Clamp } from "../utility/UtilityMethod";
import InputHandler, { ButtonState } from "../utility/Input/InputHandler";
import { InputEventTitle} from "../utility/Input/KeycodeTable";
import { PhysicsVisualizeTool } from "./collider_component/PhysicsVisualizeTool";
import { PhysicsInterface } from "./collider_component/PhysicsInterface";
import { Vector2 } from "../utility/VectorMath";

export class PinballManager {

    private _spriteAssets : SpriteAssetManager;
    private _mapLayoutManager: MapLayoutManager;
    private _pixi_app : Application;
    private _pixi_dom: HTMLCanvasElement;
    private _inputHandler: InputHandler;

    private _previous_timestamp: number = 0;
    private _dynamicsRenderer: DynamicRenderer;
    private _visualizer: PhysicsVisualizeTool;

    public DeltaTime : number;

    private _physics_worker: Worker;
    private _woker_ready_flag: boolean = false;
    private _objects: PhysicsTransform[] = [];
    private _cache_vector : Vector2 = new Vector2(5, 23);

    constructor(query: string) {
        this._pixi_dom = document.querySelector(query);
        this._physics_worker = new Worker(
            new URL('./thread/pinball_thread.ts', import.meta.url), {type: 'module'}
        );

        this._physics_worker.onmessage = this.on_worker_callback.bind(this);
        this._inputHandler = new InputHandler();
        this._inputHandler.RegisterKeyCodeEvent(this.on_keyboard_input.bind(this));

        this._spriteAssets = new SpriteAssetManager();
        this._mapLayoutManager = new MapLayoutManager(this._spriteAssets);
        this._dynamicsRenderer = new DynamicRenderer(this._mapLayoutManager);

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

        this._pixi_app = new Application({ width: sceneLayout.screen_width, height: sceneLayout.screen_height, background: '#83a32c' });
        this._pixi_dom.appendChild<any>(this._pixi_app.view);

        this._mapLayoutManager.render_map(sceneLayout, this._pixi_app.stage);
        this._mapLayoutManager.auto_resize_canvas();

        this._visualizer = new PhysicsVisualizeTool(sceneLayout);
        this._visualizer.visualize();

        this._physics_worker.postMessage({id: ThreadEventKey.WorldConstruct, scene_layout: sceneLayout, vector : this._cache_vector });
        // this._physics_worker.postMessage({id: ThreadEventKey.ObjectPush, 
        //                                         spheres: [] });

        this._pixi_app.stage.addChild(this._dynamicsRenderer.get_primitive_grapics);
        this._pixi_app.stage.addChild(this._visualizer.Primitives);
                                        
        this._woker_ready_flag = true;
    }

    private on_worker_callback(msg: MessageEvent<any>) {
        this._woker_ready_flag = true;

        if ("id" in msg.data) {
            if (msg.data.id == ThreadEventKey.ObjectUpdate) {
                this._objects = msg.data.objects;


                // this._objects.forEach(x => {
                    
                //     if (x.id == 95034) {

                //     }
                // });

            }
        }
    }

    private update_loop(timestamp: number) {
        if (this._woker_ready_flag) {

            this._woker_ready_flag = false;

            this.DeltaTime = (timestamp - this._previous_timestamp) * 0.001;
            this.DeltaTime = Clamp(this.DeltaTime, 0.001, 0.02);

            this._previous_timestamp = timestamp;
            this._physics_worker.postMessage({id: ThreadEventKey.Simulate, delta_time: this.DeltaTime});    
        }

        this._dynamicsRenderer.draw(this._objects);
        window.requestAnimationFrame(this.update_loop.bind(this));
    }

    private on_keyboard_input(buttonState: ButtonState) {
        //console.log(`ButtonState ${buttonState.keycode}, ${buttonState.status}`);

        this._physics_worker.postMessage({id: ThreadEventKey.Input, state: buttonState});    
    }
}