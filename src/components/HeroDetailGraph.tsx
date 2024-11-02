// Full component with improvements for hover and image loading issues

'use client';
import { useEffect, useState } from 'react';
import ReactFlow, { MiniMap, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import Image from 'next/image';
import {
	fetchHeroDetails,
	fetchFilm,
	fetchStarship,
} from '../services/starWarsApi';
import { Film, Starship } from '@/types/starWarsTypes';

// Define the props for the HeroDetailGraph component
interface HeroDetailGraphProps {
	heroId: number;
}
// Component to render hero details in a graph using React Flow
const HeroDetailGraph: React.FC<HeroDetailGraphProps> = ({ heroId }) => {
	// Initialize state for nodes and edges
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [hoveredItem, setHoveredItem] = useState<Film | Starship | null>(
		null
	);
	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);

	// Fetch data when the component mounts or the heroId changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch hero details based on heroId
				const hero = await fetchHeroDetails(heroId);
				if (!hero) throw new Error('Hero not found');
				// Create hero node with image and details
				const heroImage = (
					<figure className="hero-details-image">
						<Image
							src={`https://starwars-visualguide.com/assets/img/characters/${heroId}.jpg`}
							alt={hero.name}
							width={120}
							height={165}
							priority
							unoptimized
							onError={({ currentTarget }) => {
								currentTarget.onerror = null; // Prevents infinite loop
								currentTarget.src =
									'https://starwars-visualguide.com/assets/img/big-placeholder.jpg'; // Fallback image
							}}
						/>
						<ul className="hero-details-list">
							<li>
								<strong>{hero.name}</strong>
							</li>
							<li>{`Birth Year: ${hero.birth_year}`}</li>
							<li>{`Gender: ${hero.gender}`}</li>
							<li>{`Height: ${hero.height} cm`}</li>
							<li>{`Mass: ${hero.mass} kg`}</li>
							<li>{`Hair Color: ${hero.hair_color}`}</li>
							<li>{`Eye Color: ${hero.eye_color}`}</li>
							<li>{`Skin Color: ${hero.skin_color}`}</li>
						</ul>
					</figure>
				);

				const heroNode: Node = {
					id: `hero-${hero.id}`,
					data: { label: heroImage }, // Assign the heroImage here
					position: { x: 0, y: 0 },
					style: { whiteSpace: 'pre-wrap', width: 'fit-content' },
				};
				// Create film nodes
				const filmNodes: Node[] = await Promise.all(
					hero.films.map(async (filmId: number, index: number) => {
						const film = await fetchFilm(filmId);
						return {
							id: `film-${filmId}`,
							data: {
								label: (
									<figure
										className="hero-details-image content"
										onMouseEnter={(e) =>
											handleHover(film, e)
										}
										onMouseLeave={clearTooltip}
									>
										<Image
											src={`https://starwars-visualguide.com/assets/img/films/${filmId}.jpg`}
											alt={film.title}
											width={120}
											height={165}
											priority
											unoptimized
											onError={({ currentTarget }) => {
												currentTarget.onerror = null;
												currentTarget.src =
													'https://starwars-visualguide.com/assets/img/big-placeholder.jpg';
											}}
										/>
										<figcaption className="content-caption">
											{film.title}
										</figcaption>
									</figure>
								),
							},
							position: { x: 200 * (index + 0.5), y: 200 },
							style: { width: 'fit-content' },
						};
					})
				);
				// Create starship nodes
				const starshipNodes: Node[] = await Promise.all(
					hero.starships.map(
						async (starshipId: number, index: number) => {
							const starship = await fetchStarship(starshipId);
							return {
								id: `starship-${starshipId}`,
								data: {
									label: (
										<figure
											className="hero-details-image content"
											onMouseEnter={(e) =>
												handleHover(starship, e)
											}
											onMouseLeave={clearTooltip}
										>
											<Image
												src={`https://starwars-visualguide.com/assets/img/starships/${starshipId}.jpg`}
												alt={starship.name}
												width={120}
												height={165}
												priority
												unoptimized
												onError={({
													currentTarget,
												}) => {
													currentTarget.onerror =
														null;
													currentTarget.src =
														'https://starwars-visualguide.com/assets/img/big-placeholder.jpg';
												}}
											/>
											<figcaption className="content-caption">
												{starship.name}
											</figcaption>
										</figure>
									),
								},
								position: { x: 200 * (index + 1), y: 430 },
								style: { width: 'fit-content' },
							};
						}
					)
				);
				// Create edges
				const filmEdges: Edge[] = hero.films.map((filmId: number) => ({
					id: `edge-hero-${hero.id}-film-${filmId}`,
					source: `hero-${hero.id}`,
					target: `film-${filmId}`,
				}));

				const starshipEdges: Edge[] = hero.starships.map(
					(starshipId: number) => ({
						id: `edge-hero-${hero.id}-starship-${starshipId}`,
						source: `hero-${hero.id}`,
						target: `starship-${starshipId}`,
					})
				);
				// Set nodes and edges
				setNodes([heroNode, ...filmNodes, ...starshipNodes]);
				setEdges([...filmEdges, ...starshipEdges]);
			} catch (error) {
				console.error('Error fetching hero details:', error);
			}
		};

		fetchData();
	}, [heroId]);

	const handleHover = (item: Film | Starship, event: React.MouseEvent) => {
		setHoveredItem(item);
		setTooltipPosition({ x: event.clientX, y: event.clientY });
	};

	const clearTooltip = () => {
		setHoveredItem(null);
		setTooltipPosition(null);
	};

	return (
		<article className="hero-details-graph">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				style={{ cursor: 'grab' }}
			>
				<MiniMap
					maskColor={'#bebebe'}
					nodeStrokeColor={'#ece7e1'}
					nodeColor={'#373737'}
					nodeBorderRadius={14}
					pannable
					zoomable
				/>
				<Controls showFitView />
			</ReactFlow>

			{hoveredItem && tooltipPosition && (
				<article
					className="tooltip"
					style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
				>
					{hoveredItem.hasOwnProperty('title') ? (
						<ul>
							<h3>{(hoveredItem as Film).title}</h3>
							<li>
								<strong>Episode:</strong>{' '}
								{(hoveredItem as Film).episode_id}
							</li>
							<li>
								<strong>Director:</strong>{' '}
								{(hoveredItem as Film).director}
							</li>
							<li>
								<strong>Release Date:</strong>{' '}
								{(hoveredItem as Film).release_date}
							</li>
						</ul>
					) : (
						<ul>
							<h3>{(hoveredItem as Starship).name}</h3>
							<li>
								<strong>Model:</strong>{' '}
								{(hoveredItem as Starship).model}
							</li>
							<li>
								<strong>Manufacturer:</strong>{' '}
								{(hoveredItem as Starship).manufacturer}
							</li>
							<li>
								<strong>Cost:</strong>{' '}
								{(hoveredItem as Starship).cost_in_credits}
							</li>
						</ul>
					)}
				</article>
			)}
		</article>
	);
};

export default HeroDetailGraph;
