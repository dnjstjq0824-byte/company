import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Layers } from "lucide-react";
import { getDivisionIcon } from "../src/lib/division-icons";

describe("getDivisionIcon", () => {
  it("resolves every selectable admin icon", () => {
    const names = [
      "Boxes",
      "Cloud",
      "Cpu",
      "Globe",
      "Layers",
      "Leaf",
      "Network",
      "Server",
      "ShieldCheck",
      "Sparkles",
    ];
    for (const name of names) {
      assert.ok(getDivisionIcon(name), `no icon for ${name}`);
    }
  });

  it("falls back to Layers for unknown names", () => {
    assert.equal(getDivisionIcon("Nope"), Layers);
    assert.equal(getDivisionIcon(""), Layers);
  });
});
