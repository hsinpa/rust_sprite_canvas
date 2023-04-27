export function load_unity_sprite_struct(file_path: string) : Promise<string>{
    let VertPros = fetch(file_path, {method: 'GET', credentials: 'include'});

    return VertPros.then(r => {
        return r.text();
    }).then(t => {
        return t;
    })
}