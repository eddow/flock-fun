import {World} from 'matter-js'
import Flock from '../entities/flock'
import Baits from '../entities/baits'

export default class Scene {
	baits: Baits = null
	flock: Flock = null
	constructor(public world: World, viewWidth: number, viewHeight: number) {
		this.baits = new Baits(world);
		this.flock = new Flock({
			world,
			number: 50,	// nr of fish
			neighbours: 6,	// nr of neighbours considered
			comfortDistance: 30, // Where does this fish feel comfortable distant from others
			baits: this.baits,
			radius: 10,
			velocity: 2,
			color: 'green',
			visibility: 200
		},
		()=> ({
			x: Math.random() * viewWidth,
			y: Math.random() * viewHeight,
			angle: Math.random() * Math.PI * 2,
			restitution: 1
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
		if('Bait'=== bA.label) [bA, bB] = [bB, bA];
		if('Fish'=== bA.label && 'Bait'=== bB.label)
			this.baits.remove(bB);
	}
	tick(dt) {
		this.baits.tick(dt);
		this.flock.tick(dt);
	}
};