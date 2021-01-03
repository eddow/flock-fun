import {Vector, Body, Bodies} from 'matter-js'
import {FishOptions, FlockOptions} from './options'
import Baits from './baits'

const distFix = 1;
const angleVelMax = .05;
const pi = Math.PI;
const flapCoolDown = 5;
const maxVFlap = .1;	// Cannot flap if already faster than this
const hunger = .1;	// How much it prefers the bait to the group : 0..1

export default function Fish(options: FishOptions, flock: FlockOptions) {
	var rv = Bodies.trapezoid(options.x, options.y, flock.radius, flock.radius, .6, {
		restitution: 1,
		angle: options.angle,
		label: 'Fish',
		render: {
			fillStyle: flock.color
		}
	});
	Object.setPrototypeOf(rv, fishPrototype);
	rv.flock = flock;
	return rv;
}

const fishPrototype = {
	turn: function(neighbours: any[], comfortDistance, bait: any, dt:number) {
		let pos = this.position,
			velMax = this.flock.velocity,
			temp = Vector.create(),
			vradius = this.visibility * this.visibility,
			direction = Vector.create(),
			immitate = Vector.create();
		console.assert(!isNaN(pos.x) && !isNaN(pos.y));
		if(!neighbours.length) {
			// TODO: random seek
		} else for(let n of neighbours) {
			Vector.add(
				direction,
				Vector.mult(
					Vector.normalise(Vector.sub(pos, n.fish.position)),
					n.dist < comfortDistance ?
						comfortDistance/n.dist :
						-n.dist/comfortDistance
				),
				direction
			);
			Vector.add(
				immitate,
				Vector.normalise(n.fish.velocity),
				immitate
			);
		}

		let norm = Math.sqrt(Vector.magnitude(direction));
		if(norm) {
			immitate = Vector.normalise(immitate);
			//immitate.mult(1/neighbours.length);	// norm = 1??
			direction = Vector.mult(Vector.normalise(direction), Math.min(distFix, norm));
		}
		Vector.add(direction, immitate, direction);
		direction = Vector.mult(direction, velMax);
		if(Vector.magnitudeSquared(this.velocity)) {
			norm = Vector.magnitude(direction);
			let angle = Vector.angle({x:0, y:0}, direction);
			let tangle = Vector.angle({x:0, y:0}, this.velocity);
			if(angle > tangle+pi) angle -= 2*pi;
			if(angle < tangle-pi) angle += 2*pi;
			let maxTurn = /*dt/1000 **/ angleVelMax,
				delta = Math.min(
					Math.abs(angle-tangle),
					maxTurn
				);
			tangle += Math.sign(angle-tangle) * delta;
			norm = Math.max(norm, velMax);
			Object.assign(direction, {x: Math.cos(tangle)*norm, y: Math.sin(tangle)*norm});
		}
		if(bait) {
			let baitStrength = hunger*bait.life / Baits.lifeSpan;
			direction = Vector.add(
				Vector.mult(
					Vector.normalise(
						Vector.sub(bait.position, this.position)
					),
					velMax*(bait.strength||1) * baitStrength
				), Vector.mult(
					direction,
					1 - baitStrength
				)
			);
		}
		if(Vector.magnitudeSquared(direction)) {
			let newAngle = Vector.angle({x:0, y:0}, direction);
			//this.fcd -= Math.abs(this.state.angular.pos - newAngle);
			Body.setAngle(this, newAngle-Math.PI/2);
			/*let tvel = this.state.vel.norm();
			if((this.fcd <= 0 && tvel < maxVFlap) || !tvel){
				this.fcd = flapCoolDown;
				this.state.acc.clone(temp);
			} else 
				this.state.acc.zero();
			this.state.vel.mult(dt/10);*/
			console.assert(!isNaN(direction.x) && !isNaN(direction.y));
			Body.setVelocity(this, direction);
		}
	}
};