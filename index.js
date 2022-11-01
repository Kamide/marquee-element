// @ts-nocheck
import { MarqueeElement, styleSheets } from './src/marquee-element.js';

styleSheets.override = new CSSStyleSheet({ disabled: true });
styleSheets.override.replace(/*css*/`
	#frame {
		overflow: visible;
	}

	#marquee {
		outline: thin dashed red;
		z-index: 1;
	}
`);

customElements.define('marquee-element', MarqueeElement);

customElements.whenDefined('marquee-element').then(() =>
	document.querySelector('marquee-element').addEventListener('transitionend', () =>
		document.querySelector('[data-fouc]').remove(), { once: true }));

document.querySelector('button').addEventListener('click', function () {
	styleSheets.override.disabled = !styleSheets.override.disabled;
	this.textContent = (styleSheets.override.disabled ? 'Show' : 'Hide') + ' Bounding Box';
});
