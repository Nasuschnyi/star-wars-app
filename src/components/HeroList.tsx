'use client';
import { Hero } from '../types/starWarsTypes';
import { useState, useEffect } from 'react';
import HeroDetailGraph from './HeroDetailGraph';
import { fetchHeroes, fetchHeroDetails } from '../services/starWarsApi';

const HeroList: React.FC = () => {
	const [heroes, setHeroes] = useState<Hero[]>([]);
	const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
	const [heroDetail, setHeroDetail] = useState<any>(null);
	const [page, setPage] = useState(1); // Track the page for infinite scroll
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true); // To track if there's more data

	// Function to handle hero click and fetch its details
	const handleHeroClick = async (hero: Hero) => {
		setSelectedHero(hero);
		const details = await fetchHeroDetails(hero.id); // Fetch hero details by ID
		setHeroDetail(details); // Store the details
	};

	// Fetch heroes when page changes or when the component mounts
	const fetchHeroList = async () => {
		if (loading) return; // Prevent multiple fetches while loading
		setLoading(true);
		try {
			const newHeroes = await fetchHeroes(page);
			if (newHeroes.length > 0) {
				setHeroes((prev) => [...prev, ...newHeroes]); // Append new heroes to the list
			} else {
				setHasMore(false); // No more heroes available
			}
		} catch (error: any) {
			console.error('Failed to fetch heroes:', error.message);
		} finally {
			setLoading(false);
		}
	};

	// Trigger fetching when component mounts and on page change
	useEffect(() => {
		fetchHeroList();
	}, [page]);

	// Handle infinite scroll logic
	const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
		const target = event.target as HTMLDivElement; // Cast event.target to HTMLDivElement
		const bottom =
			target.scrollHeight === target.scrollTop + target.clientHeight;
		if (bottom && hasMore && !loading) {
			setPage((prev) => prev + 1); // Increment page when user scrolls to the bottom
		}
	};

	if (heroes.length === 0) {
		return <p>Loading heroes...</p>;
	}

	return (
		<div
			style={{ maxHeight: '500px', overflowY: 'auto' }}
			onScroll={handleScroll} // Attach scroll handler
		>
			<ul>
				{heroes.map((hero) => (
					<li
						key={hero.id}
						onClick={() => handleHeroClick(hero)}
						style={{ cursor: 'pointer', margin: '10px 0' }}
					>
						{hero.name}
					</li>
				))}
			</ul>
			{loading && <p>Loading more heroes...</p>}
			{/* Pass hero details correctly */}
			{selectedHero && heroDetail && (
				<HeroDetailGraph heroId={selectedHero.id} />
			)}
		</div>
	);
};

export default HeroList;
