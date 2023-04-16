use crate::utility::types;
use std::{fs, io};
use bevy::reflect::GetPath;
use serde::de::DeserializeOwned;
use types::{FileStruct, FileType};

pub fn parse_json_file<T: DeserializeOwned>(file_path : &String) -> Option<T> {
    let file_result = read_file(file_path);

    if file_result.is_ok() {
        let p: T = serde_json::from_str(&file_result.unwrap()).ok()?;
        return Some(p);
    }

    None
}

pub fn read_file(file_path : &String) -> io::Result<String> {
    return fs::read_to_string(file_path);
        // .expect("Something went wrong reading the file");
}

pub fn read_directory(directory_path : &String ) -> Vec<FileStruct>{
    let dir_r = fs::read_dir(directory_path);
    let mut files: Vec<FileStruct> = Vec::new();

    if dir_r.is_ok() {
        let dir = dir_r.unwrap();
        for text in dir {
            let file = text.unwrap();
            let file_name = file.file_name().into_string().unwrap();
            let path = file.path().display().to_string();
            let is_dir = file.file_type().unwrap().is_dir();

            let parts : Vec<&str> = file_name.split(".").collect();
            let file_type = parts[parts.len() - 1].to_lowercase();

            //Filter out, files which is not image or directory
            if !is_dir && file_type != "png" && file_type != "jpg" && file_type != "jpeg" { continue; }

            let file = FileStruct {
                name: file_name,
                path: path,
                file_type: if is_dir { FileType::Directory } else { FileType::Image } };

            files.push(file);
        }
    }

    files
}
