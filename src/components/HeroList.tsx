'use client';
import { useState, useEffect } from 'react';
import HeroDetailGraph from './HeroDetailGraph';
import { fetchHeroes } from '../services/starWarsApi';
import Image from 'next/image';
import { Hero } from '@/types/starWarsTypes';

// Define the HeroList component
const HeroList: React.FC = () => {
	// Initialize state variables
	const [heroes, setHeroes] = useState<Hero[]>([]); // State to store heroes list
	const [loading, setLoading] = useState(false); // State to manage loading status
	const [hasMore, setHasMore] = useState(true); // State to check if there are more heroes to load
	const [selectedHero, setSelectedHero] = useState<Hero | null>(null); // State to manage the selected hero for details
	const [page, setPage] = useState(1); // State for current page in pagination

	// Function to load heroes for the current page
	const loadHeroes = async () => {
		// Check if already loading or no more heroes to load
		if (loading || !hasMore) return;

		// Set loading status to true
		setLoading(true);

		try {
			// Fetch heroes for the current page
			const newHeroes = await fetchHeroes(page);

			// Check if newHeroes is an array
			if (!Array.isArray(newHeroes)) {
				console.error('Error: newHeroes is not an array');
				setHasMore(false); // Stop pagination if no valid data
				return;
			}

			// Update the heroes list
			setHeroes((prevHeroes) => {
				const updatedHeroes = [...prevHeroes];

				// Check if each new hero already exists in the list
				newHeroes.forEach((hero) => {
					const existingHeroIndex = updatedHeroes.findIndex(
						(h) => h.id === hero.id
					);
					if (existingHeroIndex === -1) {
						updatedHeroes.push(hero);
					}
				});

				return updatedHeroes;
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

	// Function to handle load more button click
	const handleLoadMore = () => {
		setPage((prevPage) => prevPage + 1); // Load more heroes by incrementing the page
	};

	return (
		// Render the hero list component
		<>
			<h1>Star Wars Heroes</h1>
			{/* Render loading message if no heroes have been loaded yet */}
			{heroes.length === 0 ? (
				<p>Loading heroes...</p>
			) : (
				<ul>
					{/* Render a list of heroes, each clickable to show details */}
					{heroes.map((hero, index) => (
						<li
							key={index}
							onClick={() => setSelectedHero(hero)}
						>
							<Image
								src={`https://starwars-visualguide.com/assets/img/characters/${hero.id}.jpg`}
								alt={hero.name}
								width={100}
								height={150}
								style={{ marginRight: '10px' }}
								priority
							/>
							{hero.name}
						</li>
					))}
				</ul>
			)}
			{loading && <p>Loading more heroes...</p>}
			{!hasMore && <p>No more heroes to load</p>}

			{/* Button to load more heroes */}
			<div style={{ marginTop: '20px' }}>
				<button
					onClick={handleLoadMore}
					disabled={!hasMore || loading}
				>
					Load More
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
};

export default HeroList;
