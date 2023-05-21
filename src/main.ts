import { PinballManager } from './pinball/PinballManager';
import './stylesheet/style.scss';

window.addEventListener("load", function(event) {
    let pinball = new PinballManager("#pixi_dom");
});