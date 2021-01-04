import {World, Body, Bodies, Vector} from 'matter-js'
import {Scene, MinMax, randFish} from './scene'
import BaseScene from './base'
import {Flock, CNS} from '../entities'
import {Source, Well, Counter} from '../stage'

const gap = 200;
const wallWidth = 10;

export default class TestScene extends BaseScene {
	counterFlock: Flock
	source: Source
	well: Well
	ball: Body
	wall: Body
	counter: Counter
	constructor(world: World, spawn: MinMax<Vector>) {
		spawn.max.x -= gap + wallWidth;
		super(world, spawn);
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
		()=> randFish(spawn));
		World.add(world, this.ball = Bodies.circle(300, 300, 50, {
			render: {
				fillStyle: 'blue'
			},
			label: 'Toy',
			frictionAir: 0,
			mass: 50
		}));
		World.add(world, this.wall = Bodies.rectangle(
			spawn.max.x + wallWidth/2, (spawn.max.y+gap)/2,
			wallWidth, spawn.max.y-gap, {
				render: {
					fillStyle: 'grey'
				},
				label: 'Wall',
				isStatic: true
			}));
		this.source = new Source(world, Vector.create(spawn.max.x+gap/2, gap/2), gap/Math.sqrt(2), .05);
		let goal = {
			position: Vector.create(spawn.max.x+wallWidth+gap/2, spawn.max.y-gap/2),
			radius: gap/2
		}
		this.well = new Well(world, goal.position, goal.radius, .05);
		this.counter = new Counter(this.flock, goal.position, goal.radius, 40, '#0c02');
	}
	clear() {
		super.clear();
		this.counterFlock.clear();
		World.remove(this.world, this.ball);
		World.remove(this.world, this.wall);
		this.source.clear();
		this.well.clear();
		this.counter.clear();
	}
	tick(dt: number) {
		super.tick(dt);
		this.counterFlock.tick(dt);
		this.source.tick(dt);
		this.well.tick(dt);
		this.counter.tick(dt);
	}
};