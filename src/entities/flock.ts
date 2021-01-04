import {World, Vector, Body} from 'matter-js'
import {FishOptions, FlockOptions} from './options'
import Fish from './fish'

export default class Flock {
	items: Set<Body>
	constructor(
		public options: FlockOptions,
		public fishOptions: (i: number)=> FishOptions
	) {
		console.assert(options.neighbours < options.number, 'Comparison neighbours less than number-1')
		this.items = new Set<Body>();
		for(let i=0; i<options.number; ++i)
			this.items.add(Fish(fishOptions(i), options));
		World.add(options.world, Array.from(this.items));
	}
	clear() {
		World.remove(this.options.world, Array.from(this.items));
	}
	tick(dt: number) {
		var neighbours,
			cd = this.options.comfortDistance,
			vradius = this.options.visibility * this.options.visibility;
		cd = cd * cd;	// we use squared distance
		
		for(let fish of this.items) {
			neighbours = new Array(this.options.neighbours);
			neighbours.fill({
				dist: Infinity,
				fish: null
			});
			// find the `nearest` fish
			for(let comp of this.items) if(comp !== fish) {
				let dist = Vector.magnitudeSquared(Vector.sub(comp.position, fish.position));
				if(dist < vradius) {
					let ndx = findSortIndex(neighbours.map(n=> n.dist), dist);
					if(-1< ndx) {
						neighbours.splice(ndx, 0, {dist, fish: comp});
						neighbours = neighbours.slice(0, this.options.neighbours);
					}
				}
			}
			let ndx = neighbours.findIndex(n=> n.dist === Infinity);
			if(~ndx) neighbours.splice(ndx);
			let baitProx = vradius, nearestBait = null, nbStrength = 0;
			if(this.options.baits)
				for(let baits of this.options.baits)
					for(let bait of baits.items) {
						let dist = Vector.magnitudeSquared(Vector.sub(bait.position, fish.position));
						if(dist < baitProx) {
							baitProx = dist;
							nearestBait = bait;
							nbStrength = baits.strength;
						}
					}
			fish.turn(
				neighbours, cd,
				nearestBait?{
					item: nearestBait,
					strength: nbStrength
				} : null,
				dt);
		}
	}
	static collideBait(bA: any, bB: any) {
		if('Bait'=== bA.label) [bA, bB] = [bB, bA];
		if('Fish'=== bA.label && 'Bait'=== bB.label && bA.flock.baits)
			for(let baits of bA.flock.baits)
				if(baits.items.has(bB)) {
					baits.remove(bB);
					return true;
				}
		return false;
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