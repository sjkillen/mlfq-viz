/**
 * Function that are useful throughout the application
 */

import { Seq } from "immutable";

/**
 * Get an immutable copy of an instance
 * @param {any} target object to make immutable
 * @returns an immutable version of target without function
 * only includes own properties
 */
export function immutInstance(target) {
   if (typeof target === "object") {
      return Seq(target)
         .filter(v => typeof v !== "function")
         .map(immutInstance);
   }
   return target;
}