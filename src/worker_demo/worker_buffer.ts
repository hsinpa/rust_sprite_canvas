import { IntVector2 } from "../utility/UniversalType";

console.log("HI, I am call from Worker, I am happy as hell");

self.onmessage = (msg) => {
    console.log('message from main', msg.data);

    //Do something comlicate here

    //End

    postMessage('message sent from worker');
};