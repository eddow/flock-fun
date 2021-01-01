import * as Physics from 'physicsjs'
import Flock from './entities/flock'

const viewWidth = 600;
const viewHeight = 600;
const renderer = Physics.renderer('canvas', {
    el: 'scene',
    width: viewWidth,
    height: viewHeight,
	autoResize: false,
    meta: true, // don't display meta data
    styles: {
        // set colors for the circle bodies
        'circle' : {
            strokeStyle: 'hsla(60, 37%, 17%, 1)',
            lineWidth: 1,
            fillStyle: 'hsla(60, 37%, 57%, 0.8)',
            angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
        }
    }
});


Physics(function(world) {
	new Flock(world, 5, 2, ()=> ({
		x: Math.random() * viewWidth,
		y: Math.random() * viewHeight,
		angle: Math.random() * Math.PI * 2,
		radius: 10,
		comfortDistance: 1600		// Where does this fish feel comfortable distant(sq) from others
	}));
	
	var gravity = Physics.behavior('constant-acceleration', {
		acc: { x : 0, y: 0.0004 } // this is the default
	});
	//world.add(gravity);
	gravity.setAcceleration({ x: 0, y: 0.0004 });

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

	Physics.util.ticker.on(function(time){
		world.step(time);
	});
	// start the ticker
	Physics.util.ticker.start();
});