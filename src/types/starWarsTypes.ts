// Define the structure of a Hero
export interface Hero {
	id: number;
	name: string;
	height: string;
	mass: string;
	hair_color: string;
	skin_color: string;
	eye_color: string;
	birth_year: string;
	gender: string;
	homeworld: number;
	films: number[]; // Array of film IDs
	species: number[]; // Array of species IDs
	vehicles: number[]; // Array of vehicle IDs
	starships: number[]; // Array of starship IDs
	created: string;
	edited: string;
	url: string;
}

// Define the structure of HeroDetail
export interface HeroDetail {
	id: number;
	name: string;
	height: string;
	mass: string;
	hair_color: string;
	skin_color: string;
	eye_color: string;
	birth_year: string;
	gender: string;
	homeworld: string;
	films: number[]; // Array of film IDs
	starships: number[]; // Array of starship IDs
	vehicles: number[]; // Array of vehicle IDs
}

// Define the structure of Films
export interface Film {
	id: number;
	title: string;
	episode_id: number;
	opening_crawl: string;
	director: string;
	producer: string;
	release_date: string;
	characters: string[]; // Array of character URLs
	starships: string[]; // Array of starship URLs
	vehicles: string[]; // Array of vehicle URLs
	species: string[]; // Array of species URLs
	planets: string[]; // Array of planet URLs
	created: string;
	edited: string;
	url: string;
}

// Define the structure of Starships
export interface Starship {
	id: number;
	name: string;
	model: string;
	manufacturer: string;
	cost_in_credits: string;
	length: string;
	max_atmosphering_speed: string;
	crew: string;
	passengers: string;
	cargo_capacity: string;
	consumables: string;
	hyperdrive_rating: string;
	MGLT: string;
	starship_class: string;
	pilots: string[]; // Array of pilot URLs
	films: string[]; // Array of film URLs
	created: string;
	edited: string;
	url: string;
}

// Define the structure of Vehicles
export interface Vehicle {
	id: number;
	name: string;
	model: string;
	vehicle_class: string;
	manufacturer: string;
	length: string;
	cost_in_credits: string;
	crew: string;
	passengers: string;
	max_atmosphering_speed: string;
	cargo_capacity: string;
	consumables: string;
}
