use bevy::asset::{Assets, AssetServer, Handle};
use bevy::math::Vec3;
use bevy::prelude::{Color, Commands, Image, KeyCode, Mesh, OrthographicCameraBundle, Res, ResMut, shape, Transform};
use bevy::render::render_resource::Texture;
use bevy::sprite::{ColorMaterial, MaterialMesh2dBundle, SpriteBundle};
use bevy::ui::Direction;
use crate::utility::types::{Car, Player};
use crate::utility::external_types::{InputDeviceType};
use crate::utility::utility_func::{read_file, parse_json_file};

pub fn setup(mut commands: Commands,
             mut meshes: ResMut<Assets<Mesh>>,
             mut materials: ResMut<Assets<ColorMaterial>>,
             asset_server: Res<AssetServer>) {
    commands.spawn_bundle(OrthographicCameraBundle::new_2d());

    let vehicle_tex_01:Handle<Image> = asset_server.load("car_pack/JeepB.png");

    commands.spawn()
    .insert(Car::default())
    .insert(Player)
    .insert_bundle(
        SpriteBundle {
            texture: vehicle_tex_01,
            ..Default::default()
        }
    );

    let input_config = get_input_config_json();

    commands.insert_resource(input_config);
}

fn get_input_config_json() -> InputDeviceType {
    let file_path = String::from("./assets/text_data/input_config.json");
    let read_file_result = parse_json_file::<InputDeviceType>(&file_path);

    if read_file_result.is_some() {
        return read_file_result.unwrap();
    }

    return InputDeviceType {devices: Vec::new() };
}