import {World, Body, Bodies, Vector} from 'matter-js'
import Flock from '../entities/flock'
import Baits from '../entities/baits'
import Current from '../stage/current'
import Source from '../stage/source'
import Well from '../stage/well'

const gap = 200;
const wallWidth = 10;

export default class Scene {
	baits: Baits = null
	flock: Flock = null
	counterFlock: Flock = null
	source: Source = null
	well: Well = null
	ball: Body = null
	wall: Body = null
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
			x: Math.random() * viewWidth - gap - wallWidth,
			y: Math.random() * viewHeight,
			angle: Math.random() * Math.PI * 2,
			restitution: 1
		}));
		this.counterFlock = new Flock({
			world,
			number: 20,	// nr of fish
			neighbours: 6,	// nr of neighbours considered
			comfortDistance: 40, // Where does this fish feel comfortable distant from others
			radius: 15,
			velocity: 3,
			color: 'red',
			visibility: 200
		},
		()=> ({
			x: Math.random() * viewWidth - gap - wallWidth,
			y: Math.random() * viewHeight,
			angle: Math.random() * Math.PI * 2,
			restitution: 1
		}));
		World.add(world, this.ball = Bodies.circle(300, 300, 50, {
			render: {
				fillStyle: 'blue'
			},
			label: 'Toy',
			frictionAir: 0,
			mass: 50
		}));
		World.add(world, this.wall = Bodies.rectangle(
			viewWidth - gap + wallWidth/2, (viewHeight+gap)/2,
			wallWidth, viewHeight-gap, {
				render: {
					fillStyle: 'grey'
				},
				label: 'Wall',
				isStatic: true
			}));
		this.source = new Source(world, Vector.create(100, 100), 300, .05);
		this.well = new Well(world, Vector.create(400, 400), 300, .05);
	}
	clear(world) {
		this.flock.clear();
		this.counterFlock.clear();
		this.baits.clear();
		World.remove(this.world, this.ball);
		World.remove(this.world, this.wall);
		this.source.clear();
		this.well.clear();
	}
	click(x: number, y: number) {
		this.baits.add(x, y);
	}
	collide(bA: Body, bB: Body) {
		if('Current indicator'=== bA.label)
			bA.current.remove(bA);
		else if('Current indicator'=== bB.label)
			bB.current.remove(bB);
		else {
			// TODO: only flock eats bait, not counter-flock ?
			if('Bait'=== bA.label) [bA, bB] = [bB, bA];
			if('Fish'=== bA.label && 'Bait'=== bB.label)
				this.baits.remove(bB);
		}
	}
	tick(dt) {
		this.baits.tick(dt);
		this.flock.tick(dt);
		this.counterFlock.tick(dt);
		this.source.tick(dt);
		this.well.tick(dt);
	}
};