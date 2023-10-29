export default class Subworker {

    private _array: Float32Array;
    private _from_index: number;
    private _end_index: number;
    private _worker : Worker;

    constructor(array: Float32Array, from_index: number, end_index: number) {
        this._array = array;
        this._from_index = from_index;
        this._end_index = end_index;

        this._worker = new Worker(
            new URL('./worker_buffer.ts', import.meta.url), {type: 'module'}
        );
    }

    process() : Promise<void> {
        this._worker.postMessage({array: this._array, from_index: this._from_index, end_index: this._end_index});

        return new Promise((resolve, reject) => {
            this._worker.onmessage = (x: MessageEvent<any>) => {
                resolve();
            }
        });
    }
}