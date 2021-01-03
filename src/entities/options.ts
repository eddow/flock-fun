import {World} from 'matter-js'
import Baits from './baits'

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
	baits?: Baits
	radius: number
	color: string
	visibility: number
	velocity: number
}