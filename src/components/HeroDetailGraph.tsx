import { useEffect, useState } from 'react';
import ReactFlow, { MiniMap, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { fetchHeroDetails } from '../services/starWarsApi'; // API function to fetch hero details

interface HeroDetailGraphProps {
	heroId: number;
}

// Component to render hero details in a graph using React Flow
const HeroDetailGraph: React.FC<HeroDetailGraphProps> = ({ heroId }) => {
	const [nodes, setNodes] = useState<Node[]>([]); // State for nodes in the graph
	const [edges, setEdges] = useState<Edge[]>([]); // State for edges (connections) in the graph

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch hero details based on heroId
				const hero = await fetchHeroDetails(heroId);

				// Create nodes and edges for the hero and related entities
				const heroNode: Node = {
					id: `hero-${hero.id}`,
					data: { label: hero.name },
					position: { x: 250, y: 0 },
				};

				// Nodes for films the hero appears in
				const filmNodes: Node[] = hero.films.map(
					(filmId: number, index: number) => ({
						id: `film-${filmId}`,
						data: { label: `Film ${filmId}` },
						position: { x: 150 * (index + 1), y: 150 },
					})
				);

				// Nodes for starships the hero traveled in
				const starshipNodes: Node[] = hero.starships.map(
					(starshipId: number, index: number) => ({
						id: `starship-${starshipId}`,
						data: { label: `Starship ${starshipId}` },
						position: { x: 100 * (index + 1), y: 300 },
					})
				);

				// Edges from hero to films
				const filmEdges: Edge[] = hero.films.map((filmId: number) => ({
					id: `edge-hero-${hero.id}-film-${filmId}`,
					source: `hero-${hero.id}`,
					target: `film-${filmId}`,
				}));

				// Edges from films to starships
				const starshipEdges: Edge[] = hero.starships.map(
					(starshipId: number) => ({
						id: `edge-film-${hero.films[0]}-starship-${starshipId}`,
						source: `film-${hero.films[0]}`, // Assume first film connects to starship
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
