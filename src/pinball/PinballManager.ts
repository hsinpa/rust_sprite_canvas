import { Application, Sprite } from "pixi.js";
import { SpriteAssetManager } from "./SpriteAssetManager";
import { Config } from "./utility/pinball_static";
import { SpriteSyntaxStruct } from "./utility/unity_sprite_struct";

export class PinballManager {

    private _spriteAssets : SpriteAssetManager;
    private _pixi_app : Application;

    constructor(query: string) {
        this._spriteAssets = new SpriteAssetManager();
        this._pixi_app = new Application({ width: 640, height: 460, background: '#c2bebf' });
        let pixi_dom = document.querySelector(query);
        pixi_dom.appendChild<any>(this._pixi_app.view);

        this.prepare_layout_asset();
    }

    private async prepare_layout_asset() {
        await this._spriteAssets.prepare_spritesheet(Config.pinball_spritesheet);
        let texture = this._spriteAssets.get_texture("pinball_sprite_5");

        //if (texture != null) {
            let bumper_sprite = Sprite.from(texture);
            bumper_sprite.transform.position.x = 320;
            bumper_sprite.transform.position.y = 230;
            bumper_sprite.transform.scale.set(1, 1);
            bumper_sprite.anchor.set(0.5);
            
            this._pixi_app.stage.addChild(bumper_sprite);
            console.log(bumper_sprite);

        //}

    }

}