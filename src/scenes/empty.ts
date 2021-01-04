import {World} from 'matter-js'
import {Scene} from './scene'
import Flock from '../entities/flock'
import Baits from '../entities/baits'

export default class EmptyScene implements Scene {
	baits: Baits[] = null
	flock: Flock = null
	constructor(public world: World, viewWidth: number, viewHeight: number) {
		this.baits = [new Baits(world), new Baits(world, 'pink', -1)];
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
		this.baits.forEach((b: any)=> b.clear());
	}
	click(x: number, y: number, button: number) {
		const baitNdx = [0, -1, 1];
		let ndx = baitNdx[button];
		if(~ndx)
			this.baits[ndx].add(x, y);
	}
	collide(bA: any, bB: any) {
		Flock.collideBait(bA, bB);
	}
	tick(dt: number) {
		this.baits.forEach((b: any)=> b.tick(dt));
		this.flock.tick(dt);
	}
};