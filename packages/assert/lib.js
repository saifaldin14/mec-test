import { isBrowser } from "../util/env.js";

let chai;

// Initialize Chai based on environment
if (isBrowser()) {
  chai = window.chai;
} else {
  chai = await import("chai");
}

// Chai interfaces
export const expect = chai.expect;
export const assert = chai.assert;
export const should = chai.should;
