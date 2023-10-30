import Subworker from "./subworker";


export const ExecWorkerSetup = function() {
    let worker = new Worker(
        new URL('./worker.ts', import.meta.url),
                {type: 'module', name:"classic_worker"}
    );

    worker.onmessage = (x: MessageEvent<any>) => {
        console.log(x.data)
    }

    worker.postMessage({"object-name" : "hellow"});
}


interface DataInterface {
    count: number;
    
    int_array: Int8Array, //1 byte
    float_array: Float32Array //4 byte
}

export const ExecBufferWorkerSetup = function() {
    let worker = new Worker(
        new URL('./worker_buffer.ts', import.meta.url), 
        {type: 'module', name:"classic_worker"}
    );

    let count = 20;
    let data_struct : DataInterface = {
        count : count,
        int_array: new Int8Array(count),
        float_array: new Float32Array(count),
    }

    data_struct.int_array[0] = 5;
    data_struct.float_array[0] = 10.55;

    worker.onmessage = (x: MessageEvent<any>) => {
        console.log(x.data)
    }

    //Transferable[] Sequence don't matter
    worker.postMessage(data_struct, 
        [   data_struct.float_array.buffer, 
            data_struct.int_array.buffer
        ]);

    //worker.postMessage(data_struct, [data_struct.int_array.buffer, data_struct.float_array.buffer]);
}

export const ExecShareBufferWorkerSetup = function() {
    let worker = new Worker(
        new URL('./worker_buffer.ts', import.meta.url), {type: 'module'}
    );

    let count = 20;
    let shareArrayBuffer = new SharedArrayBuffer(count * Float32Array.BYTES_PER_ELEMENT); //4 bytes
    let float_array = new Float32Array(shareArrayBuffer);
    let manual_lock = false;

    //Unlock when result is return
    worker.onmessage = (x: MessageEvent<any>) => {
        manual_lock = false;
    }
    
    //Run per frame
    function next_frame_step() {
        //IF IS save to access data
        if (!manual_lock) {
            for (let i = 0; i < count; i++) {
                //DO SOMETHING here
                let single_f = float_array[i];
            }
            
            //Lock data and send to worker
            manual_lock = true;
            worker.postMessage({id : "NEXT_JOB"});
        }

        window.requestAnimationFrame(next_frame_step);
    }

    window.requestAnimationFrame(next_frame_step);
}

export const ExecMultiThreadBufferWorkerSetup = function() {

    let task_count = 1024;
    let worker_count = 4;
    let task_segment = task_count / worker_count;

    let shareArrayBuffer : SharedArrayBuffer = new SharedArrayBuffer(task_count * Float32Array.BYTES_PER_ELEMENT); //4 bytes
    let float_array = new Float32Array(shareArrayBuffer);
    let manual_lock = false;

    let workers : Subworker[] = [];
    for (let i = 0; i < worker_count; i++) {
        let from_index = i * task_segment;
        let end_index = ((i + 1) * task_segment) - 1;
        workers.push(new Subworker(float_array, from_index, end_index));
    }

    async function process_thread_task() {
        //If its still processing the last request
        if (manual_lock) return;

        let promise_array = workers.map(x=> x.process());
        manual_lock = true;
        
        await Promise.all(promise_array);

        //Update data

        manual_lock = false;
    }
    
    function next_frame_step() {
        process_thread_task();
        window.requestAnimationFrame(next_frame_step);
    }

    window.requestAnimationFrame(next_frame_step);
}