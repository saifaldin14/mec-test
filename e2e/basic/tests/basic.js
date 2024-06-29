import mec, { assert } from "mec-test";
import { helloReader } from "../basic.js";

mec({
  basic: () => {
    assert.strictEqual(helloReader(), "Hello reader!", "output is correct");
  },
});
