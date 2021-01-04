import {Vector, Body, Bodies, World} from 'matter-js'
import {Flock} from '../entities'

export default class Counter {
	achieved: boolean = false
	body: Body
	constructor(
		public flock: Flock,
		public position: Vector,
		public radius: number,
		public expected: number,
		public color: string
	) {
		World.add(flock.options.world, this.body = Bodies.circle(
			position.x, position.y, radius, {
				label: 'Counter',
				isSensor: true,
				render: {
					fillStyle: color
				}
			})
		);
	}
	tick(dt: number): void {
		let cpt = 0;
		for(let fish of this.flock.items) {
			if(Vector.magnitude(Vector.sub(this.position, fish.position)) < this.radius)
				++cpt;
		}
		// TODO: render text
		document.title = ''+ cpt;
	}
	clear() {
		World.remove(this.body);
	}
}