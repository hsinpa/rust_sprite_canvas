use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct InputDeviceType {
    pub devices : Vec<InputJSONType>,
}

#[derive(Serialize, Deserialize)]
pub struct InputJSONType {
    pub types : InputDevice,
    pub actions: Vec<ActionJSONType>
}

#[derive(Serialize, Deserialize)]
pub struct ActionJSONType {
    pub front: Vec<String>,
    pub backward: Vec<String>,
    pub left : Vec<String>,
    pub right: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub enum InputDevice {
    Keyborad = 0,
    Gamepad = 1,
}