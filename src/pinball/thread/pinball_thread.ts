import { Config } from "../utility/pinball_static";


console.log("HI, I am call from Worker, I am happy as hell");

self.onmessage = (msg) => {
    console.log('message from main', msg.data);
    
    postMessage('message sent from worker');
};