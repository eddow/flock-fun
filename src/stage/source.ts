import * as Physics from 'physicsjs'
import Current from './current'

const attenuation = 10;	// To avoid 1/~0 infinite strength when near the center

export default class Source extends Current {
	constructor(world: Physics.world, public position: Physics.vector, public radius: number, public strength: number) {
		super(world);
		this.emit = position;
	}
	exert(pos: Physics.vector): Physics.vector {
		var scratch = Physics.scratchpad();
		try {
			let calc = scratch.vector();
			calc.clone(pos);
			calc.vsub(this.position);
			let norm = calc.norm();
			if(norm && norm < this.radius) {
				calc.normalize();
				calc.mult(this.strength/(attenuation+norm));
			} else calc.zero();
			return calc;
		} catch(x) {
			console.error(x);
		} finally {
			scratch.done();
		}
	}
}