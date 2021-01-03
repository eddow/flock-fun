import {Engine, Render, World, Runner, Bodies, Events} from 'matter-js'
import Flock from '../entities/flock'
//import Baits from '../entities/baits'

export default class Scene {
	//baits: Baits = null
	flock: Flock = null
	constructor(public world: World, viewWidth: number, viewHeight: number) {
		//this.baits = new Baits(world);
		this.flock = new Flock({
			world,
			number: 50,	// nr of fish
			neighbours: 6,	// nr of neighbours considered
			comfortDistance: 30, // Where does this fish feel comfortable distant from others
			baits: null, //this.baits,
			radius: 10,
			velocity: 2,
			color: 'green',
			visibility: 150
		},
		()=> ({
			x: Math.random() * viewWidth,
			y: Math.random() * viewHeight,
			angle: Math.random() * Math.PI * 2,
			styles: {
				strokeStyle: 'hsla(60, 37%, 17%, 1)',
				lineWidth: 1,
				fillStyle: 'hsla(60, 37%, 57%, 0.8)',
				angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
			}
		}));
	}
	clear() {
		this.flock.clear();
		//this.baits.clear();
	}
	click(x: number, y: number) {
		//this.baits.add(x, y);
	}
	collide(bA: any, bB: any) {/*
		if('bait'=== bA.name) [bA, bB] = [bB, bA];
		if('fish'=== bA.name && 'bait'=== bB.name)
			this.baits.remove(bB);*/
	}
	tick(dt) {
		//this.baits.decay(dt);
		this.flock.tick(dt);
	}
};