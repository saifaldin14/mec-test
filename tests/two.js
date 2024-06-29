import mec, { assert } from "mec-test";

mec({
  describe: "Unit test suite two",
  before: () => {
    console.log("called before");
  },
  beforeEach: () => {
    console.log("called beforeEach");
  },
  "two - basic test": async () => {
    assert.equal(2, 2, "1 is 1");
  },
  "two - another test": async () => {
    assert.equal(1, 1, "1 is 1");
  },
  afterEach: () => {
    console.log("called afterEach");
  },
  after: () => {
    console.log("called after");
  },
});
