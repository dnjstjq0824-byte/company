import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, resetRateLimit } from "../src/lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests up to the limit, then blocks", () => {
    const key = `test-basic-${Date.now()}`;
    const first = checkRateLimit(key, 2, 60_000);
    assert.equal(first.allowed, true);
    assert.equal(first.remaining, 1);

    const second = checkRateLimit(key, 2, 60_000);
    assert.equal(second.allowed, true);
    assert.equal(second.remaining, 0);

    const third = checkRateLimit(key, 2, 60_000);
    assert.equal(third.allowed, false);
    assert.equal(third.remaining, 0);
    assert.ok(third.retryAfterSeconds > 0);
  });

  it("tracks keys independently", () => {
    const stamp = Date.now();
    checkRateLimit(`test-iso-a-${stamp}`, 1, 60_000);
    const other = checkRateLimit(`test-iso-b-${stamp}`, 1, 60_000);
    assert.equal(other.allowed, true);
  });

  it("resetRateLimit clears the counter", () => {
    const key = `test-reset-${Date.now()}`;
    checkRateLimit(key, 1, 60_000);
    assert.equal(checkRateLimit(key, 1, 60_000).allowed, false);
    resetRateLimit(key);
    assert.equal(checkRateLimit(key, 1, 60_000).allowed, true);
  });

  it("re-allows after the window expires", async () => {
    const key = `test-expiry-${Date.now()}`;
    assert.equal(checkRateLimit(key, 1, 5).allowed, true);
    assert.equal(checkRateLimit(key, 1, 5).allowed, false);
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(checkRateLimit(key, 1, 5).allowed, true);
  });
});
