import * as Physics from 'physicsjs'
import Current from './current'

const attenuation = 10;	// To avoid 1/~0 infinite strength

export default class Well extends Current {
	constructor(public position: Physics.vector, public radius: number, public strength: number) {
		super();
		this.absorb = position;
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
				calc.mult(-this.strength/(attenuation+norm));
			} else calc.zero();
			return calc;
		} catch(x) {
			console.error(x);
		} finally {
			scratch.done();
		}
	}
}