use bevy::prelude::{Color, Component, States, Handle};
use bevy::text::{Font, TextAlignment};
use std::string::String;

#[derive(Component)]
pub struct FileStruct {
    pub name: String,
    pub path: String,
    pub file_type: FileType,
}
pub struct TextStruct {
    pub body: String,
    pub font_size: f32,
    pub font: Handle<Font>,
    pub color: Color,
    pub alignment: TextAlignment,
}

impl Default for TextStruct {
    fn default() -> TextStruct {
        TextStruct {
            body: String::from(""),
            font_size: 12.0,
            font: Handle::default(),
            color: Color::BLACK,
            alignment: TextAlignment::Left,
        }
    }
}



pub enum FileType {Image, Directory}

#[derive(States, Debug, Clone, Copy, Eq, PartialEq, Hash, Default)]
pub enum AppState {
    #[default]
    Menu,
    Game,
}