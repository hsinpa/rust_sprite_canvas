import WebglResource from "../utility/WebglResource";
import { load_textfile } from "./utility/map_loader";
import { Config } from "./utility/pinball_static";
import { SpriteStruct, SpriteSyntaxStruct } from "./utility/unity_sprite_struct";
import {Dictionary} from 'typescript-collections';
import { Spritesheet, BaseTexture, Texture, Resource, utils } from 'pixi.js';

export class SpriteAssetManager {
    
    private _webResource : WebglResource;
    private _pinballSpritesheet: Spritesheet;
    private _pinballDict: utils.Dict<Texture<Resource>>;
    private _spriteStructDict : Dictionary<string, SpriteStruct> = new Dictionary<string, SpriteStruct>();

    constructor() {
        this._webResource = new WebglResource();
    }

    get_texture(key: string) {
        if (key in this._pinballDict) {
            return this._pinballDict[key];
        }
        return null;
    }

    get_sprite_struct(key: string) {
        if (this._spriteStructDict.containsKey(key)) {
            return this._spriteStructDict.getValue(key);
        }
        return null;
    }

    async prepare_spritesheet(spritesheet_path: string) {
        let sprite_layout = await load_textfile(spritesheet_path);
        let pinball_sprite_struct : SpriteSyntaxStruct = JSON.parse(sprite_layout);
        let pinball_spritesheet_data = this.parse_spritelayout_spritsheet(pinball_sprite_struct);

        console.log(pinball_spritesheet_data);

        const sheet = new Spritesheet(BaseTexture.from(Config.pinball_texture), pinball_spritesheet_data);
        const dict = await sheet.parse();
        this._pinballSpritesheet = sheet;
        this._pinballDict = dict;
    }

    private parse_spritelayout_spritsheet(sprite_syntax: SpriteSyntaxStruct) {
        if (sprite_syntax.sprites == null) return null;
        let sprite_lens = sprite_syntax.sprites.length;
        let pixi_sprite_format : any = { "frames" : {  },
            "meta": {
                "scale": "1",
            }
        };

        for (let i = 0; i < sprite_lens; i++) {
            let spriteStruct = sprite_syntax.sprites[i];
            let anchor_x = Math.round(spriteStruct.pivot_x * spriteStruct.width);
            let anchor_y = Math.round(spriteStruct.pivot_y * spriteStruct.height);

            pixi_sprite_format.frames[spriteStruct.name] = {
                "frame": {"x":spriteStruct.x, "y": ( sprite_syntax.height - spriteStruct.height) - spriteStruct.y, "w":spriteStruct.width, "h":spriteStruct.height},
                "anchor" : {"x":anchor_x,"y":anchor_y},
                "sourceSize": {"w":spriteStruct.width,"h":spriteStruct.height},
            };


            console.log(spriteStruct.name);
            this._spriteStructDict.setValue(spriteStruct.name, spriteStruct);
        }


        //console.log(pixi_sprite_format);
        return pixi_sprite_format;
    }


}

