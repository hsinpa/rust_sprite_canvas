use bevy::app::{App, Plugin};
use bevy::prelude::{AssetServer, Commands, Handle, Image, Res, Transform, Camera2dBundle};
use bevy::sprite::{Sprite, SpriteBundle};
use crate::utility::utility_func::{read_directory};

pub struct GamePlugin;

impl Plugin for GamePlugin {
    fn build(&self, app: &mut App) {
        app.add_startup_system(setup);
        app.add_startup_system(load_preview);
    }
}

fn setup(mut commands : Commands) {
    commands.spawn(Camera2dBundle::default());

    let dir_list = read_directory(&String::from("assets"));

    println!("Setup Target Count {}.", dir_list.len());
}

fn load_preview(mut commands : Commands, server: Res<AssetServer>) {
    let image_handle: Handle<Image> = server.load("GalardB.png");

    commands.spawn(SpriteBundle {
        texture: image_handle,
        ..Default::default()
    });
}