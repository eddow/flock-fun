import {World} from 'matter-js'
import {Scene} from './scene'
import Flock from '../entities/flock'
import CNS from '../entities/carrotNstick'

export default class EmptyScene implements Scene {
	cns: CNS = null
	flock: Flock = null
	constructor(public world: World, viewWidth: number, viewHeight: number) {
		this.cns = new CNS(world);
		this.flock = new Flock({
			world,
			number: 50,	// nr of fish
			neighbours: 6,	// nr of neighbours considered
			comfortDistance: 30, // Where does this fish feel comfortable distant from others
			baits: this.cns.baits,
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
		this.cns.clear();
	}
	click(x: number, y: number, button: number) {
		this.cns.click(x, y, button);
	}
	collide(bA: any, bB: any) {
		Flock.collideBait(bA, bB);
	}
	tick(dt: number) {
		this.cns.tick(dt);
		this.flock.tick(dt);
	}
};