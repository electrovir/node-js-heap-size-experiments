# node-js-heap-size-experiments

## Findings

### Heap

1. Node.js won't let me `.push()` more than `112_813_858` number elements into an array even with the following conditions:
    1. the spec says the max is `4_294_967_295`
    2. my max heap size is ~8GB
    3. the heap usage of adding `112_813_858` elements is only ~2GB
2. Pushing `112_813_858` numbers into an empty array is very fast (<1s)
3. Pushing `112_813_858` arrays of number `myArray.push([myNumber])` is much slower (~10 seconds)
4. If I try pushing into an array beyond `112_813_858` items, the thrown error may vary
    1. Simply pushing into an array in a loop: `Fatal JavaScript invalid size error 169220804`, this error cannot be caught
    2. If I log something to the console right before the last push: `RangeError: Invalid array length`, which can be caught
5. Using `v8.getHeapStatistics().used_heap_size` in a loop to check how much memory has been used dramatically increases the time it takes to fill the array (10x)
6. Using a fixed number per GB to estimate how many loop iterations are needed to reach a specific heap space usage doesn't work because it's very inconsistent.
7. On my machine, setting `max_old_space_size` to 1 GB (1204), is exceeded by `useTonsOfMemory` in ~16 seconds.

### Express

1. CPU intense requests will block all other requests
2. This can be mitigated by creating workers for CPU intense tasks.
3. [express-cluster](https://www.npmjs.com/package/express-cluster) will automatically spawn multiple workers for handling requests

## Scripts

### Heap

-   set a low heap max size and max it out (triggering a `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory` error):
    ```bash
    node --max_old_space_size=1024 -r ts-node/register/transpile-only src/entry-scripts/use-all-heap.ts
    ```

### Express

Only run one of these scripts at a time, or provide a port number like so: `PORT=3001 ts-node src/entry-scripts...`. After each script is run, navigate to [localhost:3000/non-blocking](http://localhost:3000/non-blocking) (or use the port you provided). Notice that it loads instantly. Then open a new tab to [localhost:3000/blocking](http://localhost:3000/blocking). Notice that `/blocking` takes a while. If you run the blocking script, it will also block the _other_ `/non-blocking` tabs from loading (if you refresh them).

-   run the basic express server with blocking requests:
    ```bash
    ts-node src/entry-scripts/index-blocking.ts
    ```
-   run an express server with a worker handling the CPU intense requests:
    ```bash
    ts-node src/entry-scripts/index.ts
    ```
-   run an express server that uses `express-cluster`:
    ```bash
    ts-node src/entry-scripts/index-blocking.ts
    ```
