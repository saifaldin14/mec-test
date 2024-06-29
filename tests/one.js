import mc, { assert } from "mec-test";

mc({
  one: () => {
    const a = 1;
    assert.strictEqual(a, 1, "a is 1");
  },
});