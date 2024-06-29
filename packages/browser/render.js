import * as Eta from "eta";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Get file path references
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure ETA template engine
Eta.configure({
  views: path.join(__dirname, "views"),
});

const template = "<%~ includeFile('./index.eta', it) %>";

/**
 * Render layout using Eta templates.
 *
 * @param {Object[]} testFiles - List of test files to include.
 * @returns {string} Rendered HTML layout.
 */
export default function render(testFiles) {
  return Eta.render(template, {
    message: "Open browser console for test results...",
    testFiles: testFiles,
  });
}