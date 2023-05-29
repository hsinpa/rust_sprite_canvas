import { Dictionary } from "typescript-collections";

export enum ActionEnum {
    Shooter, LeftFlipper, RightFlipper, Pause
}

export const InputEventTitle = Object.freeze({
    up : "up",
    down : "down",
    left: "left",
    right : "right",

    z: "z",
    l_slash: "/",
});

export let ActionMapTable :  {[key: string]: ActionEnum} = Object.create({
    "z" : ActionEnum.LeftFlipper,
    "/" : ActionEnum.RightFlipper,
    " " : ActionEnum.Shooter,
    "escape" : ActionEnum.Pause,
});

export const KeycodeLookupTable = Object.create({
    w : InputEventTitle.up,
    s : InputEventTitle.down,
    d : InputEventTitle.right,
    a : InputEventTitle.left,
    ArrowUp : InputEventTitle.up,
    ArrowDown : InputEventTitle.down,
    ArrowRight : InputEventTitle.right,
    ArrowLeft : InputEventTitle.left,
});
