import {World, Bodies, Body} from 'matter-js'

const lifeSpan = 10;	//seconds
const baitRadius = 4;

export default class Baits {
	items: Body[]
	static lifeSpan: number = lifeSpan
	constructor(public world:any, public color: string = 'orange') {
		this.items = [];
	}
	add(x: number, y: number) {
		const bait = Bodies.circle(x, y, baitRadius, {
			label: 'Bait',
			render: {
				fillStyle: this.color
			},
			isSensor: true
		});
		bait.life = lifeSpan;
		this.items.push(bait);
		World.add(this.world, bait);
	}
	remove(bait: any) {
		let ndx = this.items.indexOf(bait);
		if(~ndx) {
			World.remove(this.world, bait);
			this.items.splice(ndx, 1);
		}
	}
	clear() {
		World.remove(this.world, this.items);
		this.items.splice(0);
	}
	tick(dt: number) {
		let baits = this.items;
		for(let i=0; i<baits.length;) {
			let bait = baits[i];
			if(0> (bait.life -= dt/1000)) {
				World.remove(this.world, bait);
				baits.splice(i, 1);
			}
			else {
				// Note: no way to change the radius this way - TODO: find a way
				// cfr renderer.js:156 view = body.view || ( body.view = this.createView(body.geometry, body.styles) );
				// ==> deleting the view makes it invisible, even if the view is re-created
				// ? Physics.body('compound', ...
				let rad = baitRadius * bait.life/lifeSpan;
				/*bait.geometry.options({radius: rad});
				bait.geometry.radius = rad;
				bait.options({radius: rad});
				bait.radius = rad;
				document.title = ''+ rad;
				bait.dirtyView = true;*/
				bait.circleRadius = rad;
				i++;
			}
		}
	}/*
	refreshViews() {
		for(let bait of this.items)
			if(bait.dirtyView)
				bait.view = null;
	}*/
}