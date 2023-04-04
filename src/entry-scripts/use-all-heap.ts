import {log} from '@augment-vir/node-js';
import * as v8 from 'node:v8';
import {basename} from 'path';
import {maxHeapGB} from '../helpers/heap';
import {useTonsOfMemory} from '../helpers/use-memory';

process.on('message', (payload) => {
    console.log({eventInChild: payload});
});

const fileName = basename(__filename);

async function useAllHeap() {
    log.faint(`running '${fileName}'`);
    console.info(process.memoryUsage());
    console.info(v8.getHeapStatistics());
    log.info(`max heap: ${maxHeapGB.toFixed(2)}GB`);
    const usage = await useTonsOfMemory(maxHeapGB + 1);
    log.info(`Used ${(usage.memory / 1024).toFixed(2)} GB`);
    log.info(`Took ${(usage.time / 1000).toFixed(2)} seconds`);
}

useAllHeap();
