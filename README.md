# Magic Wand Trail ✨

A lightweight, modern JavaScript library for creating interactive emoji particle trail that follow mouse or touch movement. Perfect for landing pages, "spell-cast" buttons, or interactive drawing tools.

![magic-wand-trail-demo](https://github.com/user-attachments/assets/3155262b-19be-495b-831c-39e33bccfe88)

## Installation

```bash
npm install magic-wand-trail
```

## Quick Start

Initialize the magic in your JS:

```bash
import { MagicWandTrail } from 'magic-wand-trail';

const wand = new MagicWandTrail({
        emoji: ["🌜", "❄️", "🎃"],
    });
```

## Options

| Property  | Type     | Default | Description                               |
| :-------- | :------- | :------ | :---------------------------------------- |
| emoji     | String[] | ✨      | List of emoji characters.                 |
| speed     | Number   | 1       | Initial explosion speed of particles.     |
| density   | Number   | 5       | Number of particles created per movement. |
| fadeSpeed | Number   | 0.02    | How fast particles become transparent.    |

## Accessibility

This library respects the `prefers-reduced-motion` media query.
If a user has enabled "Reduce Motion" in their system settings:

- The animation will not initialize by default.
- You can override this by setting `respectMotionPrefs: false`.

## License

MIT
