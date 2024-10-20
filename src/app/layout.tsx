import type { Metadata } from 'next';
import '../styles/globals.scss';

export const metadata: Metadata = {
	title: 'Star Wars App',
	description: 'Star Wars Heroes and Spaceships',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
