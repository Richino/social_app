"use client";
import { useState } from "react";
import Header from "./header";
import Image from "next/image";

export default function Explore() {
	return (
		<div className="w-full rounded-lg  bg-white  pb-1">
			<Header title="Explore" url="explore" />
			<div className="grid grid-cols-3 gap-1 p-2 pt-0">
				{/*images.map((key, index) => {
					return (
						<div
							key={index}
							className="relative aspect-square overflow-hidden rounded hover:cursor-pointer">
							<Image
								src={key}
								alt="explore"
								className={`h-full w-full object-cover`}
								fill
								sizes="(max-width: 75.33px) 100vw, 75.33px"
							/>
						</div>
					);
				})*/}
			</div>
		</div>
	);
}
