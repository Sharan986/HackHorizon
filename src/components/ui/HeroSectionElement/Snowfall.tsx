"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Snowflake {
	id: number;
	x: number;
	size: number;
	duration: number;
	delay: number;
	opacity: number;
	drift: number;
}

export default function Snowfall() {
	const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

	useEffect(() => {
		const flakes: Snowflake[] = [];
		const count = 120; // Number of snowflakes

		for (let i = 0; i < count; i++) {
			flakes.push({
				id: i,
				x: Math.random() * 100, // Random horizontal position (%)
				size: Math.random() * 2 + 1, // Size between 1-3px (small like real snow)
				duration: Math.random() * 8 + 6, // Fall duration 6-14s
				delay: Math.random() * 10, // Random start delay
				opacity: Math.random() * 0.4 + 0.6, // Opacity 0.6-1
				drift: Math.random() * 40 - 20, // Horizontal drift -20 to 20px
			});
		}
		setSnowflakes(flakes);
	}, []);

	return (
		<div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
			{snowflakes.map((flake) => (
				<motion.div
					key={flake.id}
					className="absolute rounded-full bg-white"
					style={{
						left: `${flake.x}%`,
						width: flake.size,
						height: flake.size,
						opacity: flake.opacity,
						boxShadow: `0 0 ${flake.size * 2}px rgba(255, 255, 255, 0.8)`,
					}}
					initial={{
						y: -20,
						x: 0,
					}}
					animate={{
						y: "100vh",
						x: [0, flake.drift, 0, -flake.drift, 0],
					}}
					transition={{
						y: {
							duration: flake.duration,
							repeat: Number.POSITIVE_INFINITY,
							ease: "linear",
							delay: flake.delay,
						},
						x: {
							duration: flake.duration / 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
							delay: flake.delay,
						},
					}}
				/>
			))}
		</div>
	);
}
