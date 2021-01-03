import * as Physics from 'physicsjs'
import Flock from '../entities/flock'
import Baits from '../entities/baits'

export default class Scene {
	baits: Baits = null
	flock: Flock = null
	constructor(public world: Physics.world, viewWidth: number, viewHeight: number) {
		this.baits = new Baits(world);
		this.flock = new Flock(
			world,
			50,	// nr of fish
			6,	// nr of neighbours considered
			30, // Where does this fish feel comfortable distant from others
			this.baits,
			()=> ({
				x: Math.random() * viewWidth,
				y: Math.random() * viewHeight,
				angle: Math.random() * Math.PI * 2,
				radius: 5,
				velMax: .1,
				styles: {
					strokeStyle: 'hsla(60, 37%, 17%, 1)',
					lineWidth: 1,
					fillStyle: 'hsla(60, 37%, 57%, 0.8)',
					angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
				},
				visibility: 150
			}));
	}
	clear() {
		this.flock.clear();
		this.baits.clear();
	}
	click(x: number, y: number) {
		this.baits.add(x, y);
	}
	collide(bA: any, bB: any) {
		if('bait'=== bA.name) [bA, bB] = [bB, bA];
		if('fish'=== bA.name && 'bait'=== bB.name)
			this.baits.remove(bB);
	}
	tick(dt) {
		this.baits.decay(dt);
	}
};