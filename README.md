# marquee-element

MarqueeElement is a vanilla web component implementation of the now deprecated HTMLMarqueeElement using shadow DOM, templates, slots, constructable style sheets, CSS animations, and ResizeObserver.

## Attributes and Properties

| Attribute   | Property    | Type      | Reflected | Description                                                                                                     |
| ----------- | ----------- | --------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| `disabled`  | `disabled`  | `Boolean` | Yes       | Disables animations when attribute is present or property is `true`.                                            |
| `multiline` | `multiline` | `Boolean` | Yes       | Enables word wrapping when attribute is present or proeprty is true`.                                           |
| `pausable`  | `pausable`  | `Boolean` | Yes       | Pauses animation on hover when attribute is present or property is `true`.                                      |
| `threshold` | `threshold` | `Number`  | Yes       | When a positive number is given, slotted elements will animate if and only if they overflow the host container. |

## CSS Variables

| Variable                            | Type                                                                                                       | Default          | Read | Write |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------- | ---- | ----- |
| `--marquee-element-animation`       | `scroll-left \| scroll-right \| scroll-top \| scroll-bottom \| alternate-horizontal \| alternate-vertical` | `scroll-left`    | Yes  | Yes   |
| `--marquee-element-duration`        | `<time>`                                                                                                   | `60s`            | Yes  | Yes   |
| `--marquee-element-timing-function` | `<easing-function>`                                                                                        | `linear`         | Yes  | Yes   |
| `--marquee-element-iteration-count` | `infinite \| <number>`                                                                                     | `infinite`       | Yes  | Yes   |
| `--marquee-element-width`           | `<length>`                                                                                                 | Host Width (px)  | Yes  | No    |
| `--marquee-element-height`          | `<length>`                                                                                                 | Host Height (px) | Yes  | No    |

Overriding `--marquee-element-width` or `--marquee-element-height` is not recommended.

## Parts

| Identifier | Description                                     |
| ---------- | ----------------------------------------------- |
| `frame`    | Overflow container for the animation container. |
| `marquee`  | Animation container for slotted elements.       |
