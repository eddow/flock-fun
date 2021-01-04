import {World, Vector} from 'matter-js'
import {Scene, MinMax, randFish} from './scene'
import {Flock, CNS} from '../entities'
import {Current, Temperature} from '../stage'

export default class BaseScene implements Scene {
	cns: CNS
	flock: Flock
	temperature: Temperature
	world: World
	constructor(world: World, spawn: MinMax<Vector>) {
		this.world = world;
		this.cns = new CNS(world);
		this.flock = new Flock({
			world,
			number: 50,	// nr of fish
			neighbours: 6,	// nr of neighbours considered
			comfortDistance: 50, // Where does this fish feel comfortable distant from others
			baits: this.cns.baits,
			radius: 10,
			velocity: 2,
			//color: 'green',	//Temperature-controlled
			visibility: 200
		},
		()=> randFish(spawn)
		);
		this.temperature = new Temperature(this.flock, {
				hot: {R:0, G:0xc0, B:0},
				cold: {R:0x40, G:0xff, B:0xc0}
			}, {
				hot: 6,
				cold: 24
			},
			30000
		);
	}
	clear() {
		this.flock.clear();
		this.cns.clear();
		this.temperature.clear();
	}
	click(x: number, y: number, button: number) {
		this.cns.click(x, y, button);
		this.temperature.click(x, y, button);
	}
	collide(bA: any, bB: any) {
		Current.collideIndicator(bA) ||
		Current.collideIndicator(bB) ||
		Flock.collideBait(bA, bB);
	}
	tick(dt: number) {
		this.cns.tick(dt);
		this.flock.tick(dt);
		this.temperature.tick(dt);
	}
};