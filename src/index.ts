import {Engine, Render, World, Runner, Bodies, Events} from 'matter-js'
//import './stage/current'
import EmptyScene from './scenes/empty'
//import TestScene from './scenes/test'

// Estimation of ~16:9
const viewWidth = 1536,
	viewHeight = 755,
	wallThick = 50,
	wallOptions = {
		isStatic: true,
		friction: 0,
		restitution: 1,
		label: 'Border walls'
	},
	walls = [
		Bodies.rectangle(viewWidth/2, -wallThick/2, viewWidth, wallThick, wallOptions),
		Bodies.rectangle(viewWidth/2, viewHeight+wallThick/2, viewWidth, wallThick, wallOptions),
		Bodies.rectangle(-wallThick/2, viewHeight/2, wallThick, viewHeight, wallOptions),
		Bodies.rectangle(viewWidth+wallThick/2, viewHeight/2, wallThick, viewHeight, wallOptions)
	],
	world = World.create({
		gravity: {x:0, y:0},
		bounds: {
			min: {x:0, y:0},
			max: {x:viewWidth, y:viewHeight}
		}
	}),
	engine = Engine.create({world}),
	scene = new EmptyScene(world, viewWidth, viewHeight),
	render = Render.create({
		element: document.body,
		engine: engine,
		options: {
			width: viewWidth,
			height: viewHeight,
			wireframes: false
		}
	});

const runner = Runner.create();

World.add(engine.world, walls);
/*

Physics(function(world) {

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
});*/
Events.on(engine, 'collisionStart', function(event) {
	for (var pair of event.pairs) {
		/*if('current-indicator'=== c.bodyA.name)
			world.remove(c.bodyA);
		else if('current-indicator'=== c.bodyB.name)
			world.remove(c.bodyB);
		else*/
			scene.collide(pair.bodyA, pair.bodyB);
	}
});
render.canvas.addEventListener('click', function(event) {
		scene.click(
			event.offsetX * viewWidth/render.canvas.clientWidth,
			event.offsetY * viewHeight/render.canvas.clientHeight
		);
});
Events.on(runner, 'tick', function(evt) {
	scene.tick(evt.source.delta);
});

Runner.run(runner, engine);
Render.run(render);