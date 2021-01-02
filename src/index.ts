import * as Physics from 'physicsjs'
import Flock from './entities/flock'
import Baits from './entities/baits'
import Current from './stage/current'
import Source from './stage/source'
import Well from './stage/well'

const viewWidth = 1000;
const viewHeight = 700;
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
		6,	// nr of neighbours considered
		30, // Where does this fish feel comfortable distant from others
		baits,
		()=> ({
			x: Math.random() * viewWidth,
			y: Math.random() * viewHeight,
			angle: Math.random() * Math.PI * 2,
			radius: 5,
			velMax: .1,
			styles: {
				strokeStyle: 'hsla(60, 37%, 17%, 1)',
				lineWidth: 1,
				fillStyle: 'hsla(60, 37%, 57%, 0.8)',
				angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
			},
			visibility: 150
		}));
	const counterFlock = new Flock(
		world,
		20,	// nr of fish
		6,	// nr of neighbours considered
		50, // Where does this fish feel comfortable distant from others
		null,
		()=> ({
			x: Math.random() * viewWidth,
			y: Math.random() * viewHeight,
			angle: Math.random() * Math.PI * 2,
			radius: 10,
			velMax: .15,
			styles: {
				strokeStyle: 'hsla(0, 37%, 17%, 1)',
				lineWidth: 1,
				fillStyle: 'hsla(0, 37%, 57%, 0.8)',
				angleIndicator: 'hsla(0, 37%, 17%, 0.4)'
			},
			visibility: 150
		}));

	Current.add(new Source(Physics.vector(100, 100), 300, .5));
	Current.add(new Well(Physics.vector(400, 400), 300, .5));

	let ball = Physics.body('circle', {
		x: 300, y: 300, radius: 50, mass: 50,
		styles: {
			strokeStyle: 'hsla(140, 37%, 17%, 1)',
			lineWidth: 1,
			fillStyle: 'hsla(140, 37%, 57%, 0.8)',
		}
	});
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

	world.add(Physics.behavior('currents'));

	world.on('collisions:detected', function(data) {
		var c, bB, bF;
		for (var i = 0, l = data.collisions.length; i < l; i++){
			c = data.collisions[ i ];
			if('current-indicator'=== c.bodyA.name)
				world.remove(c.bodyA);
			else if('current-indicator'=== c.bodyB.name)
				world.remove(c.bodyB);
			else {
				if('fish'=== c.bodyA.name) { bF = c.bodyA; bB = c.bodyB; }
				else { bF = c.bodyB; bB = c.bodyA; }
				if('fish'=== bF.name && 'bait'=== bB.name) {
					//bF.something
					// TODO: instead: decay(K*data.overlap) ?
					// TODO: Only eat your bait? (cf. counter-flock)
					baits.remove(bB);
				}
			}
		}
	});

	world.add(renderer);
	world.on('step', function() {
		world.render();
	});

	// `.applyTo([])` to avoid direct dragging of objects
	world.add(Physics.behavior('interactive', {el: 'scene'}).applyTo([]));
	world.on('interact:poke', function(data) {
		baits.add(data.x, data.y);
	});
	/*world.on('beforeRender', function(data) {
		baits.refreshViews();
	});*/
	var oldTime = 0;
	Physics.util.ticker.on(function(time) {
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