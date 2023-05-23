import { Point } from "pixi.js";

export function load_textfile(file_path: string) : Promise<string>{
    let VertPros = fetch(file_path, {method: 'GET', credentials: 'include'});

    return VertPros.then(r => {
        return r.text();
    }).then(t => {
        return t;
    })
}

export function convert_position(x: number, y: number, original_max_x: number, original_max_y: number, dest_max_x: number, dest_max_y: number) {
    let half_width = original_max_x * 0.5;
    let half_height = original_max_y * 0.5;

    let x_ratio =  ( ((half_width) + x) / original_max_x);
    let y_ratio = 1 - ( ( (half_height) + y) / original_max_y);

    return new Point(x_ratio * dest_max_x, y_ratio * dest_max_y);
}