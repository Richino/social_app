"use client";
import Activity from "../../components/home/activity";
import Messages from "../../components/home/messages";
import PostFeed from "../../components/home/postFeed";
import { App } from "../context";
import { useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

export default function Home() {
	const { user, setUser, bottomNavOffset } = useContext(App);
	const pathname = usePathname();
	const [loading, setLoading] = useState(false);
	const [finished, setFinished] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const [skip, setSkip] = useState(15);
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_URL,
		withCredentials: true,
	});

	async function fetchFeeds() {
		if (pathname != "/") return;
		const div = ref.current;
		if (div != undefined) {
			const result: number = div?.scrollHeight - div?.scrollTop;

			if (result <= 2971 && !loading && !finished) {
				setSkip((current) => current + 15);
				setLoading(true);
				await instance
					.post("/feeds", { skip })
					.then((res) => {
						if (res.data.length === 0) {
							setFinished(true);
							return;
						}
						setUser({ ...user, feed: [...user.feed, ...res.data] });
					})
					.finally(() => setLoading(false));
			}
		}
	}

	useEffect(() => ref.current?.scrollTo({ top: 0 }), []);

	return (
		<div
			ref={ref}
			className={`feeds  flex h-[calc(100%-58px)] w-full justify-center  gap-5 overflow-y-auto bg-neutral-100 tablet:h-[100svh] dark:bg-neutral-950 phone:fixed phone:top-[52px] phone:mb-[60px] phone:h-[calc(100%-(59px+52px))]`}
			onScroll={fetchFeeds}>
			<div className=" cool sticky top-[0px] w-[250px] shrink-0 space-y-5 overflow-y-auto py-5 tablet:hidden">
				<Activity />
			</div>
			<div className="jusify-center flex h-max w-[400px] flex-col items-center gap-5 py-5  tablet:phone:w-full">
				{/*<Stories />*/}
				{user.feed?.map((key: any, value: number) => {
					return (
						<PostFeed
							fullname={key.author_fullname}
							usernameOrText={key.author_username}
							avatar={key.avatar[0]}
							post={key.imageUrl}
							caption={key?.caption}
							likes={key.likes}
							comments={key.comments}
							id={key._id}
							author={key.author}
							key={value}
							index={value}
							followers={key.author_followers[0]}
							createdAt={key.createdAt}
							edited={key.edited}
						/>
					);
				})}
			</div>
			<div className="cool sticky top-[0px] h-full w-[250px] shrink-0 space-y-5 overflow-y-auto py-5 tablet:hidden">
				<Messages />
			</div>
		</div>
	);
}
