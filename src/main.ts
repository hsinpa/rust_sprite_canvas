import { PinballManager } from './pinball/PinballManager';
import './stylesheet/style.scss';


window.addEventListener("load", function(event) {

    let worker = new Worker(
        new URL('./worker.ts', import.meta.url), {type: 'module'}
    );

    worker.onmessage = (msg) => {
        console.log('message received from worker', msg.data);
    };
    
    worker.postMessage('message sent to worker');

    let pinball = new PinballManager("#pixi_dom");
});