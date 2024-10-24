import { useEffect, useState } from 'react';
import ReactFlow, { MiniMap, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import Image from 'next/image';
import {
	fetchHeroDetails,
	fetchFilm,
	fetchStarship,
} from '../services/starWarsApi';

// Define the props for the HeroDetailGraph component
interface HeroDetailGraphProps {
	heroId: number;
}
// Component to render hero details in a graph using React Flow
const HeroDetailGraph: React.FC<HeroDetailGraphProps> = ({ heroId }) => {
	// Initialize state for nodes and edges
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	// Fetch data when the component mounts or the heroId changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch hero details based on heroId
				const hero = await fetchHeroDetails(heroId);

				// Create nodes and edges for the hero and related entities
				const heroImage = (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Image
							src={`https://starwars-visualguide.com/assets/img/characters/${heroId}.jpg`}
							alt={hero.name}
							width={100}
							height={150}
							style={{ marginRight: '10px' }}
							priority
						/>
						<ul>
							<li>{`Name: ${hero.name}`}</li>
							<li>{`Birth Year: ${hero.birth_year}`}</li>
							<li>{`Gender: ${hero.gender}`}</li>
							<li>{`Height: ${hero.height} cm`}</li>
							<li>{`Mass: ${hero.mass} kg`}</li>
							<li>{`Hair Color: ${hero.hair_color}`}</li>
							<li>{`Eye Color: ${hero.eye_color}`}</li>
							<li>{`Skin Color: ${hero.skin_color}`}</li>
						</ul>
					</div>
				);

				// Create a node for the hero
				const heroNode: Node = {
					id: `hero-${hero.id}`,
					data: { label: heroImage },
					position: { x: 250, y: 0 },
					style: { whiteSpace: 'pre-wrap' },
				};

				// Create nodes for films the hero appears in
				const filmNodes: Node[] = await Promise.all(
					hero.films.map(async (filmId: number, index: number) => {
						const film = await fetchFilm(filmId);
						const filmImage = (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Image
									src={`https://starwars-visualguide.com/assets/img/films/${filmId}.jpg`}
									alt={film.title}
									width={100}
									height={150}
									style={{ marginRight: '10px' }}
									priority
								/>
								<p>{film.title}</p>
							</div>
						);
						return {
							id: `film-${filmId}`,
							data: { label: filmImage },
							position: { x: 150 * (index + 1), y: 150 },
						};
					})
				);

				// Create nodes for starships the hero traveled in
				const starshipNodes: Node[] = await Promise.all(
					hero.starships.map(
						async (starshipId: number, index: number) => {
							const starship = await fetchStarship(starshipId);
							const starshipImage = (
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<Image
										src={`https://starwars-visualguide.com/assets/img/starships/${starshipId}.jpg`}
										alt={starship.name}
										width={100}
										height={150}
										style={{ marginRight: '10px' }}
										priority
									/>
									<p>{starship.name}</p>
								</div>
							);
							return {
								id: `starship-${starshipId}`,
								data: { label: starshipImage },
								position: { x: 100 * (index + 1), y: 300 },
							};
						}
					)
				);

				// Create edges from hero to films
				const filmEdges: Edge[] = hero.films.map((filmId: number) => ({
					id: `edge-hero-${hero.id}-film-${filmId}`,
					source: `hero-${hero.id}`,
					target: `film-${filmId}`,
				}));

				// Create edges from films to starships
				const starshipEdges: Edge[] = hero.starships.map(
					(starshipId: number) => ({
						id: `edge-film-${hero.films[0]}-starship-${starshipId}`,
						source: `film-${hero.films[0]}`,
						target: `starship-${starshipId}`,
					})
				);

				// Set nodes and edges in state
				setNodes([heroNode, ...filmNodes, ...starshipNodes]);
				setEdges([...filmEdges, ...starshipEdges]);
			} catch (error) {
				console.error('Error fetching hero details:', error);
			}
		};

		fetchData(); // Trigger fetch on mount or heroId change
	}, [heroId]);

	return (
		<div style={{ height: 400 }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
			>
				<MiniMap />
				<Controls />
			</ReactFlow>
		</div>
	);
};

export default HeroDetailGraph;
