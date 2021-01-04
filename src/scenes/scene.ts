import {Vector} from 'matter-js'

export interface Scene {
	clear(): void;
	click(x: number, y: number, button: number): void;
	collide(bA: any, bB: any): void;
	tick(dt: number): void;
}

export interface MinMax<T = number> {
	min: T;
	max: T;
}

export function rangeRand(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function randFish(spawn: MinMax<Vector>, complement: any = {restitution: 1}) {
	return Object.assign({
		x: rangeRand(spawn.min.x, spawn.max.x),
		y: rangeRand(spawn.min.x, spawn.max.y),
		angle: Math.random() * Math.PI * 2
	}, complement);
}