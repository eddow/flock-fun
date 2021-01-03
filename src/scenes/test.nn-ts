import * as Physics from 'physicsjs'
import Flock from '../entities/flock'
import Baits from '../entities/baits'
import Current from '../stage/current'
import Source from '../stage/source'
import Well from '../stage/well'

export default class Scene {
	baits: Baits = null
	flock: Flock = null
	counterFlock: Flock = null
	source: Source = null
	well: Well = null
	ball: Physics.body = null
	wall: Physics.body = null
	constructor(public world: Physics.world, viewWidth: number, viewHeight: number) {
		const gap = 200;
		const wallWidth = 10;
		this.baits = new Baits(world);
		this.flock = new Flock(
			world,
			50,	// nr of fish
			6,	// nr of neighbours considered
			30, // Where does this fish feel comfortable distant from others
			this.baits,
			()=> ({
				x: Math.random() * viewWidth - gap - wallWidth,
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
		this.counterFlock = new Flock(
			world,
			20,	// nr of fish
			6,	// nr of neighbours considered
			50, // Where does this fish feel comfortable distant from others
			null,
			()=> ({
				x: Math.random() * viewWidth,
				y: Math.random() * viewHeight,
				angle: Math.random() * Math.PI * 2,
				radius: 10,
				velMax: .15,
				styles: {
					strokeStyle: 'hsla(0, 37%, 17%, 1)',
					lineWidth: 1,
					fillStyle: 'hsla(0, 37%, 57%, 0.8)',
					angleIndicator: 'hsla(0, 37%, 17%, 0.4)'
				},
				visibility: 150
			}));

		Current.add(this.source = new Source(world, Physics.vector(100, 100), 300, .5));
		Current.add(this.well = new Well(world, Physics.vector(400, 400), 300, .5));

		this.ball = Physics.body('circle', {
			x: 300, y: 300, radius: 50, mass: 50,
			styles: {
				strokeStyle: 'hsla(140, 37%, 17%, 1)',
				lineWidth: 1,
				fillStyle: 'hsla(140, 37%, 57%, 0.8)',
			}
		});
		world.add(this.ball);
		this.wall = Physics.body('rectangle', {
			x: viewWidth - gap + wallWidth/2, y: (viewHeight+gap)/2,
			width: wallWidth, height: viewHeight-gap,
			treatment: 'static',
			styles: {
				strokeStyle: 'hsla(140, 0%, 17%, 1)',
				lineWidth: 1,
				fillStyle: 'hsla(140, 0%, 57%, 0.8)',
			}
		});
		world.add(this.wall);
	}
	clear(world) {
		this.flock.clear();
		this.counterFlock.clear();
		this.baits.clear();
		this.world.remove(this.ball);
		this.world.remove(this.wall);
		Current.clear(this.world);
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