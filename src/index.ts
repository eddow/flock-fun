import * as Physics from 'physicsjs'
import './stage/current'
import EmptyScene from './scenes/empty'
import TestScene from './scenes/test'

// Estimtion of 16:9
const viewWidth = 1536;
const viewHeight = 755;
const renderer = Physics.renderer('canvas', {
    el: 'scene',
    width: viewWidth,
    height: viewHeight,
	autoResize: false,
    meta: false
});

Physics(function(world) {
	const scene = new TestScene(world, viewWidth, viewHeight);

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
			else
				scene.collide(c.bodyA, c.bodyB);
		}
	});

	world.add(renderer);
	world.on('step', function() {
		world.render();
	});

	// `.applyTo([])` to avoid direct dragging of objects
	world.add(Physics.behavior('interactive', {el: 'scene'}).applyTo([]));
	world.on('interact:poke', function(data) {
		scene.click(
			data.x * viewWidth/renderer.el.clientWidth,
			data.y * viewHeight/renderer.el.clientHeight
		);
	});
	var oldTime = 0;
	Physics.util.ticker.on(function(time) {
		if(oldTime) {
			var dt = time-oldTime;
			scene.tick(dt);
		}
		oldTime = time;
		world.step(time);
	});
	// start the ticker
	Physics.util.ticker.start();
});