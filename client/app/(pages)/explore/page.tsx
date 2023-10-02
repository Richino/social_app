"use client";
import { useContext, useState } from "react";
import { App } from "../../context";
import Image from "next/image";

export default function Page() {
	const { setPost } = useContext(App);
	const [data, setData] = useState([
		"/assets/user/explore/0.png",
		"/assets/user/explore/1.png",
		"/assets/user/explore/2.jpeg",
		"/assets/user/explore/3.png",
		"/assets/user/explore/4.png",
		"/assets/user/explore/5.png",
		"/assets/user/explore/6.png",
		"/assets/user/explore/7.png",
		"/assets/user/explore/8.png",
		"/assets/user/explore/8.png",
		"/assets/user/explore/10.jpg",
		"/assets/user/explore/11.jpeg",
		"/assets/user/explore/12.png",
		"/assets/user/explore/13.png",
		"/assets/user/explore/14.png",
		"/assets/user/explore/15.jpg",
		"/assets/user/explore/16.png",
		"/assets/user/explore/17.png",
		"/assets/user/explore/18.png",
		"/assets/user/explore/19.png",
		"/assets/user/explore/20.png",
		"/assets/user/explore/21.png",
		"/assets/user/explore/22.jpeg",
		"/assets/user/explore/23.jpeg",
		"/assets/user/explore/24.png",
	]);
	return (
		<div className="flex h-max w-full flex-col items-center justify-center p-5 phone:p-0">
			<div
				className={`grid w-full max-w-[800px] grid-cols-3 gap-5 phone:gap-[2px]`}>
				{data.map((key, index) => {
					return (
						<div
							key={index}
							className=" relative aspect-square  h-full overflow-hidden hover:cursor-pointer"
							onClick={() => setPost(true)}>
							<Image
								id="post-image"
								src={key}
								alt="post"
								className={`h-full w-full object-cover`}
								fill
								sizes="(max-width: 253.34px) 100vw, 253.34px"
								priority={true}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
