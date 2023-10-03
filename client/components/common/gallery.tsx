import Image from "next/image";
import { useState, useEffect } from "react";

export default function Gallery() {
	//const [image, setImage] = useState(`/assets/black.jpg`);
	useEffect(() => {
		//setImage(`/assets/${Math.floor(Math.random() * 6) + 1}.jpg`);
	}, []);

	return (
		<div className=" grid h-full w-full place-items-center phone:hidden">
			<div className="relative h-full w-full ">
				<div className="absolute top-0 left-0 z-50 grid h-full w-full place-items-center bg-black/30 p-5">
					<div className="grid place-items-center">
						<h1 className="title text-7xl text-white">Moments</h1>
						<span className="title text-3xl text-white">Share your journeys here</span>
					</div>
				</div>

				<Image src={""} alt="slide image" fill style={{ objectFit: "cover" }} priority sizes="(max-width: 1374.84px) 100vw, 1374.84px" />
			</div>
		</div>
	);
}
