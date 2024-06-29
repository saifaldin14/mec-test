import { assert, should, expect } from "../assert/lib.js";
import { spy, mock, stub, replace, fake, restore } from "../mock/lib.js";
import { MecStatus, getExitStatus, isBrowser } from "../util/env.js";

let Emit;
// Parent port for workers
let parentPort;

// Suite methods to filter
const INTERNAL_SUITE_METHODS = [
  "describe",
  "before",
  "beforeEach",
  "afterEach",
  "after",
];

// Get emitter based on environment
if (isBrowser()) {
  Emit = await import("../browser/emit.js");
} else {
  Emit = await import("../node/emit.js");
  let workerThreads = await import("node:worker_threads");
  parentPort = workerThreads.parentPort;
}

let testSuites = 0;
let totalTestsFailed = 0;
// Global emitter
let globalEmitter = new Emit.default();

// Handle test run completion
globalEmitter.on("suitesDone", (report) => {
  let result = MecStatus.Pass;

  if (report.totalTestsFailed > 0) {
    console.log(`${report.totalTestsFailed} test suite(s) failed`);
    result = MecStatus.Fail;
  }

  if (isBrowser()) {
    console.log(result);
  } else {
    if (parentPort) {
      parentPort.postMessage(result);
    } else {
      process.exit(getExitStatus(result));
    }
  }
});

/**
 * Mec test runner class
 */
class MecTest {
  /**
   * Constructor for the MecTest class.
   */
  constructor() {
    // Create an instance of the event emitter.
    this.emitter = new Emit.default();
    // Bind the 'test' method to the current instance.
    this.test = this.test.bind(this);

    /**
     * Handle test passing.
     *
     * @param {string} name - Name of the test.
     * @param {number} time - Time taken to run the test.
     */
    this.emitter.on("passed", (name, time) => {
      console.log("PASS:", name, time.toFixed(2), "ms");
    });

    /**
     * Handle test failure.
     *
     * @param {string} name - Name of the test.
     * @param {Error} e - The error that caused the test to fail.
     */
    this.emitter.on("failed", (name, e) => {
      console.log("FAIL:", name);
      if (isBrowser()) {
        console.warn(e.stack.toString());
      } else {
        console.warn(e);
      }
    });

    /**
     * Handle test completion.
     *
     * @param {Object} report - Report of the test run.
     * @property {number} failed - Number of tests that failed.
     * @property {number} total - Total number of tests executed.
     */
    this.emitter.on("done", (report) => {
      if (report.failed > 0) {
        console.log(`${report.failed} out of ${report.total} tests failed`);
      }
    });
  }

  /**
   * Main test function that accepts an object of unit tests.
   *
   * @param {{}} suiteObject - Object containing unit tests.
   */
  async test(suiteObject) {
    // Increment the number of test suites executed.
    testSuites++;
    let failed = 0;
    let start;
    let end;
    let errorOccurred = false;

    // Filter out internal suite methods and store the remaining tests.
    const tests = Object.keys(suiteObject)
      .filter((key) => !INTERNAL_SUITE_METHODS.includes(key))
      .reduce((obj, key) => {
        obj[key] = suiteObject[key];
        return obj;
      }, {});

    // Get the total number of tests.
    const testsTotal = Object.keys(tests).length;

    // Log the name of the test suite if it exists, otherwise log "Unnamed suite".
    if (suiteObject.hasOwnProperty("describe")) {
      console.log(`\nSUITE: ${suiteObject.describe}`);
    } else {
      console.log(`\nSUITE: Unnamed suite`);
    }

    // Execute the "before" hook if it exists.
    if (suiteObject.hasOwnProperty("before")) {
      await suiteObject.before();
    }

    // Iterate over each test in the suite.
    for (const [key, fn] of Object.entries(tests)) {
      try {
        start = performance.now();

        // Execute the "beforeEach" hook if it exists.
        if (suiteObject.hasOwnProperty("beforeEach")) {
          await suiteObject.beforeEach();
        }

        // Execute the test function.
        await fn();
      } catch (e) {
        // Emit the "failed" event if an error occurs.
        this.emitter.emit("failed", key, e);
        errorOccurred = true;
        failed++;
        totalTestsFailed++;
      } finally {
        // Execute the "afterEach" hook if it exists.
        if (suiteObject.hasOwnProperty("afterEach")) {
          suiteObject.afterEach();
        }

        end = performance.now();

        // Emit the "passed" event if no error occurred.
        if (!errorOccurred) {
          this.emitter.emit("passed", key, end - start);
        }

        errorOccurred = null;
      }
    }

    // Execute the "after" hook if it exists.
    if (INTERNAL_SUITE_METHODS.hasOwnProperty("after")) {
      INTERNAL_SUITE_METHODS.after();
    }

    // Emit the "done" event with the test report.
    this.emitter.emit("done", {
      total: testsTotal,
      failed: failed,
    });

    // Decrement the number of test suites executed and emit the "suitesDone" event if all suites have finished.
    testSuites--;
    if (testSuites === 0) {
      globalEmitter.emit("suitesDone", {
        totalTestsFailed: totalTestsFailed,
        totalTestsPassed: testsTotal - totalTestsFailed,
      });
    }
  }
}

const mc = new MecTest();

export default mc.test;
export { assert, should, expect, mock, fake, stub, spy, replace, restore };