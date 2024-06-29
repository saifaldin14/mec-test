import makeDebug from "debug";
const debug = makeDebug("runner");
import { glob } from "glob";
import { Environments as Environments, getExitStatus } from "../util/env.js";
import NodeExecutor from "../node/executor.js";
import BrowserExecutor from "../browser/executor.js";

/**
 * Execute the test runner given a directory of tests
 *
 * @param {string[]} targetDirectory - The directories containing the test files to run.
 * @param {string} environment - The environment in which to run the tests (either Node or Browser).
 * @param {object} options - Additional options for the executor.
 * @returns {Promise<void>}
 */
export default async function runner(targetDirectory = ["tests"], environment, options) {
  debug("Calling runner: ", targetDirectory, environment);

  // Currently we support one directory at a time
  const testFiles = await getTestFiles(targetDirectory[0]);
  if (testFiles.length === 0) {
    console.log("No tests found...");
    return process.exit(1);
  }

  // Create an executor based on the environment
  const executor = createExecutor(environment, testFiles, options);
  const result = await executor.execute();
  debug("result", result);

  // Determine the exit status based on the test result
  const status = getExitStatus(result);
  if (!result.keepAlive) {
    process.exit(status);
  }
}

/**
 * Retrieves the test files in the specified directory.
 *
 * @param {string} directory - The directory to search for test files.
 * @returns {Promise<string[]>} An array of file paths to the test files.
 */
async function getTestFiles(directory) {
  // Use the glob package to find all JavaScript files in the specified directory,
  // excluding files in the "node_modules" directory.
  const globResult = await glob(`${directory}/**/*.js`, { ignore: "node_modules/**" });

  // Return the array of file paths to the test files.
  return globResult;
}

/**
 * Create an executor based on the environment.
 *
 * @param {string} environment - The environment in which to run the tests (either Node or Browser).
 * @param {string[]} testFiles - The test files to execute.
 * @param {object} options - Additional options for the executor.
 * @returns {object} The executor object.
 */
function createExecutor(environment, testFiles, options) {
  // If the environment is Node, create a NodeExecutor object.
  // Otherwise, create a BrowserExecutor object.
  if (environment === Environments.Node) {
    return new NodeExecutor(testFiles, options);
  } else {
    return new BrowserExecutor(testFiles, options);
  }
}
