import random from "random-seed";

const gen = random.create();

/**
 * See Random interface in mlfq.ts
 */
export default {
    __seed: "seed",
    /**
     * get the seed
     */
    getSeed() {
        return this.__seed;
    },
    /**
     * Refresh the seed
     */
    reseed() {
        this.seed(this.__seed);
    },
    seed(seed) {
        this.__seed = seed;
        gen.seed(seed);
    },
    range(highLow) {
        return gen.intBetween(...highLow);
    }
};