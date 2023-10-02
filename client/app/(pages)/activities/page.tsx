"use client";
import { useContext, useEffect, useState } from "react";
import { RiUserFollowLine } from "react-icons/ri";
import Header from "../../../components/home/header";
import Image from "next/image";
import { App } from "../../context";
import { AiOutlinePicture, AiOutlineQuestion } from "react-icons/ai";
import Avatar from "../../../components/common/avatar";
import axios from "axios";

export default function Activity() {
	const [notifications, setNotifications] = useState([]);
	const instance = axios.create({
		baseURL: process.env.url,
		withCredentials: true,
	});
	function createdAt(comment_timestamp: string) {
		const timestamp = new Date(comment_timestamp);
		const difference = Date.now() - timestamp.getTime();

		const timeUnits = {
			y: 31536000000,
			w: 604800000,
			d: 86400000,
			h: 3600000,
			m: 60000,
		};

		for (const [unit, milliseconds] of Object.entries(timeUnits)) {
			if (difference >= milliseconds) {
				const numUnits = Math.floor(difference / milliseconds);
				return `${numUnits}${unit}`;
			}
		}

		return "Just now";
	}
	useEffect(() => {
		const fetchData = async () => {
			await instance.get("/activities").then((res: any) => {
				setNotifications(res.data);
			});
		};
		fetchData();
	}, []);
	return (
		<div className="flex h-[calc(100%-58px)] w-full flex-shrink-0 flex-col items-center  justify-center gap-5 overflow-y-scroll bg-neutral-100 p-5 text-sm dark:bg-neutral-950 phone:fixed phone:top-[52px]  phone:mb-[60px] phone:h-[calc(100%-(60px+50px))] tablet:p-0 tablet:phone:block">
			<div className="max-w[460px] h-full overflow-y-auto border border-neutral-200 bg-white py-2 dark:border-neutral-800 dark:bg-neutral-900 phone:fixed phone:top-[52px] phone:mb-[60px] phone:h-[calc(100%-(60px+52px))] phone:border-0">
				{notifications.map((key: any, index: number) => {
					return (
						<div key={index} className="flex items-center gap-2 p-2 px-5 transition-colors hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
							<Avatar story={false} height={42} width={42} image={key.avatar[0]} />
							<span className="w-full leading-relaxed dark:text-neutral-300">
								<b className="font-bold  dark:text-neutral-200">{key.author_fullname}</b>{" "}
								{key.action === "like" ? "likes your post." : key.action === "comment" ? "likes a comment on this post. " : "started following you. "}
								<span className="text-neutral-400">{createdAt(key.createdAt)}</span>
							</span>
							{key.action === "follow" ? (
								<div className=" grid h-[32px] w-[32px] shrink-0   place-items-center rounded-full  bg-violet-200 hover:cursor-pointer dark:bg-neutral-950">
									<RiUserFollowLine size={17} />
								</div>
							) : (
								<>
									{key.image[0] ? (
										<div className=" relative grid h-[32px] w-[32px] shrink-0  place-items-center overflow-hidden rounded bg-neutral-200 hover:cursor-pointer">
											<Image src={key.image[0]} alt="search icon" style={{ objectFit: "cover" }} fill sizes="100px" />
										</div>
									) : (
										<div className=" hover:cursor-pointe grid h-[32px] w-[32px]   shrink-0 place-items-center  rounded-full bg-neutral-200 dark:bg-neutral-950">
											<AiOutlineQuestion size={17} />
										</div>
									)}
								</>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
