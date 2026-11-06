import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

// Reset DOM and localStorage between tests so state never leaks.
afterEach(() => {
  cleanup();
  localStorage.clear();
});