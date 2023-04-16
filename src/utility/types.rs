use bevy::prelude::{Component, States};

#[derive(Component)]
pub struct FileStruct {
    pub name: String,
    pub path: String,
    pub file_type: FileType,
}

pub enum FileType {Image, Directory}

#[derive(States, Debug, Clone, Copy, Eq, PartialEq, Hash, Default)]
pub enum AppState {
    #[default]
    Menu,
    Game,
}