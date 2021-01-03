import * as Physics from 'physicsjs'

const distFix = 1;
const angleVelMax = .02;
const pi = Math.PI;
const flapCoolDown = 5;
const maxVFlap = .1;	// Cannot flap if already faster than this
const hunger = .1;	// How much it prefers the bait to the group : 0..1

Physics.body('fish', 'circle', function(parent) {
	return {
		init: function(options){
			parent.init.call(this, options);
			this.fcd = 0;
		},
		turn: function(neighbours: any[], comfortDistance, bait: any, dt:number) {
			var scratch = Physics.scratchpad();
			try {
				let pos = this.state.pos,
					velMax = this.velMax,
					temp = scratch.vector(),
					vradius = this.visibility * this.visibility,
					distance = scratch.vector().zero(),
					immitate = scratch.vector().zero();
				console.assert(!isNaN(pos.x) && !isNaN(pos.y));
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
					tangle += Math.sign(angle-tangle) * delta;
					let rotate = scratch.transform();
					rotate.setRotation(tangle);
					temp.set(Math.max(norm, velMax), 0);
					temp.transform(rotate);
				}
				if(bait && bait.state.pos.distSq(this.state.pos) < vradius) {
					distance.clone(bait.state.pos);
					distance.vsub(this.state.pos);
					distance.normalize();
					distance.mult(velMax*hunger*(bait.strength||1));
					temp.mult(1-hunger);
					temp.vadd(distance);
				}
				if(temp.normSq()) {
					let newAngle = temp.angle();
					this.fcd -= Math.abs(this.state.angular.pos - newAngle);
					this.state.angular.pos = newAngle;
					/*let tvel = this.state.vel.norm();
					if((this.fcd <= 0 && tvel < maxVFlap) || !tvel){
						this.fcd = flapCoolDown;
						this.state.acc.clone(temp);
					} else 
						this.state.acc.zero();
					this.state.vel.mult(dt/10);*/
					console.assert(!isNaN(temp.x) && !isNaN(temp.y));
					this.state.vel.clone(temp);
				}
			} catch(x) {
				console.error(x);
			} finally {
				scratch.done();
			}
		}
	};
});