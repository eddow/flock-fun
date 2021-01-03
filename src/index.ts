import {Engine, Render, World, Runner, Bodies, Events} from 'matter-js'
import {Scene} from './scenes/scene'
import EmptyScene from './scenes/empty'
import TestScene from './scenes/test'

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
	scene: Scene = new TestScene(world, viewWidth, viewHeight),
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

Events.on(engine, 'collisionStart', function(event) {
	for (var pair of event.pairs) {
		scene.collide(pair.bodyA, pair.bodyB);
	}
});
render.canvas.addEventListener('mouseup', function(event) {
	scene.click(
		event.offsetX * viewWidth/render.canvas.clientWidth,
		event.offsetY * viewHeight/render.canvas.clientHeight,
		event.button
	);
});
Events.on(runner, 'tick', function(evt) {
	scene.tick(evt.source.delta);
});

Runner.run(runner, engine);
Render.run(render);