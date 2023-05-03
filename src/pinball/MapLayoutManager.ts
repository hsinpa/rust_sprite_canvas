import { SpriteAssetManager } from './SpriteAssetManager';
import {load_textfile} from './utility/map_loader';
import {SceneLayoutStruct, SpriteLayoutStruct} from './utility/unity_sprite_struct';

export default class MapLayoutManager {
    
    private _pinball_sprite_struct : SceneLayoutStruct
    private _sprite_assets: SpriteAssetManager;

    constructor(sprite_assets: SpriteAssetManager) {
        this._sprite_assets = sprite_assets;
    }

    async load_map(file_path: string) : Promise<SceneLayoutStruct> {
        let scene_layout = await load_textfile(file_path);
        this._pinball_sprite_struct = JSON.parse(scene_layout);

        return this._pinball_sprite_struct;
    }

    render_map() {
        if (this._pinball_sprite_struct == null) return;

        
    }

}