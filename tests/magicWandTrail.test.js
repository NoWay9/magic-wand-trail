import { describe, it, expect, beforeEach, vi } from "vitest";
import { Particle } from "../src/magicWandTrail";

describe("Particle Class", () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    }));

    vi.stubGlobal("requestAnimationFrame", vi.fn());
  });

  it("should decrease opacity on update", () => {
    const p = new Particle(100, 100, 1, 1, { fadeSpeed: 0.02, emoji: "✨" });
    const initialOpacity = p.opacity;

    p.update();

    expect(p.opacity).toBeLessThan(initialOpacity);
  });

  it("should handle array of emojis", () => {
    const emojis = ["A", "B"];
    const p = new Particle(0, 0, 0, 0, { emoji: emojis });
    expect(emojis).toContain(p.emoji);
  });
});
