import {World} from 'matter-js'
import Baits from './baits'

export default class CNS {
	baits: Baits[]
	constructor(world: World, carrotColor: string = 'orange', stickColor: string = 'brown') {
		this.baits = [
			new Baits(world, carrotColor, 1),
			new Baits(world, stickColor, -1)
		];
	}
	tick(dt: number) {
		this.baits.forEach((b: any)=> b.tick(dt));
	}
	click(x: number, y: number, button: number) {
		const baitNdx = [0, -1, 1];
		let ndx = baitNdx[button];
		if(~ndx)
			this.baits[ndx].add(x, y);
	}
	clear() {
		this.baits.forEach((b: any)=> b.clear());
	}
}