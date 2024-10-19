const API_BASE_URL = 'https://sw-api.starnavi.io';

// Fetches a list of heroes with pagination support
export const fetchHeroes = async (page: number, pageSize: number = 10) => {
	try {
		// API call to fetch heroes with pagination
		const response = await fetch(
			`https://sw-api.starnavi.io/people/?page=${page}&page_size=${pageSize}`
		);
		const data = await response.json();
		return data.results; // Returns array of heroes
	} catch (error) {
		console.error('Error fetching heroes:', error);
		return [];
	}
};

// Fetches detailed information for a specific hero
export const fetchHeroDetails = async (heroId: number) => {
	try {
		// API call to fetch hero details by heroId
		const response = await fetch(
			`https://sw-api.starnavi.io/people/${heroId}/`
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(`Error fetching details for hero ${heroId}:`, error);
		throw new Error(`Failed to fetch details for hero ${heroId}`);
	}
};

// Fetch film data
const fetchFilm = async (filmId: number) => {
	const response = await fetch(`${API_BASE_URL}/films/${filmId}`);
	if (!response.ok) {
		throw new Error(`Film with ID ${filmId} not found`);
	}
	return await response.json();
};

// Fetch starship data
const fetchStarship = async (starshipId: number) => {
	const response = await fetch(`${API_BASE_URL}/starships/${starshipId}`);
	if (!response.ok) {
		throw new Error(`Starship with ID ${starshipId} not found`);
	}
	return await response.json();
};

// Fetch vehicle data
const fetchVehicle = async (vehicleId: number) => {
	const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`);
	if (!response.ok) {
		throw new Error(`Vehicle with ID ${vehicleId} not found`);
	}
	return await response.json();
};
