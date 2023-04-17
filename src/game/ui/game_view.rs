use bevy::app::App;
use bevy::asset::AssetServer;
use bevy::hierarchy::BuildChildren;
use bevy::prelude::{ButtonBundle, ChildBuilder, Color, Commands, default, FlexDirection, NodeBundle, Plugin, Res, Text, TextBundle, TextStyle};
use bevy::ui::{AlignContent, AlignItems, FlexWrap, JustifyContent, Size, Style, Val};
use bevy::ui::AlignSelf::FlexStart;
use bevy::ui::FlexWrap::Wrap;
use crate::utility::static_string;
use crate::utility::types::TextStruct;
use crate::utility::UIUtility::UIUtility;

pub struct GameView;

impl GameView {

    fn build_holder_view(mut commands: Commands, asset_server: Res<AssetServer>) {
        let main_menu_entity = commands.spawn(
            NodeBundle {
                style: Style {
                    justify_content: JustifyContent::End,
                    align_items: AlignItems::Center,
                    size: Size::new(Val::Percent(100.0), Val::Percent(100.0)),
                    gap: Size::new(Val::Px(8.0), Val::Px(8.0)),
                    ..default()
                },
                ..default()
            }
        ).with_children(|parent: &mut ChildBuilder | {
            GameView::build_side_view(parent, &asset_server);
        });
    }

    fn build_side_view(parent: &mut ChildBuilder,  asset_server: &Res<AssetServer>) {
        let main_menu_entity = parent.spawn(
            NodeBundle {
                style: Style {
                    size: Size::new(Val::Px(250.0), Val::Percent(100.0)),
                    flex_direction: FlexDirection::Column,
                    gap: Size::new(Val::Px(10.0), Val::Px(10.0)),
                    ..default()
                },
                background_color: Color::GREEN.into(),
                ..default()
            }
        ).with_children(|side_view_parent: &mut ChildBuilder | {

            //Title Bar
            side_view_parent.spawn(NodeBundle{
                style: Style {
                    flex_grow: 0.0,
                    ..default()
                },
                ..default()
            }).with_children( |titlebar_parent: &mut ChildBuilder |{
                let title_text = TextStruct {
                    body: String::from("Options"),
                    font_size: 24.0,
                    font: asset_server.load(static_string::ROBOTO_REGULAR),
                    ..default()
                };
                titlebar_parent.spawn(
                    ButtonBundle {
                        style: Style {
                            size: Size::new(Val::Px(60.0), Val::Px(40.0)),
                            ..default()
                        },
                        background_color: Color::PINK.into(),
                        ..default()
                    }
                );


                titlebar_parent.spawn(UIUtility::create_text(&title_text));
            });

            //Option Panel
            side_view_parent.spawn(NodeBundle{
                style: Style {
                    flex_grow: 1.0,
                    flex_wrap: Wrap,
                    justify_content: JustifyContent::FlexStart,
                    align_content: AlignContent::FlexStart,
                    gap: Size::new(Val::Px(10.0), Val::Px(10.0)),
                    ..default()
                },
                ..default()
            }).with_children(|option_view_parent: &mut ChildBuilder | {
                for i in 0..6 {
                    GameView::build_button(option_view_parent);
                }
            });
        });
    }

    fn build_button(parent: &mut ChildBuilder) {
        parent.spawn(
            ButtonBundle {
                style: Style {
                    size: Size::new(Val::Px(100.0), Val::Px(100.0)),
                    ..default()
                },
                background_color: Color::BLUE.into(),
                ..default()
            }
        );
    }
}

impl Plugin for GameView {
    fn build(&self, app: &mut App) {
        app.add_startup_system(GameView::build_holder_view);

    }
}
