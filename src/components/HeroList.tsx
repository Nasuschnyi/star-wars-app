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

			// If there are no more heroes, update hasMore to false
			if (newHeroes.length === 0) {
				setHasMore(false);
			} else {
				// Update the heroes list
				setHeroes((prevHeroes) => {
					const updatedHeroes = [...prevHeroes];

					// Add only new heroes that don't already exist in the list
					newHeroes.forEach((hero) => {
						if (!updatedHeroes.some((h) => h.id === hero.id)) {
							updatedHeroes.push(hero);
						}
					});

					return updatedHeroes;
				});
			}
		} catch (error) {
			console.error('Error loading heroes:', error); // Handle errors
			setHasMore(false); // Disable further loading if there's an error
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

	// Function to reset the selected hero
	const resetSelectedHero = () => {
		setSelectedHero(null);
	};

	return (
		// Render the hero list component
		<main className="hero">
			<h1 className="title">Star Wars Heroes</h1>
			{/* Render loading message if no heroes have been loaded yet */}
			{heroes.length === 0 ? (
				<p className="loading">Loading heroes...</p>
			) : (
				<ul className="hero-list">
					{/* Render a list of heroes, each clickable to show details */}
					{heroes.map((hero, id) => (
						<li
							className="hero-item"
							key={id}
							onClick={() => setSelectedHero(hero)}
						>
							<figure className="hero-figure">
								<Image
									className="hero-image"
									src={`https://starwars-visualguide.com/assets/img/characters/${hero.id}.jpg`}
									alt={hero.name}
									width={240}
									height={330}
									priority
								/>
								<figcaption className="hero-name">
									{hero.name}
								</figcaption>
							</figure>
						</li>
					))}
				</ul>
			)}
			{loading && <p className="loading">Loading more heroes...</p>}
			{!hasMore && (
				<p className="loading no-more">No more heroes to load</p>
			)}

			{/* Button to load more heroes */}
			<button
				className="btn"
				onClick={handleLoadMore}
				disabled={!hasMore || loading}
			>
				load more
			</button>

			{/* Render hero details graph when a hero is selected */}
			{selectedHero && (
				<section className="hero-details">
					<button
						className="btn reset"
						onClick={resetSelectedHero}
					>
						&#10005;
					</button>
					<HeroDetailGraph heroId={selectedHero.id} />
				</section>
			)}
		</main>
	);
};

export default HeroList;
