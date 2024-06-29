export const Environments = {
  Node: "node",
  Browser: "browser"
};

/**
 * Utility function to check if the environment is a browser
 *
 * @returns {boolean} If the environment is a browser
 */
export const MecStatus = {
  Fail: "MEC FAIL",
  Pass: "MEC PASS",
};

export const isBrowser = () => typeof window !== "undefined";

/**
 * Utility function to check if the environment is a browser
 *
 * @returns {boolean} If the environment is a browser
 */
export const getExitStatus = (result) => result.status === MecStatus.Fail ? 1 : 0;

