import {World} from 'matter-js'

export interface FishOptions {
	x: number
	y: number
	angle: number
}

export interface FlockOptions {
	world: World
	number: number
	neighbours: number
	comfortDistance: number
	baits: any//: Baits
	radius: number
	color: string
	visibility: number
	velocity: number
}