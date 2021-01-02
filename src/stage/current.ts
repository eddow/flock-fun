import * as Physics from 'physicsjs'

const currents: Current[] = [];
const indicatorInterract = 5;	// Distance at which indicators interract with currents
const avgLife = 5;

export default abstract class Current {
	abstract exert(pos: Physics.vector): Physics.vector;
	emit: Physics.vector = null
	absorb: Physics.vector = null
	static add(current: Current): void {
		currents.push(current);
	}
	static clear(): void {
		currents.splice(0);
	}
}

function addIndicator(world: any, center: Physics.vector, radius: number) {
	var scratch = Physics.scratchpad();
	try {
		let calc = scratch.vector();
		let angle = Math.random() * Math.PI * 2;
		calc.clone(center);
		calc.add(radius*Math.cos(angle), radius*Math.sin(angle));
		world.add(
			Physics.body('current-indicator', {
				x: calc.x, y: calc.y, life: (1+Math.random()) * avgLife
			}));
	} catch(x) {
		console.error(x);
	} finally {
		scratch.done();
	}
}

Physics.body('current-indicator', 'point', function(parent) {
	return {
		/*init: function(options){
			parent.init.call(this, options);
		}*/
	};
});

Physics.behavior('currents', function(parent) {
    return {
		/*init: function(options){
			parent.init.call(this, options);
			this.baits = option.baits;
		},*/
        behave: function(data) {
            var bodies = this.getTargets();
			
			var scratch = Physics.scratchpad();
			try {
				let calc = scratch.vector();
				for(let item of bodies) {
					if('current-indicator'=== item.name) { 
						item.state.vel.mult(.95);
						if((item.life -= data.dt/1000) <=0)
							this._world.remove(item);
						else for(let current of currents) {
							if(current.absorb) {
								calc.clone(current.absorb);
								calc.vsub(item.state.pos);
								if(calc.norm() < indicatorInterract) {
									this._world.remove(item);
									break;
								}
							}
							item.state.vel.vadd(current.exert(item.state.pos))
						}
					} else {
						item.state.acc.zero();
						for(let current of currents) {
							item.state.acc.vadd(current.exert(item.state.pos).mult(1/item.moi))
						}
					}
				}
				for(let current of currents) {
					if(current.emit && Math.random() < .2)
						addIndicator(this._world, current.emit, indicatorInterract);
					if(current.absorb && Math.random() < .2)
						addIndicator(this._world, current.absorb, current.radius-1);
				}
			} catch(x) {
				console.error(x);
			} finally {
				scratch.done();
			}
        }
    };
});