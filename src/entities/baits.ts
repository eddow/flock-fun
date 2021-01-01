import * as Physics from 'physicsjs'

Physics.body('bait', 'circle', function(parent) {
	return {
		init: function(options){
			options.styles = {
				strokeStyle: 'hsla(0, 37%, 17%, 1)',
				lineWidth: 1,
				fillStyle: 'hsla(0, 37%, 57%, 1)',
			};
			options.radius = 3;
			parent.init.call(this, options);
		}
	};
});

export default class Baits {
	items: any[] = []
	behavior: any
	constructor(private world:any) {
		world.add(this.behavior = Physics.behavior('bait-decay', {baits: this.items}));
	}
	add(x: number, y: number) {
		let bait = Physics.body('bait', {x, y});
		this.items.push(bait);
		this.world.add(bait);
	}
}

Physics.behavior('bait-decay', function(parent) {
    return {
        behave: function(data) {
            var baits = this.options.baits;
			
            for(let i=0; i<baits.length; i++) {
            }
        }
    };
});