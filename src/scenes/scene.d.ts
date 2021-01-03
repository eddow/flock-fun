export interface Scene {
	clear(): void;
	click(x: number, y: number, button: number): void;
	collide(bA: any, bB: any): void;
	tick(dt: number): void;
}