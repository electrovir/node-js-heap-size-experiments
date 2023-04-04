import * as v8 from 'node:v8';

// returns heap max in MB
function getHeapMaxMB() {
    return v8.getHeapStatistics().heap_size_limit / 1024 / 1024;
}

export const maxHeapGB = getHeapMaxMB() / 1024;

// returns heap usage in MB
export function getCurrentHeapUsageMB() {
    return v8.getHeapStatistics().used_heap_size / 1024 / 1024;
}
