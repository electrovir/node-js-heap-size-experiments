export const maxArrayLength = 112_813_858;

export function createBigArray<T>(): T[][] {
    return [];
}

export function pushIntoBigArray<T>(bigArray: T[][], newEntry: T): T[][] {
    const foundIndex = bigArray.findIndex((innerArray) => {
        return innerArray.length < maxArrayLength;
    });

    const indexToPush = foundIndex === -1 ? bigArray.length : foundIndex;

    if (!bigArray[indexToPush]) {
        bigArray[indexToPush] = [];
    }

    bigArray[indexToPush]!.push(newEntry);

    return [];
}
