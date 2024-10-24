// Base URL for the Star Wars API
const API_BASE_URL = 'https://sw-api.starnavi.io';

// General function to check the response from the API
const checkResponse = async (response: Response, resourceName: string) => {
	if (!response.ok) {
		throw new Error(`${resourceName} not found: ${response.statusText}`);
	}
	return await response.json();
};

// Fetches a list of heroes with pagination support
export const fetchHeroes = async (page: number, pageSize: number = 10) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/people/?page=${page}&page_size=${pageSize}`
		);
		const data = await checkResponse(response, 'Heroes');
		return data.results || []; // Ensure only the heroes array is returned
	} catch (error) {
		console.error('Error fetching heroes:', error);
		return [];
	}
};

// Fetches detailed information for a specific hero
export const fetchHeroDetails = async (heroId: number) => {
	try {
		const response = await fetch(`${API_BASE_URL}/people/${heroId}/`);
		return await checkResponse(response, `Hero ${heroId}`);
	} catch (error) {
		console.error(`Error fetching details for hero ${heroId}:`, error);
		throw new Error(`Failed to fetch details for hero ${heroId}`);
	}
};

// Fetch film data
export const fetchFilm = async (filmId: number) => {
	try {
		const response = await fetch(`${API_BASE_URL}/films/${filmId}`);
		return await checkResponse(response, `Film ${filmId}`);
	} catch (error) {
		console.error(`Error fetching film with ID ${filmId}:`, error);
		throw error;
	}
};

/* export async function fetchFilm(id: number) {
	try {
		const response = await fetch(`https://swapi.dev/api/films/${id}`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(`Error fetching film with ID ${id}:`, error);
		throw error;
	}
} */

// Fetch starship data
export const fetchStarship = async (starshipId: number) => {
	try {
		const response = await fetch(`${API_BASE_URL}/starships/${starshipId}`);
		return await checkResponse(response, `Starship ${starshipId}`);
	} catch (error) {
		console.error(`Error fetching starship with ID ${starshipId}:`, error);
		throw error;
	}
};

// Fetch vehicle data
export const fetchVehicle = async (vehicleId: number) => {
	try {
		const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`);
		return await checkResponse(response, `Vehicle ${vehicleId}`);
	} catch (error) {
		console.error(`Error fetching vehicle with ID ${vehicleId}:`, error);
		throw error;
	}
};
