/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
const host = NODE_ENV === "development"
  // @ts-ignore
  ? `${location.hostname}:${PORT || 6971}`
  : location.host
