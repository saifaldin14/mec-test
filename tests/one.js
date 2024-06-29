import mec, { assert } from "mec-test";

mec({
  one: () => {
    const a = 1;
    assert.strictEqual(a, 1, "a is 1");
  },
});
