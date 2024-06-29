import http from "node:http";
import fs from "node:fs";
import path, { dirname } from "node:path";
import render from "./render.js";

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// select a random port
const port = 0;

/**
 * Mec CLI test server using Node.js HTTP server.
 */
export default class CliServer {
  /**
   * Create CLI server instance.
   *
   * @param {string[]} testFiles - Test files to serve.
   */
  constructor(testFiles) {
    /**
     * HTML to serve for the test runner.
     * @type {string}
     */
    this.html = render(testFiles);

    const server = http.createServer((req, res) => {
      // Get the requested URL
      const url = req.url;
      res.statusCode = 200;

      // Set the content type header
      res.setHeader("Content-Type", "application/javascript; charset=utf-8");

      let response;

      // Handle different URLs
      switch (url) {
        // Test runner
        case "/":
          // Set the content type header for HTML
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          response = this.html;
          break;

        // Chai assertion library
        case "/chai.js":
          response = fs.readFileSync(
            path.join(
              __dirname,
              "..",
              "..",
              "node_modules",
              "chai",
              "chai.js"
            )
          );
          break;

        // Sinon mocking library
        case "/sinon.js":
          response = fs.readFileSync(
            path.join(
              __dirname,
              "..",
              "..",
              "node_modules",
              "pkg",
              "sinon-esm.js"
            )
          );
          break;

        // Favicon logic
        case "/favicon.ico":
          res.statusCode = 204;
          return res.end();

        // Framework packages
        default:
          let fsLoad = path.join(__dirname, "..", "..", "packages", url);

          // Handle test files
          if (url.startsWith("/__tests/")) {
            fsLoad = path.join(url.split("/__tests/")[1]);
          }

          response = fs.readFileSync(fsLoad);
      }

      // Write and end the response
      res.write(response);
      res.end();
    });

    /**
     * Node.js HTTP server.
     * @type {http.Server}
     */
    this.server = server;
  }

  /**
   * Start listening for HTTP requests.
   *
   * @returns {Object} Server address object.
   * @property {number} port - The port the server is listening on.
   * @property {http.Server} server - The Node.js HTTP server.
   */
  async listen() {
    await this.server.listen(port);
    console.log(this.server.address());

    // Return an object containing the port and the server instance.
    return {
      port: this.server.address().port,
      server: this.server
    };
  }
  /**
   * Close the server.
   *
   * @returns {Promise<void>} A promise that resolves when the server is closed.
   */
  async close() {
    // Close the server by calling the `close` method on the underlying HTTP server.
    // This method returns a promise that resolves when the server is closed.
    await this.server.close();
  }
}