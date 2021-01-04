import {World, Body, Bodies, Vector} from 'matter-js'
import {Scene} from './scene'
import Flock from '../entities/flock'
import CNS from '../entities/carrotNstick'
import Current from '../stage/current'
import Source from '../stage/source'
import Well from '../stage/well'

const gap = 200;
const wallWidth = 10;

export default class TestScene implements Scene {
	cns: CNS = null
	flock: Flock = null
	counterFlock: Flock = null
	source: Source = null
	well: Well = null
	ball: Body = null
	wall: Body = null
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
	clear() {
		this.flock.clear();
		this.counterFlock.clear();
		this.cns.clear();
		World.remove(this.world, this.ball);
		World.remove(this.world, this.wall);
		this.source.clear();
		this.well.clear();
	}
	click(x: number, y: number, button: number) {
		this.cns.click(x, y, button);
	}
	collide(bA: any, bB: any) {
		Current.collideIndicator(bA) ||
		Current.collideIndicator(bB) ||
		Flock.collideBait(bA, bB);
	}
	tick(dt: number) {
		this.cns.tick(dt);
		this.flock.tick(dt);
		this.counterFlock.tick(dt);
		this.source.tick(dt);
		this.well.tick(dt);
	}
};