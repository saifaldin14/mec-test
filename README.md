# Meč Test - JavaScript testing framework

> Meč Test (mec-test) is a simple JavaScript testing full-stack framework, specifically it is designed to be used directly for Meč-based projects
 
## Features

* Runs tests in node.js and in the browser.
* Supports assertions with library-related configuration
* Developed test execution in browser and CLI environments 
* Mocking and E2E testing support

### Public API

Here's an example of available APIs for this framework:

```js
// include the framework
import mec, { assert } from "mec-test";

// create test suites
mec({
  // set the title
  describe: "Unit test suite two",
    
  // before functions  
  before: () => {
    console.log("called before");
  },
  beforeEach: () => {
    console.log("called beforeEach");
  },
  "your test": async function () {
    // add logic relevant to your components here  
    assert.equal(2, 2, "2 is 2");
  },
  
  // after methods  
  afterEach: () => {
    console.log("called afterEach");
  },
  after: () => {
    console.log("called after");
  },
});

```

## Release History

See the [CHANGELOG](CHANGELOG.md).

## License

[MIT](LICENSE)
