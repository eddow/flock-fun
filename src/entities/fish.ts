import * as Physics from 'physicsjs'

const distFix = 1;
const velMax = .1;
const angleVelMax = .02;
const pi = Math.PI;

Physics.body('fish', 'circle', function(parent) {
	return {
		init: function(options){
			parent.init.call(this, options);
		},
		turn: function(neighbours: any[]) {
			var scratch = Physics.scratchpad();
			try {
				let comfortDistance = this.comfortDistance,
					pos = this.state.pos,
					temp = scratch.vector(),
					distance = scratch.vector().zero(),
					immitate = scratch.vector().zero();
				for(let n of neighbours) {
					if(n.dist < comfortDistance) {
						temp.clone(pos); temp.vsub(n.fish.state.pos);
						temp.normalize(); temp.mult(comfortDistance/n.dist);
						distance.vadd(temp);
					} else if(n.dist > comfortDistance) {
						temp.clone(pos); temp.vsub(n.fish.state.pos);
						temp.normalize(); temp.mult(-n.dist/comfortDistance);
						distance.vadd(temp);
					}
					temp.clone(n.fish.state.vel);
					temp.normalize();
					immitate.vadd(temp);
				}

				temp.clone(distance);
				let norm = Math.sqrt(temp.norm());
				temp.mult(1/norm); 
				let dstFix = Math.min(distFix, norm);
				immitate.mult(1/neighbours.length);	// norm = 1
				//temp.vadd(attraction);
				temp.normalize();
				temp.mult(dstFix);
				temp.vadd(immitate);
				temp.mult(velMax);
				if(this.state.vel.normSq()) {
					norm = temp.norm();
					let angle = temp.angle();
					let tangle = this.state.vel.angle();
					if(angle > tangle+pi) angle -= 2*pi;
					if(angle < tangle-pi) angle += 2*pi;
					tangle += Math.sign(angle-tangle) * Math.min(Math.abs(angle-tangle), angleVelMax);
					let rotate = scratch.transform();
					rotate.setRotation(tangle);
					temp.set(norm, 0);
					temp.transform(rotate);
				}
				this.state.vel.clone(temp);
			} finally {
				scratch.done();
			}
			this.state.angular.pos = this.state.vel.angle();
		}
	};
});