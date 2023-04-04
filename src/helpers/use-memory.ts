import {AnyFunction, extractErrorMessage} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {createBigArray, pushIntoBigArray} from '../augments/big-array';
import {getCurrentHeapUsageMB} from './heap';

const stuff: Record<any, AnyFunction> = {
    doThing(...args: any[]) {
        console.log(...args);
    },
};

export function useTonsOfMemory(amountGB: number) {
    const amountMB = amountGB * 1024;

    const filledUpArray = createBigArray<number>();
    let i = 0;
    const startTime = Date.now();
    const startUsageGB = getCurrentHeapUsageMB();

    while (getCurrentHeapUsageMB() - startUsageGB < amountMB) {
        try {
            pushIntoBigArray(filledUpArray, i);
            i++;
        } catch (error) {
            log.error(`caught error: ${extractErrorMessage(error)}`);
        }
    }
    const endTime = Date.now();
    const endUsage = getCurrentHeapUsageMB();
    console.log(`ended at ${i}`);

    // use the array so we make sure it doesn't accidentally get garbage collected
    for (let i = 0; i < filledUpArray.length; i++) {
        const entry = filledUpArray[i]?.[i];
        try {
            stuff[process.argv[0] as any]!(entry);
        } catch (error) {
            break;
        }
    }

    const diffUsage = endUsage - startUsageGB;
    const diffTime = endTime - startTime;

    return {memory: diffUsage, time: diffTime};
}
