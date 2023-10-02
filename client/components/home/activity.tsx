"use client";
import { useContext, useState } from "react";
import { RiUserFollowLine } from "react-icons/ri";
import Avatar from "../common/avatar";
import Header from "./header";
import Image from "next/image";
import { App } from "../../app/context";
import {  AiOutlineQuestion } from "react-icons/ai";

export default function Activity() {
	const { notifications } = useContext(App);

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
	return (
		<div className="w-full rounded-lg  border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
			<Header title="Activity" url="activities" />
			<div className="pb-2">
				{notifications.data.map((key: any, index: number) => {
					return (
						<div key={index} className="flex items-start gap-2 p-2 px-5 transition-colors hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
							<Avatar story={false} height={42} width={42} image={key.avatar[0]} />
							<span className="w-full leading-relaxed dark:text-neutral-300">
								<b className="dark:text-neutral-200  font-bold">{key.author_fullname}</b>{" "}
								{key.action === "like" ? "likes your post." : key.action === "comment" ? "likes a comment on this post. " : "started following you. "}
								<span className="text-neutral-500">{createdAt(key.createdAt)}</span>
							</span>
							{key.action === "follow" ? (
								<div className=" grid h-[32px] w-[32px] shrink-0   place-items-center rounded-full  bg-violet-200 hover:cursor-pointer dark:bg-neutral-950">
									<RiUserFollowLine size={17}  />
								</div>
							) : (
								<>
									{key.image[0] ? (
										<div className=" relative grid h-[32px] w-[32px] shrink-0  place-items-center overflow-hidden rounded bg-neutral-200 hover:cursor-pointer">
											<Image src={key.image[0]} alt="search icon" style={{ objectFit: "cover" }} fill sizes="100px" />
										</div>
									) : (
										<div className=" hover:cursor-pointe grid h-[32px] w-[32px]   shrink-0 place-items-center  rounded-full bg-neutral-200 dark:bg-neutral-950">
											<AiOutlineQuestion size={17}  />
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
