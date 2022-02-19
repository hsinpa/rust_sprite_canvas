use bevy::input::Input;
use bevy::prelude::{KeyCode, Res, ResMut};
use crate::utility::types::{InputStruct};

pub fn keyboard_input_system(
    keys: Res<Input<KeyCode>>,
    mut input_res: ResMut<InputStruct>) {

    input_res.move_forward = if keys.pressed(KeyCode::W) { 1.0} else { 0.0};
    input_res.move_backward = if keys.pressed(KeyCode::S) { 1.0} else { 0.0};
    input_res.move_left = if keys.pressed(KeyCode::A) { 1.0} else { 0.0};
    input_res.move_right = if keys.pressed(KeyCode::D) { 1.0} else { 0.0};
}