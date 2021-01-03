import {Vector, World, Body, Bodies} from 'matter-js'

const indicatorInterract = 5;	// Distance at which indicators interract with currents
const avgIndicatorLife = 1;

export default abstract class Current {
	constructor(public world: World) {
		this.indicators = new Set<Body>();
	}
	abstract exert(pos: Vector): Vector
	position: Vector
	radius: number
	indicatorInterract: number = indicatorInterract
	emit: Vector = null
	absorb: Vector = null
	indicators: Set<Body>

	addIndicator() {
		let angle = Math.random() * Math.PI * 2,
			pos = Vector.add(
				this.position,
				Vector.create(this.indicatorInterract*Math.cos(angle), this.indicatorInterract*Math.sin(angle))
			),
			indicator = Bodies.circle(pos.x, pos.y, 1, {
				label: 'Current indicator',
				inertia: 10,
				frictionAir: 0.8
			});
		indicator.current = this;
		indicator.life = (1+Math.random()) * avgIndicatorLife;
		World.add(this.world, indicator);
		this.indicators.add(indicator);
	}
	clear() {
		World.remove(this.world, Array.from(this.indicators));
		this.indicators.clear();
	}
	remove(indicator: Body) {
		if(this.indicators.has(indicator)) {
			World.remove(this.world, indicator);
			this.indicators.delete(indicator);
		}
	}
	tick(dt: number) {
		var bodies = this.world.bodies;
		let calc = Vector.create();
		for(let indicator of this.indicators)
			if((indicator.life -= dt/1000) <=0)
				this.remove(indicator);
		for(let item of bodies)
			Body.applyForce(
				item, this.position,
				Vector.mult(this.exert(item.position), item.inverseInertia)
			);
		if(Math.random()*dt/1000 < 1)
			this.addIndicator();
	}
}