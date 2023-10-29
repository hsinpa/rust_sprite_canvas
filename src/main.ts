import { PinballManager } from './pinball/PinballManager';
import {ExecWorkerSetup, ExecBufferWorkerSetup} from './worker_demo/worker_parent_classic';
import './stylesheet/style.scss';

window.addEventListener("load", function(event) {
    //let pinball = new PinballManager("#pixi_dom");
    //ExecWorkerSetup();
    ExecBufferWorkerSetup();
});
