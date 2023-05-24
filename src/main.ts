import { PinballManager } from './pinball/PinballManager';
import './stylesheet/style.scss';

async function api_call() {
    let response = fetch("https://kszz4tdgrd.execute-api.ap-southeast-2.amazonaws.com/test",
    {
        method: "GET"
    }).then(x => {
        return x.json();
    }).then(x => {
        console.log(x);
    });
}

window.addEventListener("load", function(event) {
    let pinball = new PinballManager("#pixi_dom");
    //api_call();
});
