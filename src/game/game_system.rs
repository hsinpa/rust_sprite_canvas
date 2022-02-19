use bevy::ecs::query::QueryIter;
use bevy::math::Quat;
use bevy::prelude::{Camera, Mut, Query, ResMut, Transform, GlobalTransform, Without};
use num_traits::{abs, clamp};
use crate::utility::static_string::VEHICLE_VELOCITY_MAX;
use crate::utility::types::{Car, InputStruct, Player};
use crate::{Vec3};

pub fn process_car_physics_system(
    input_res: ResMut<InputStruct>,
    mut query: Query<(&mut Car)>
) {
    let friction = 0.95;

    for mut car in query.iter_mut() {
        let forward_str = input_res.move_forward - input_res.move_backward;
        let rotation_str = input_res.move_right - input_res.move_left;

        car.acceleration.y = (forward_str);
        car.velocity.x = rotation_str;

        let mut new_velocity = (car.velocity.y * friction)+ car.acceleration.y;
        new_velocity = clamp(new_velocity, -VEHICLE_VELOCITY_MAX, VEHICLE_VELOCITY_MAX);

        car.velocity.y = new_velocity;
    }
}

pub fn process_car_movement_system(
    mut query: Query<(&mut Car, &mut Transform)>
) {

    for (mut p_car, mut p_transform) in query.iter_mut() {
        let mut car : Mut<'_, Car> = p_car;
        let mut transform : Mut<'_, Transform> = p_transform;

        let forward = transform.up();
        let engine_power = abs(car.velocity.y) / VEHICLE_VELOCITY_MAX;
        let angle = car.angle - (car.velocity.x * 0.05 * engine_power);
        let rotate_quat = Quat::from_rotation_z(angle);

        transform.translation += forward * car.velocity.y;
        transform.rotation = rotate_quat;
        car.angle = angle;
    }
}

pub fn process_camera_movement_system(
    mut player_query: Query<(&Player, &GlobalTransform), Without<Camera>>,
    mut camera_query: Query<(&Camera, &mut Transform), Without<Player>>,
) {

    let (p_camera, mut camera_transform) = camera_query.single_mut();
    let mut camera_position = Vec3::new(0.0, 0.0, 0.0);
    let mut player_length = 0;

    for (p_player, p_transform) in player_query.iter() {
        let mut player_transform :&GlobalTransform = p_transform;
        camera_position += player_transform.translation;
        player_length += 1;
    }

    camera_position.x = camera_position.x / (player_length as f32);
    camera_position.y = camera_position.y /(player_length as f32);
    camera_position.z = 0.0;

    camera_transform.translation = camera_position;
}