'use client';
import { useState, useEffect } from 'react';
import { fetchHeroes } from '../services/starWarsApi'; // API function to fetch heroes
import HeroDetailGraph from '../components/HeroDetailGraph'; // Component to visualize hero details in a graph

export default function HomePage() {
	const [heroes, setHeroes] = useState<any[]>([]); // State to store heroes list
	const [loading, setLoading] = useState(false); // State to manage loading status
	const [hasMore, setHasMore] = useState(true); // State to check if there are more heroes to load
	const [selectedHero, setSelectedHero] = useState<any | null>(null); // State to manage the selected hero for details
	const [page, setPage] = useState(1); // State for current page in pagination

	// Function to load heroes for the current page
	const loadHeroes = async () => {
		if (loading || !hasMore) return; // Exit if already loading or no more heroes to load

		setLoading(true); // Set loading status to true
		try {
			const newHeroes = await fetchHeroes(page); // Fetch heroes for the current page
			setHeroes((prevHeroes) => {
				if (newHeroes.length === 0) {
					setHasMore(false); // If no new heroes, stop pagination
					return prevHeroes;
				}
				return [...prevHeroes, ...newHeroes]; // Append new heroes to the list
			});
		} catch (error) {
			console.error('Error loading heroes:', error); // Handle errors
		} finally {
			setLoading(false); // Stop loading
		}
	};

	// Trigger loadHeroes on page change
	useEffect(() => {
		loadHeroes();
	}, [page]);

	return (
		<>
			<h1>Star Wars Heroes</h1>
			{/* Render loading message if no heroes have been loaded yet */}
			{heroes.length === 0 ? (
				<p>Loading heroes...</p>
			) : (
				<ul>
					{/* Render a list of heroes, each clickable to show details */}
					{heroes.map((hero) => (
						<li
							key={hero.id}
							onClick={() => setSelectedHero(hero)}
						>
							{hero.name}
						</li>
					))}
				</ul>
			)}
			{loading && <p>Loading more heroes...</p>}
			{!hasMore && <p>No more heroes to load</p>}

			{/* Pagination buttons to navigate between pages */}
			<div style={{ marginTop: '20px' }}>
				<button
					onClick={() => setPage((prevPage) => prevPage - 1)}
					disabled={page === 1}
				>
					Previous
				</button>
				<button
					onClick={() => setPage((prevPage) => prevPage + 1)}
					disabled={!hasMore || loading}
				>
					Next
				</button>
			</div>

			{/* Render hero details graph when a hero is selected */}
			{selectedHero && (
				<div>
					<h2>Hero Details</h2>
					<HeroDetailGraph heroId={selectedHero.id} />
				</div>
			)}
		</>
	);
}
