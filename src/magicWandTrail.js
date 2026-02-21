/**
 * @typedef {Object} WandTrailOptions
 * @property {string|string[]} [emoji] - Emoji(s) to use as particles
 * @property {number} [speed] - Movement speed multiplier
 * @property {number} [density] - Number of particles per move
 * @property {number} [fadeSpeed] - How fast particles vanish
 * @property {boolean} [respectMotionPrefs] - Wheter should respect prefers-reduced-motion user system preferences
 */
export default class MagicWandTrail {
  /** @type {Particle[]} */
  #particles = [];
  /** @type {HTMLCanvasElement} */
  #canvas;
  /** @type {CanvasRenderingContext2D} */
  #ctx;
  /** @type {WandTrailOptions} */
  #config;
  /** @type {AbortController} */
  #controller = new AbortController();
  /** @type {number} */
  #animationId;
  /** @type {Map<string, string>} */
  #emojiCache = new Map();
  /** @type {number} */
  #lastMouseX = 0;
  /** @type {number} */
  #lastMouseY = 0;
  #reducedMotionQuery;
  /**
   * Creates an instance of MagicWand.
   * @param {WandTrailOptions} [options={}] - Configuration for the wand effects.
   */
  constructor(options = {}) {
    this.#reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    this.respectMotionPrefs = options.respectMotionPrefs ?? true;

    this.#config = {
      emoji: options.emoji ?? "✨",
      density: options.density ?? 1,
      fadeSpeed: options.fadeSpeed ?? 0.02,
      speed: options.speed ?? 5,
    };

    this.#setupCanvas();
    this.#init();
  }

  /** @private */
  #setupCanvas() {
    this.#canvas = document.createElement("canvas");
    this.#ctx = this.#canvas.getContext("2d");

    Object.assign(this.#canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "9999",
      background: "transparent",
    });

    document.body.appendChild(this.#canvas);
  }

  /** @private */
  #init() {
    if (this.respectMotionPrefs && this.#reducedMotionQuery.matches) {
      console.info(
        "MagicWandTrail: Motion disabled due to user system preferences.",
      );
      return;
    }

    this.#resize();
    const { signal } = this.#controller;

    window.addEventListener("resize", () => this.#resize(), { signal });

    let distanceBuffer = 0;
    /** @param {TouchEvent | MouseEvent} e*/
    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;

      const vx = x - this.#lastMouseX;
      const vy = y - this.#lastMouseY;
      const moveDistance = Math.hypot(vx, vy);

      distanceBuffer += moveDistance;

      const spacing = 15 / this.#config.density;

      if (distanceBuffer >= spacing) {
        const count = Math.floor(distanceBuffer / spacing);

        for (let i = 0; i < count; i++) {
          this.#addParticles(x, y, vx, vy);
        }

        distanceBuffer %= spacing;
      }

      this.#lastMouseX = x;
      this.#lastMouseY = y;
    };

    window.addEventListener("mousemove", onMove, { signal });
    window.addEventListener("touchmove", onMove, { passive: true, signal });

    this.#animate();
  }

  /** @private */
  #resize() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
  }

  /** * @private
   * @param {number} x
   * @param {number} y
   * @param {number} vx
   * @param {number} vy
   */

  #addParticles(x, y, vx, vy) {
    for (let i = 0; i < this.#config.density; i++) {
      const sX = vx * 0.15 + (Math.random() - 0.5) * 2 * this.#config.speed;
      const sY = vy * 0.15 + (Math.random() - 0.5) * 2 * this.#config.speed;

      this.#particles.push(new Particle(x, y, sX, sY, this.#config));
    }
  }

  /** * @private
   * @param {string} emoji
   * @param {number} size
   */
  #getCache(emoji, size) {
    const key = `${emoji}-${Math.round(size)}`;
    if (this.#emojiCache.has(key)) return this.#emojiCache.get(key);

    const canvas = document.createElement("canvas");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr * 1.5;
    canvas.height = size * dpr * 1.5;
    const ctx = canvas.getContext("2d");

    ctx.font = `${size * dpr}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);

    this.#emojiCache.set(key, canvas);
    return canvas;
  }

  /** @private */
  #animate() {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    for (let i = this.#particles.length - 1; i >= 0; i--) {
      const p = this.#particles[i];
      p.update();

      const cached = this.#getCache(p.emoji, p.size);
      this.#ctx.globalAlpha = p.opacity;
      this.#ctx.drawImage(
        cached,
        p.x - cached.width / (2 * (window.devicePixelRatio || 1)),
        p.y - cached.height / (2 * (window.devicePixelRatio || 1)),
        cached.width / (window.devicePixelRatio || 1),
        cached.height / (window.devicePixelRatio || 1),
      );

      if (p.opacity <= 0) {
        this.#particles[i] = this.#particles[this.#particles.length - 1];
        this.#particles.pop();
      }
    }
    this.#animationId = requestAnimationFrame(() => this.#animate());
  }

  /** @public */
  destroy() {
    this.#controller.abort();
    cancelAnimationFrame(this.#animationId);
    this.#canvas.remove();
    this.#particles = [];
  }
}

export class Particle {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} vx
   * @param {number} vy
   * @param {WandTrailOptions} config
   */
  constructor(x, y, vx, vy, config) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.opacity = 1;
    this.fadeSpeed = config.fadeSpeed;
    this.size = Math.random() * 20 + 10;

    this.emoji = Array.isArray(config.emoji)
      ? config.emoji[Math.floor(Math.random() * config.emoji.length)]
      : config.emoji;
  }

  update() {
    this.vx *= 0.96;
    this.vy *= 0.96;
    this.vy += 0.1;

    this.x += this.vx;
    this.y += this.vy;
    this.opacity -= this.fadeSpeed;
  }
}
