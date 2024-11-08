'use client';
import { useEffect, useRef, useState } from 'react';
import ReactFlow, {
	MiniMap,
	Controls,
	Node,
	Edge,
	ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Image from 'next/image';
import {
	fetchHeroDetails,
	fetchFilm,
	fetchStarship,
	fetchVehicle,
} from '../services/starWarsApi';
import { Film, Starship, Vehicle } from '@/types/starWarsTypes';

// Define the props for the HeroDetailGraph component
interface HeroDetailGraphProps {
	heroId: number;
}
// Component to render hero details in a graph using React Flow
const HeroDetailGraph: React.FC<HeroDetailGraphProps> = ({ heroId }) => {
	// Initialize state for nodes and edges
	const [nodes, setNodes] = useState<Node[]>([]); // State to manage nodes
	const [edges, setEdges] = useState<Edge[]>([]); // State to manage edges
	const [hoveredItem, setHoveredItem] = useState<
		Film | Starship | Vehicle | null
	>(null); // State to manage the hovered item

	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number;
		y: number;
	} | null>(null); // State to manage the position of the tooltip
	const [loading, setLoading] = useState(true); // State to manage loading status
	const [isInitialized, setIsInitialized] = useState(false); // State to track if the graph has been initialized
	const reactFlowInstance = useRef<ReactFlowInstance | null>(null); // Reference to the ReactFlow instance

	// Fetch data when the component mounts or the heroId changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Set loading status to true
				setLoading(true);
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
					style: {
						borderRadius: '0.5rem',
						width: 'fit-content',
						background: '#ece7e1',
					},
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
							style: {
								borderRadius: '0.5rem',
								background: '#ece7e1',
							},
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
								style: {
									borderRadius: '0.5rem',
									background: '#ece7e1',
								},
							};
						}
					)
				);
				// Create vehicle nodes
				const vehicleNodes: Node[] = await Promise.all(
					hero.vehicles.map(
						async (vehicleId: number, index: number) => {
							const vehicle = await fetchVehicle(vehicleId);
							return {
								id: `vehicle-${vehicleId}`,
								data: {
									label: (
										<figure
											className="hero-details-image content"
											onMouseEnter={(e) =>
												handleHover(vehicle, e)
											}
											onMouseLeave={clearTooltip}
										>
											<Image
												src={`https://starwars-visualguide.com/assets/img/vehicles/${vehicleId}.jpg`}
												alt={vehicle.name}
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
												{vehicle.name}
											</figcaption>
										</figure>
									),
								},
								position: { x: 300 * (index + 1), y: 660 },
								style: {
									borderRadius: '0.5rem',
									background: '#ece7e1',
								},
							};
						}
					)
				);

				// Create film edges
				const filmEdges: Edge[] = hero.films.map((filmId: number) => ({
					id: `edge-hero-${hero.id}-film-${filmId}`,
					source: `hero-${hero.id}`,
					target: `film-${filmId}`,
				}));
				// Create starship edges
				const starshipEdges: Edge[] = hero.starships.map(
					(starshipId: number) => ({
						id: `edge-hero-${hero.id}-starship-${starshipId}`,
						source: `hero-${hero.id}`,
						target: `starship-${starshipId}`,
					})
				);
				// Create vehicle edges
				const vehicleEdges: Edge[] = hero.vehicles.map(
					(vehicleId: number) => ({
						id: `edge-hero-${hero.id}-vehicle-${vehicleId}`,
						source: `hero-${hero.id}`,
						target: `vehicle-${vehicleId}`,
					})
				);
				// Set nodes and edges
				setNodes([
					heroNode,
					...filmNodes,
					...starshipNodes,
					...vehicleNodes,
				]);
				setEdges([...filmEdges, ...starshipEdges, ...vehicleEdges]);
				// Set loading status to false
				setLoading(false);
				// Allow ReactFlow to adjust offscreen, then show it
				setTimeout(() => setIsInitialized(true), 50);
			} catch (error) {
				console.error('Error fetching hero details:', error);
				setLoading(false); // Set loading status to false in case of error
			}
		};

		fetchData();
	}, [heroId]);

	const handleHover = (
		item: Film | Starship | Vehicle,
		event: React.MouseEvent
	) => {
		setHoveredItem(item);
		setTooltipPosition({ x: event.clientX, y: event.clientY });
	};

	const clearTooltip = () => {
		setHoveredItem(null);
		setTooltipPosition(null);
	};

	return loading ? (
		<p className="loading center">Loading...</p>
	) : (
		<article className="hero-details-graph">
			<figure
				className={`reactflow-container ${
					isInitialized ? 'visible' : ''
				}`}
				style={{
					opacity: isInitialized ? 1 : 0,
					height: '100%',
					transition: 'opacity 0.5s ease-in-out',
				}}
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onInit={(instance) => {
						reactFlowInstance.current = instance;
						instance.fitView(); // Immediately fit view when initialized
					}}
				>
					<MiniMap
						maskColor={'#bebebe'}
						nodeStrokeColor={'#ece7e1'}
						nodeColor={'#373737'}
						nodeBorderRadius={14}
						pannable
						zoomable
						style={{ cursor: 'grab' }}
					/>
					<Controls
						showFitView
						onFitView={() => reactFlowInstance.current?.fitView()}
					/>
				</ReactFlow>
			</figure>

			{hoveredItem && tooltipPosition && (
				<article
					className="tooltip"
					style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
				>
					{hoveredItem.hasOwnProperty('title') ? (
						// Render Film details
						<ul className="tooltip-list">
							<strong>Film:</strong>{' '}
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
					) : hoveredItem.hasOwnProperty('starship_class') ? (
						// Render Starship details
						<ul className="tooltip-list">
							<strong>Starship:</strong>{' '}
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
					) : hoveredItem.hasOwnProperty('vehicle_class') ? (
						// Render Vehicle details
						<ul className="tooltip-list">
							<strong>Vehicle:</strong>{' '}
							<h3>{(hoveredItem as Vehicle).name}</h3>
							<li>
								<strong>Model:</strong>{' '}
								{(hoveredItem as Vehicle).model}
							</li>
							<li>
								<strong>Manufacturer:</strong>{' '}
								{(hoveredItem as Vehicle).manufacturer}
							</li>
							<li>
								<strong>Class:</strong>{' '}
								{(hoveredItem as Vehicle).vehicle_class}
							</li>
							<li>
								<strong>Max Speed:</strong>{' '}
								{
									(hoveredItem as Vehicle)
										.max_atmosphering_speed
								}
							</li>
							<li>
								<strong>Crew:</strong>{' '}
								{(hoveredItem as Vehicle).crew}
							</li>
							<li>
								<strong>Passengers:</strong>{' '}
								{(hoveredItem as Vehicle).passengers}
							</li>
						</ul>
					) : null}
				</article>
			)}
		</article>
	);
};

export default HeroDetailGraph;
