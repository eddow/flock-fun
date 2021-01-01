import * as Physics from 'physicsjs'
import Flock from './entities/flock'
import Baits from './entities/baits'

const viewWidth = 600;
const viewHeight = 600;
const renderer = Physics.renderer('canvas', {
    el: 'scene',
    width: viewWidth,
    height: viewHeight,
	autoResize: false,
    meta: true, // don't display meta data
});

Physics(function(world) {
	const baits = new Baits(world);
	const flock = new Flock(
		world,
		50,	// nr of fish
		5,
		30, // Where does this fish feel comfortable distant(sq) from others
		()=> ({
			x: Math.random() * viewWidth,
			y: Math.random() * viewHeight,
			angle: Math.random() * Math.PI * 2,
			radius: 5,
			visibility: 100
		}));

	var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
	world.add(Physics.behavior('edge-collision-detection', {
		aabb: viewportBounds,
		restitution: 0.99,
		cof: 0.99
	}));
	world.add(Physics.behavior('body-impulse-response'));

	world.add(renderer);
	world.on('step', function(){
		// Note: equivalent to just calling world.render() after world.step()
		world.render();
	});

	world.add(Physics.behavior('interactive', {el: 'scene'}));
	world.on('interact:poke', function(data){
		baits.add(data.x, data.y);
	});
	Physics.util.ticker.on(function(time) {
		world.step(time);
	});
	// start the ticker
	Physics.util.ticker.start();
});