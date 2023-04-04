import {basename} from 'path';
import {parentPort} from 'worker_threads';

if (!parentPort) {
    throw new Error(`No parentPort found in ${basename(__filename)}`);
}

let counter = 0;
for (let i = 0; i < 20_000_000_000; i++) {
    counter++;
}

parentPort.postMessage(counter);
