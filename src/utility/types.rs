use bevy::asset::Handle;
use bevy::ecs::component::{Component};
use bevy::math::Vec2;
use bevy::prelude::Image;
use bevy::transform::components::Transform;

#[derive(Component)]
pub struct NPC;

#[derive(Component)]
pub struct Player;

#[derive(Component)]
pub struct Car {
    pub velocity : Vec2,
    pub acceleration: Vec2,
    pub angle : f32,
}

impl Default for Car {
    fn default() -> Self {
        Self {
            velocity: Default::default(),
            acceleration: Default::default(),
            angle : 0.0,
        }
    }
}

pub struct InputStruct {
    pub mouse_position : Vec2,
    pub move_forward: f32,
    pub move_right: f32,
    pub move_left: f32,
    pub move_backward: f32,
}

impl Default for InputStruct {
    fn default() -> Self {
        Self {
            mouse_position: Default::default(),
            move_forward: Default::default(),
            move_right: Default::default(),
            move_left: Default::default(),
            move_backward: Default::default(),
        }
    }
}