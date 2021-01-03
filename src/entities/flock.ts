import * as Physics from 'physicsjs'
import './fish'
import Baits from './baits'

export default class Flock {
	items: any[]
	behavior: any
	constructor(public world: any,
		number: number,
		nearest: number,
		comfortDistance: number,
		baits: Baits,
		opts: (i: number)=> any
	) {
		console.assert(nearest < number, 'Comparison neighbours less than number-1')
		this.items = [];
		for(let i=0; i<number; ++i) {
			let fish = Physics.body('fish', opts(i));
			this.items.push(fish);
		}
		world.add(this.items);
		world.add(this.behavior = Physics.behavior('flock', {
			nearest,
			baits,
			comfortDistance
		}).applyTo(this.items));
	}
	clear() {
		this.world.remove(this.items);
		this.world.remove(this.behavior);
	}
}

function findSortIndex(nrs: number[], ins: number) {
	const bounds = {min:0, max: nrs.length};
	if(ins >= nrs[bounds.max - 1]) return -1;
	while(bounds.min < bounds.max) {
		var mid = Math.floor((bounds.min+bounds.max)/2);
		if(ins > nrs[mid])
			bounds.min = mid+1;
		else bounds.max = mid;
	}
	return bounds.min;
}

Physics.behavior('flock', function(parent) {
    return {
		/*init: function(options){
			parent.init.call(this, options);
			this.baits = option.baits;
		},*/
        behave: function(data) {
            var bodies = this.getTargets(),
				nearest = this.options.nearest,
				neighbours = new Array(nearest),
				cd = this.options.comfortDistance;
			cd = cd * cd;	// we use squared distance
			
            for(let fish of bodies) {
				neighbours.fill({
					dist: Infinity,
					fish: null
				});
				// find the `nearest` fish
				for(let comp of bodies) if(comp !== fish) {
					let dist = comp.state.pos.distSq(fish.state.pos);
					let ndx = findSortIndex(neighbours.map(n=> n.dist), dist);
					if(-1< ndx) {
						neighbours.splice(ndx, 0, {dist, fish: comp});
						neighbours = neighbours.slice(0, nearest);
					}
				}
				let baitProx = Infinity, nearestBait = null;
				if(this.options.baits) {
					for(let bait of this.options.baits.items) {
						let dist = bait.state.pos.distSq(fish.state.pos);
						if(dist < baitProx) {
							baitProx = dist;
							nearestBait = bait;
						}
					}
				}
				fish.turn(neighbours, cd, nearestBait, this.options.velMax, data.dt);
            }
        }
    };
});