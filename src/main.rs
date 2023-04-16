extern crate core;

mod utility;
mod game;
use bevy::prelude::*;
use crate::CursorIcon::Default;
use crate::utility::types;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)

        .add_state::<types::AppState::Menu>()
        .add_plugin(game::game_setup::GamePlugin)

        // .insert_resource(utility::types::InputStruct::default())

        // .add_system(utility::input::input_system::keyboard_input_system)
        // .add_system(game::game_system::process_car_physics_system)
        // .add_system(game::game_system::process_car_movement_system)
        //.add_system(game::game_system::process_camera_movement_system)
        .run();
}
