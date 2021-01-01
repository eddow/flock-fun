import * as Physics from 'physicsjs'
import Flock from './entities/flock'
import Baits from './entities/baits'

const viewWidth = 900;
const viewHeight = 900;
const renderer = Physics.renderer('canvas', {
    el: 'scene',
    width: viewWidth,
    height: viewHeight,
	autoResize: false,
    meta: false
});

Physics(function(world) {
	const baits = new Baits(world);
	const flock = new Flock(
		world,
		50,	// nr of fish
		5,
		30, // Where does this fish feel comfortable distant(sq) from others
		baits,
		()=> ({
			x: Math.random() * viewWidth,
			y: Math.random() * viewHeight,
			angle: Math.random() * Math.PI * 2,
			radius: 5,
			visibility: 150
		}));

	let ball = Physics.body('circle', {
		x: 300, y: 300, radius: 50, mass: 50,
		styles: {
			strokeStyle: 'hsla(140, 37%, 17%, 1)',
			lineWidth: 1,
			fillStyle: 'hsla(140, 37%, 57%, 0.8)',
		}
	});
	ball.cof = 0.5;
	world.add(ball);

	var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
	world.add(Physics.behavior('edge-collision-detection', {
		aabb: viewportBounds,
		restitution: 0.99,
		cof: 0.99
	}));
	world.add(Physics.behavior('body-collision-detection'));
	world.add(Physics.behavior('sweep-prune'));
	world.add(Physics.behavior('body-impulse-response'));

	world.on('collisions:detected', function(data) {
		var c, bB, bF;
		for (var i = 0, l = data.collisions.length; i < l; i++){
			c = data.collisions[ i ];

			if('fish'=== c.bodyA.name) { bF = c.bodyA; bB = c.bodyB; }
			else { bF = c.bodyB; bB = c.bodyA; }
			if('fish'=== bF.name && 'bait'=== bB.name) {
				//bF.something
				// TODO: instead: decay(K*data.overlap) ?
				baits.remove(bB);
			}
		}
	});

	world.add(renderer);
	world.on('step', function(){
		world.render();
	});

	world.add(Physics.behavior('interactive', {el: 'scene'}));
	world.on('interact:poke', function(data){
		baits.add(data.x, data.y);
	});
	var oldTime = 0;
	Physics.util.ticker.on(function(time){
		if(oldTime) {
			var dt = time-oldTime;
			baits.decay(dt);
		}
		oldTime = time;
		world.step(time);
	});
	// start the ticker
	Physics.util.ticker.start();
});