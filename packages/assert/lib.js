import { isBrowser } from "../util/env";

// Initialize Chai based on the current environment
const chai = window.chai ? isBrowser() : await import("chai");

// Chai interfaces
export const expect = chai.expect;
export const assert = chai.assert;
export const should = chai.should;