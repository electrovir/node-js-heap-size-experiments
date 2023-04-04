import {log} from '@augment-vir/node-js';
import express from 'express';
import cluster from 'express-cluster';
import {cpus} from 'os';
import {maxHeapGB} from '../helpers/heap';
import {useTonsOfMemory} from '../helpers/use-memory';

const workerCount = cpus().length - 1;

cluster(
    (worker) => {
        const app = express();
        const port = process.env.PORT || 3000;

        app.use(({protocol, path}) => {
            console.info(`worker ${worker.id}`);
        });

        app.get('/non-blocking/', (req, res) => {
            res.status(200).send(`This page is non-blocking. Worker id: ${worker.id}`);
        });

        app.get('/blocking', async (req, res) => {
            let counter = 0;
            for (let i = 0; i < 20_000_000_000; i++) {
                counter++;
            }
            res.status(200).send(`result is ${counter}. Worker id: ${worker.id}`);
        });

        app.get('/heap-crash', async (req, res) => {
            log.info(`max heap: ${maxHeapGB.toFixed(2)} GB`);
            await useTonsOfMemory(maxHeapGB + 1);
            res.status(200).send(`failed to crash`);
        });

        return app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    },
    {
        count: workerCount,
        verbose: true,
    },
);
