import {World, Bodies, Body} from 'matter-js'

const lifeSpan = 10;	//seconds
const baitRadius = 4;

export default class Baits {
	items: Set<Body>
	static lifeSpan: number = lifeSpan
	constructor(public world:any, public color: string = 'orange') {
		this.items = new Set<Body>();
	}
	add(x: number, y: number) {
		const bait = Bodies.circle(x, y, baitRadius, {
			label: 'Bait',
			restitution: 1,
			render: {
				fillStyle: this.color
			}
		});
		bait.life = lifeSpan;
		this.items.add(bait);
		World.add(this.world, bait);
	}
	remove(bait: any) {
		if(this.items.has(bait)) {
			World.remove(this.world, bait);
			this.items.delete(bait);
		}
	}
	clear() {
		World.remove(this.world, Array.from(this.items));
		this.items.clear();
	}
	tick(dt: number) {
		for(let bait of this.items)
			if(0> (bait.life -= dt/1000))
				this.remove(bait);
			else
				bait.circleRadius = baitRadius * bait.life/lifeSpan;
	}
}