import {Vector, World} from 'matter-js'
import Current from './current'

const attenuation = 10;	// To avoid 1/~0 infinite strength

export default class Well extends Current {
	constructor(world: World, public position: Vector, public radius: number, public strength: number) {
		super(world);
		this.absorb = position;
		this.indicatorInterract = radius-this.indicatorInterract;
	}
	exert(position: Vector): Vector {
		let calc = Vector.sub(position, this.position);
		let mag = Vector.magnitude(calc);
		return mag && mag < this.radius ?
			Vector.mult(Vector.normalise(calc), -this.strength/(attenuation+mag)) :
			Vector.create();
	}
}