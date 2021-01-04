import Flock from '../entities/flock'

export interface Gradient<T = number> {
	hot: T;
	cold: T;
}
export interface Color<T = number> {
	R: T;
	G: T;
	B: T;
}

function interpolate(values: Gradient<number>, temp: number) {
	return Math.round(values.cold*temp + values.hot*(1-temp));
}

export default class Temperature {
	state: number = 0
	colors: Color<Gradient>
	constructor(
		public flock: Flock,
		colors: Gradient<Color>,
		public neighbours: Gradient,
		public duration: number	//milliseconds
	) {
		this.colors = {R: null, G: null, B: null};
		for(let c in this.colors)
			this.colors[c] = {
				cold: colors.cold[c],
				hot: colors.hot[c],
			}
		this.flock.setColor(colors.hot);
	}
	tick(dt: number) {
		if(this.state > 0) {
			this.state = Math.max(this.state-dt, 0);
			let temp = this.state/this.duration;
			let color: Color = {R: null, G: null, B: null};
			for(let c in color)
				color[c] = interpolate(this.colors[c], temp);
			let neighbours = interpolate(this.neighbours, temp);
			this.flock.setColor(color);
			this.flock.options.neighbours = neighbours;
		}
	}
	click(x: number, y: number, button: number) {
		if(1=== button && 0=== this.state)
			this.state = this.duration;
	}
	clear() {}
}