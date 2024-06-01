export function tokenGenerator(): string {
	// return Math.random().toString(36).substring(2, 9);
	return Math.floor(1000000000000000 + Math.random() * 9000000000000000)
		.toString(36)
		.substring(0, 10);
}
