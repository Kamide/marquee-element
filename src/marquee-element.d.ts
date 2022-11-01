export class MarqueeElement extends HTMLElement {
	static readonly observedAttributes = ['threshold'] as const;

	readonly shadowRoot: ShadowRoot;

	readonly marqueeRef: WeakRef<HTMLDivElement>;
	get marquee(): HTMLDivElement | undefined;

	get disabled(): boolean;
	set disabled(value: boolean): boolean

	get multiline(): boolean;
	set multiline(value: boolean): boolean;

	get pausable(): boolean;
	set pausable(value: boolean);

	get threshold(): number;
	set threshold(value: string | number);
}

export const styleSheets: {
	[key: string]: CSSStyleSheet;
	default: CSSStyleSheet;
};
