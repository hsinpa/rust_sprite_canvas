use bevy::prelude::TextBundle;
use bevy::text::TextStyle;
use bevy::utils::default;
use crate::utility::types::TextStruct;

pub struct UIUtility;

impl UIUtility {
    pub fn create_button() {

    }

    pub fn create_text(config: &TextStruct) -> TextBundle {

        let mut text_style = TextStyle{
            font_size: config.font_size,
            font: config.font.clone_weak(),
            color: config.color,
            ..default()
        };

        let text_bundle =  TextBundle::from_section(
            config.body.clone(),
            text_style
        ).with_text_alignment(config.alignment);

        return text_bundle;
    }
}