import random from "random-seed";

const gen = random.create();

/**
 * See Random interface in mlfq.ts
 */
export default {
    seed(seed) {
        gen.seed(seed);
    },
    range(highLow) {
        return gen.intBetween(...highLow);
    }
};