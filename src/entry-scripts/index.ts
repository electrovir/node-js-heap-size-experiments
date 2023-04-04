import express from 'express';
import {join} from 'path';
import {Worker} from 'worker_threads';
import {srcDirPath} from '../helpers/file-paths';

const app = express();
const port = process.env.PORT || 3000;

const workerPath = join(srcDirPath, 'entry-scripts', 'worker.ts');

app.get('/non-blocking/', (req, res) => {
    res.status(200).send('This page is non-blocking');
});

app.get('/blocking', async (req, res) => {
    const worker = new Worker(workerPath, {
        execArgv: [
            '--require',
            'ts-node/register',
        ],
    });
    worker.on('message', (payload) => {
        res.status(200).send(`result is ${payload}`);
    });
    worker.on('error', (errorMessage) => {
        console.error(errorMessage);
        res.status(500).send(`internal error`);
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
