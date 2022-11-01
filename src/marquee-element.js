export class MarqueeElement extends HTMLElement {
	static observedAttributes = ['threshold'];

	shadowRoot = this.attachShadow({ mode: 'open' });

	marqueeRef;
	get marquee() {
		return this.marqueeRef.deref();
	}

	static {
		for (const key of ['disabled', 'multiline', 'pausable']) {
			Object.defineProperty(this.prototype, key, {
				get() { return this.hasAttribute(key); },
				set(value) { this.toggleAttribute(key, value); }
			});
		}
	}

	get threshold() {
		const attr = this.getAttribute('threshold');
		const value = attr ? Number.parseFloat(attr) : 0;
		return value > 0 && value < Infinity ? value : 0;
	}
	set threshold(value) {
		this.setAttribute('threshold', String(value));
	}

	constructor() {
		super();
		this.shadowRoot.adoptedStyleSheets = Object.values(styleSheets);
		this.shadowRoot.append(template.content.cloneNode(true));
		this.marqueeRef = new WeakRef(/**@type {HTMLDivElement}*/(this.shadowRoot.getElementById('marquee')));
	}

	connectedCallback() {
		hostResizeObserver.observe(this);
	}

	disconnectedCallback() {
		hostResizeObserver.unobserve(this);
		boxes.delete(this);

		const marquee = this.marquee;
		if (marquee) {
			slotResizeObserver.unobserve(marquee);
			boxes.delete(marquee);
		}
	}

	attributeChangedCallback(/**@type {string}*/name) {
		if (name === 'threshold') {
			const marquee = this.marquee;
			if (marquee) {
				if (this.threshold) {
					slotResizeObserver.observe(marquee);
					this.requestAnimation();
				}
				else {
					slotResizeObserver.unobserve(marquee);
					marquee.classList.add('animate');
				}
			}
		}
	}

	requestAnimation() {
		const threshold = this.threshold;
		if (threshold) {
			const marquee = this.marquee;
			if (marquee) {
				const host = boxes.get(this) ?? this.getBoundingClientRect();
				const slot = boxes.get(marquee) ?? marquee.getBoundingClientRect();

				const shouldAnimate = (host.width - slot.width <= threshold && slot.width - host.width >= threshold)
					|| (host.height - slot.height <= threshold && slot.height - host.height >= threshold);
				marquee.classList.toggle('animate', shouldAnimate);
			}
		}
	}
}

const template = document.createElement('template');
template.innerHTML = /*html*/`
	<div id="frame" part="frame">
		<div id="marquee" class="animate" part="marquee">
			<slot></slot>
		</div>
	</div>
`;

export const styleSheets = { default: new CSSStyleSheet() };
styleSheets.default.replaceSync(/*css*/`
	:host {
		--marquee-element-animation: scroll-left;
		--marquee-element-duration: 60s;
		--marquee-element-timing-function: linear;
		--marquee-element-iteration-count: infinite;
		display: block;
		box-sizing: border-box;
	}

	#frame {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	#marquee {
		--marquee-element-width: 0px;
		--marquee-element-height: 0px;
		box-sizing: border-box;
	}

	:host(:not([multiline])) #marquee {
		white-space: nowrap;
	}

	:host(:not([disabled])) .animate {
		animation-name: var(--marquee-element-animation);
		animation-duration: var(--marquee-element-duration);
		animation-timing-function: var(--marquee-element-timing-function);
		animation-iteration-count: var(--marquee-element-iteration-count);
	}

	:host([pausable]:hover) #marquee {
		animation-play-state: paused;
	}

	@keyframes scroll-left {
		from {
			transform: translateX(50%) translateX(calc(var(--marquee-element-width) / 2));
		}
		to {
			transform: translateX(-50%) translateX(calc(var(--marquee-element-width) / -2));
		}
	}

	@keyframes scroll-right {
		from {
			transform: translateX(-50%) translateX(calc(var(--marquee-element-width) / -2));
		}
		to {
			transform: translateX(50%) translateX(calc(var(--marquee-element-width) / 2));
		}
	}

	@keyframes scroll-top {
		from {
			transform: translateY(50%) translateY(calc(var(--marquee-element-height) / 2));
		}
		to {
			transform: translateY(-50%) translateY(calc(var(--marquee-element-height) / -2));
		}
	}

	@keyframes scroll-bottom {
		from {
			transform: translateY(-50%) translateY(calc(var(--marquee-element-height) / -2));
		}
		to {
			transform: translateY(50%) translateY(calc(var(--marquee-element-height) / 2));
		}
	}

	@keyframes alternate-horizontal {
		from {
			transform: translateX(50%) translateX(calc(var(--marquee-element-width) / -2));
		}
		50% {
			transform: translateX(-50%) translateX(calc(var(--marquee-element-width) / 2));
		}
		to {
			transform: translateX(50%) translateX(calc(var(--marquee-element-width) / -2));
		}
	}

	@keyframes alternate-vertical {
		from {
			transform: translateY(50%) translateY(calc(var(--marquee-element-height) / -2));
		}
		50% {
			transform: translateY(-50%) translateY(calc(var(--marquee-element-height) / 2));
		}
		to {
			transform: translateY(50%) translateY(calc(var(--marquee-element-height) / -2));
		}
	}
`);

/**@type {WeakMap<Element, DOMRectReadOnly>}*/
const boxes = new WeakMap();

const hostResizeObserver = new ResizeObserver(entries => {
	for (const entry of entries) {
		const target = /**@type {MarqueeElement}*/(entry.target);
		boxes.set(target, entry.contentRect);

		const marquee = target.marquee;
		if (marquee) {
			marquee.style.setProperty('--marquee-element-width', entry.contentRect.width + 'px');
			marquee.style.setProperty('--marquee-element-height', entry.contentRect.height + 'px');

			target.requestAnimation();
		}
	}
});

const slotResizeObserver = new ResizeObserver(entries => {
	for (const entry of entries) {
		boxes.set(entry.target, entry.contentRect);
		/**@type {MarqueeElement}*/(/**@type {ShadowRoot}*/(entry.target.getRootNode()).host).requestAnimation();
	}
});
