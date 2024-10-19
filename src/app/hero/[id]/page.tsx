import React from 'react';
import HeroDetailGraph from '../../../components/HeroDetailGraph';
import { fetchHeroDetails } from '../../../services/starWarsApi';
import { HeroDetail } from '../../../types/starWarsTypes';

export default async function HeroDetailPage({
	params,
}: {
	params: { id: string }; // id comes as a string from the route parameters
}) {
	// Convert the string 'id' to a number
	const heroId = parseInt(params.id, 10); // Safely convert string to number

	// Fetch the hero details using the converted number
	const heroDetails: HeroDetail = await fetchHeroDetails(heroId);

	return (
		<div>
			<h1>{heroDetails.name}</h1>
			{/* Pass the hero ID as a number to HeroDetailGraph */}
			<HeroDetailGraph heroId={heroId} />
		</div>
	);
}
