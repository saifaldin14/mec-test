import { Worker } from "node:worker_threads";
import { MecStatus } from "../util/env.js";
import makeDebug from "debug";

// Debug logger
const debug = makeDebug("NodeExecutor");

/**
 * Node.js test executor using worker threads
 */
export default class NodeExecutor {
  /**
   * Create executor instance.
   *
   * @param {string[]} targets - Test targets.
   */
  constructor(targets) {
    this.targets = targets;
    debug("NodeExecutor targets:", targets);
  }

  /**
   * Execute tests.
   *
   * @returns {Promise<Object>} Test result status.
   */
  async execute() {
    let testSuites = this.targets.length;
    let testFailed = false;
    console.log("Testing in Node.js", process.version);

    return new Promise((resolve) => {
      const workers = [];

      this.targets.forEach((target) => {
        // Create a new worker
        const worker = new Worker("./" + target);

        // Listen for messages and wrap console
        worker.on("message", (message) => {
          if (message === MecStatus.Fail) testFailed = true;

          // If a status is recovered, update the number of test suites
          if (message === MecStatus.Pass || message === MecStatus.Fail)
            testSuites--;
        });

        workers.push(worker);
      });

      // Wait for all workers to finish
      Promise.all(
        workers.map((w) => new Promise((res) => w.once("exit", res)))
      ).then(() => {
        if (testSuites === 0) {
          const status = MecStatus.Fail ? testFailed : MecStatus.Pass;
          return resolve({
            status,
          });
        }
      });
    });
  }
}
