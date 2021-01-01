import * as Physics from 'physicsjs'

const distFix = 1;
const velMax = .1;
const angleVelMax = .02;
const pi = Math.PI;
const flapCoolDown = 5;
const maxVFlap = .1;	// Cannot flap if already faster than this

Physics.body('fish', 'circle', function(parent) {
	return {
		init: function(options){
			options.styles = {
				strokeStyle: 'hsla(60, 37%, 17%, 1)',
				lineWidth: 1,
				fillStyle: 'hsla(60, 37%, 57%, 0.8)',
				angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
			};
			parent.init.call(this, options);
			this.fcd = 0;
		},
		turn: function(neighbours: any[], comfortDistance, dt) {
			var scratch = Physics.scratchpad();
			try {
				let pos = this.state.pos,
					temp = scratch.vector(),
					vradius = this.visibility * this.visibility,
					distance = scratch.vector().zero(),
					immitate = scratch.vector().zero();
				for(let n of neighbours) {
					if(n.dist < comfortDistance) {
						temp.clone(pos); temp.vsub(n.fish.state.pos);
						temp.normalize(); temp.mult(comfortDistance/n.dist);
						distance.vadd(temp);
					} else if(n.dist < vradius) {
						temp.clone(pos); temp.vsub(n.fish.state.pos);
						temp.normalize(); temp.mult(-n.dist/comfortDistance);
						distance.vadd(temp);
					}
					temp.clone(n.fish.state.vel);
					if(temp.norm()) {
						temp.normalize();
						immitate.vadd(temp);
					}
				}

				temp.clone(distance);
				let norm = Math.sqrt(temp.norm());
				if(norm) {
					temp.mult(1/norm); 
					let dstFix = Math.min(distFix, norm);
					immitate.normalize();	// norm = 1
					//immitate.mult(1/neighbours.length);	// norm = 1??
					temp.normalize();
					temp.mult(dstFix);
				}
				temp.vadd(immitate);
				temp.mult(velMax);
				if(this.state.vel.normSq()) {
					norm = temp.norm();
					let angle = temp.angle();
					let tangle = this.state.vel.angle();
					if(angle > tangle+pi) angle -= 2*pi;
					if(angle < tangle-pi) angle += 2*pi;
					let maxTurn = /*dt/1000 **/ angleVelMax,
						delta = Math.min(
							Math.abs(angle-tangle),
							maxTurn
						);
					this.fcd -= maxTurn-delta;
					tangle += Math.sign(angle-tangle) * delta;
					this.state.angular.pos = tangle;
					let rotate = scratch.transform();
					rotate.setRotation(tangle);
					temp.set(Math.max(norm, velMax), 0);
					temp.transform(rotate);
				}
				/*if(this.fcd <= 0 && this.state.vel.norm() < maxVFlap) {
					this.fcd = flapCoolDown;
					this.state.acc.clone(temp);
				} else 
					this.state.acc.zero();*/
				this.state.vel.clone(temp);
			} finally {
				scratch.done();
			}
		}
	};
});