import {fork} from 'child_process';
import {join} from 'path';
import {srcDirPath} from '../helpers/file-paths';

const useAllHeapFilePath = join(srcDirPath, 'entry-scripts', 'use-all-heap.ts');

const child = fork(useAllHeapFilePath, {
    detached: true,
});

child.on('message', (event) => {
    console.log({eventInParent: event});
});

setInterval(() => {
    console.log('sending...');
    child.send('message from parent');
}, 1000);

child.on('exit', () => {
    console.log('child exited');
    process.exit(0);
});
