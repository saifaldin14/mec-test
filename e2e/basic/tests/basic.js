import mc, { assert } from "mec-test";
import { helloReader } from "../basic.js";

mc({
  basic: () => {
    assert.strictEqual(helloReader(), "Hello reader!", "output is correct");
  },
});