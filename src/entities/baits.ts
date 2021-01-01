import * as Physics from 'physicsjs'

const lifeSpan = 10;	//seconds
const baitRadius = 4;

Physics.body('bait', 'circle', function(parent) {
	return {
		init: function(options){
			options.styles = {
				strokeStyle: 'hsla(0, 37%, 17%, 1)',
				lineWidth: 1,
				fillStyle: 'hsla(0, 37%, 57%, 0.8)',
			};
			options.radius = 3;
			parent.init.call(this, options);
		}
	};
});

export default class Baits {
	items: any[] = []
	behavior: any
	constructor(private world:any) {}
	add(x: number, y: number) {
		let bait = Physics.body('bait', {x, y, life: lifeSpan});
		this.items.push(bait);
		this.world.add(bait);
	}
	remove(bait: any) {
		let ndx = this.items.indexOf(bait);
		this.world.remove(bait);
		this.items.splice(ndx, 1);
	}
	decay(dt: number) {
		let baits = this.items;
		for(let i=0; i<baits.length;) {
			let bait = baits[i];
			if(0> (bait.life -= dt/1000)) {
				this.world.remove(bait);
				baits.splice(i, 1);
			}
			else {
				// Note: no way to change the radius this way - TODO: find a way
				// ? Physics.body('compound', ...
				let rad = baitRadius * bait.life/lifeSpan;
				bait.geometry.options({radius: rad});
				bait.geometry.radius = rad;
				bait.options({radius: rad});
				bait.radius = rad;
				document.title = ''+ rad;
				bait.recalc();
				i++;
			}
		}
	}
}