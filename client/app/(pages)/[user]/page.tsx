/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Avatar from "../../../components/common/avatar";
import { TbGridDots } from "react-icons/tb";
import { BsBookmark } from "react-icons/bs";
import { AiOutlineCamera } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import { App } from "../../context";
import Image from "next/image";
import axios from "axios";
import { usePathname } from "next/navigation";
import Link from "next/link";
import nprogress from "nprogress";

export default function Page({ params }: any) {
	nprogress.configure({ showSpinner: false });
	const pathname = usePathname();
	const { setPost, user, userProfile, setUserProfile, setUserPost, setChangeProfile, setUser, setList } = useContext(App);

	const [index, setIndex] = useState(1);
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_URL,
		withCredentials: true,
	});
	async function fetchData() {
		await instance
			.post(`/user${pathname}`)
			.then((res) => {
				setUserProfile({
					...userProfile,
					loading: false,
					user: res.data.user,
					post: res.data.post,
				});
			})
			.catch(() => {
				setUserProfile({
					...user,
					loading: false,
					user: null,
					post: [],
				});
			});
	}

	async function follow() {
		await instance
			.post(`/main_user/follow/${userProfile.user?._id}`, {
				user: user.user?._id,
			})
			.then(() => {
				setUserProfile({
					...userProfile,
					user: {
						...userProfile.user,
						followers: [...(userProfile.user?.followers ?? []), user.user?._id as string],
					},
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function unfollow() {
		const index = userProfile.user?.followers?.indexOf(user.user?._id as string);
		let array = [...(userProfile.user?.followers ?? [])];
		if (index !== undefined) array.splice(index, 1);
		await instance
			.post(`/main_user/follow/${userProfile.user?._id}`, {
				user: user.user?._id,
			})
			.then(() => {
				setUserProfile({
					...userProfile,
					user: {
						...userProfile.user,
						followers: array,
					},
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function openPost(post: any, index: number) {
		let createPost = {
			_id: post._id,
			author: post.author,
			fullname: userProfile.user?.fullname,
			username: userProfile.user?.username,
			caption: post.caption,
			imageUrl: post.imageUrl,
			comments: post.comments,
			likes: post.likes,
			avatar: userProfile.user?.avatar,
			followers: userProfile.user?.followers,
			index,
			createdAt: post.createdAt,
			edited: post.edited,
		};
		setUserPost(createPost);
		setPost(true);
	}

	function openList(type: string) {
		setList({ type, open: true, _id: userProfile.user?._id });
	}
	useEffect(() => {
		const newPost = {
			loading: true,
			user: null,
			post: [],
		};
		setUserProfile(newPost);
		fetchData();
	}, []);
	const [saved, setSaved] = useState([
		"/assets/user/saved/0.png",
		"/assets/user/saved/1.png",
		"/assets/user/saved/2.png",
		"/assets/user/saved/3.jpg",
		"/assets/user/saved/4.png",
	]);

	if (!userProfile.user && userProfile.loading) {
		return (
			<div className="grid h-full w-full place-items-center text-2xl dark:bg-neutral-950">
				<div className="circle"> </div>
			</div>
		);
	} else if (!userProfile.user && !userProfile.loading) {
		return (
			<div className="grid h-[calc(100%-58px)] w-full place-items-center overflow-y-auto dark:bg-neutral-900">
				<div className="flex flex-col items-center">
					<span className="p-5 text-9xl">404</span>
					<span className="text-5xl">Page Not Found</span>
					<div className="text-md pt-5">
						<span>
							<span>The page you are looking for doesn&aposnpmrun det exits.Return tonpm run </span>
							<Link href={"/"} onClick={() => nprogress.start()}>
								<span className="text-violet-500"> home page</span>
							</Link>
						</span>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<>
				<div className=" flex h-[calc(100%-58px)] w-full flex-col items-center gap-5 overflow-y-scroll  bg-neutral-100 text-sm dark:bg-neutral-950 phone:fixed phone:top-[52px] phone:mb-[60px]  phone:h-[calc(100%-(59px+52px))] tablet:phone:block">
					<div className="item flex p-5 pb-0 pt-0 tablet:phone:w-full">
						<div className="p-5 px-0">
							<div
								className="h-[100px] w-[100px]"
								onClick={() => {
									if (user.user?._id !== userProfile.user?._id) return;
									setChangeProfile(true);
								}}>
								<Avatar story={false} height={100} width={100} image={userProfile.user?.avatar ?? ""} />
							</div>
						</div>
						<div className="flex w-[400px]  flex-col gap-3 pl-5 pt-5">
							<div className="flex items-center justify-between gap-4 phone:justify-center tablet:phone:block tablet:phone:space-y-4">
								<span className="w-full text-base ">
									<b>{userProfile.user?.fullname}</b>
								</span>
								<div className="flex w-full items-center justify-end gap-2">
									{user.user?._id !== userProfile.user?._id ? (
										<div className="w-full ">
											{userProfile.user?.followers?.includes(user.user?._id ?? "") ? (
												<button className="rounded bg-violet-500 p-1 px-5 text-white tablet:phone:w-full" onClick={unfollow}>
													Unfollow
												</button>
											) : (
												<button className="rounded bg-violet-500 p-1 px-5 text-white tablet:phone:w-full" onClick={follow}>
													Follow
												</button>
											)}
										</div>
									) : (
										<Link href={"/settings"} onClick={() => nprogress.start()}>
											<button className="rounded bg-violet-500 p-1 px-5 text-white tablet:phone:hidden">Settings</button>
										</Link>
									)}
								</div>
							</div>
							<div className="flex justify-between tablet:phone:hidden">
								<span>
									<b>{userProfile.post?.length}</b> post
								</span>
								<span className="hover:cursor-pointer" onClick={() => openList("Followers")}>
									<b>{userProfile.user?.followers?.length}</b> {(userProfile.user?.followers?.length ?? 0) > 1 ? "followers" : "follower"}
								</span>
								<span className="hover:cursor-pointer" onClick={() => openList("Following")}>
									<b>{userProfile.user?.following?.length}</b> following
								</span>
							</div>
							<span className="tablet:phone:hidden">{userProfile.user?.username}</span>
							<span className="tablet:phone:hidden">{userProfile.user?.bio}</span>
						</div>
					</div>
					<div className="hidden px-5 pb-5 phone:block">
						<span className="text-base ">
							<b>{params.user}</b>
						</span>
						<span className="hidden tablet:phone:block">{userProfile.user?.bio}</span>
					</div>
					<div className="hidden justify-between border-t border-neutral-200 px-10 dark:border-neutral-800 tablet:phone:flex">
						<span className="flex flex-col items-center py-5">
							<b>{userProfile.post?.length}</b>
							<span> post</span>
						</span>
						<span className="flex flex-col items-center py-5">
							<b>{userProfile.user?.followers?.length}</b> <span>followers</span>
						</span>
						<span className="flex flex-col items-center py-5">
							<b>{userProfile.user?.following?.length}</b> <span>following</span>
						</span>
					</div>
					<div className="flex w-full max-w-[800px] justify-center  space-x-[60px] border-t border-neutral-200 px-5 pb-0 dark:border-neutral-800 phone:p-0">
						<button
							className={`item-center flex justify-center gap-2 border-t-2 py-5 ${index === 1 ? " border-violet-500" : "border-transparent"}`}
							onClick={() => setIndex(1)}>
							<TbGridDots size={16} />
							<span>
								<b>POST</b>
							</span>
						</button>
						<button
							className={`item-center flex justify-center gap-2 border-t-2 py-5 ${index === 2 ? " border-violet-500" : "border-transparent"}`}
							onClick={() => setIndex(2)}>
							<BsBookmark size={16} />
							<span>
								<b>SAVED</b>
							</span>
						</button>
					</div>

					<div className={` ${index === 1 ? "block" : "hidden"}  h-full w-full max-w-[800px]`}>
						{userProfile.post?.length && !userProfile.loading ? (
							<div className="grid  w-full max-w-[800px] grid-cols-3 gap-2   pb-5 phone:h-auto phone:gap-[2px]">
								{userProfile.post?.map((key: any, index: number) => {
									return (
										<div key={index} className=" relative aspect-square h-auto   w-full hover:cursor-pointer" onClick={() => openPost(key, index)}>
											<Image
												id="post-image"
												src={key.imageUrl}
												alt="post"
												style={{
													objectFit: "cover",
												}}
												fill
												priority={true}
											/>
										</div>
									);
								})}
							</div>
						) : userProfile.post?.length === 0 && userProfile.loading === true ? (
							<div className="flex h-full max-w-[800px]  items-center justify-center gap-2  pb-5 phone:h-auto phone:gap-[2px]">Loading</div>
						) : (
							<div className="flex h-full max-w-[800px]  items-center justify-center gap-2  pb-5 phone:h-auto phone:gap-[2px] ">
								<div className="mt-24 flex flex-col items-center justify-center">
									<AiOutlineCamera size={84} />
									<span className="text-2xl">No post yet</span>
								</div>
							</div>
						)}
					</div>
					<div className={` h-full w-full max-w-[800px] grid-cols-3 gap-2  pb-5 phone:h-auto phone:gap-[2px] ${index === 2 ? "grid" : "hidden"}`}>
						{saved.map((key, index) => {
							return (
								<div key={index} className="relative aspect-square   overflow-hidden hover:cursor-pointer" onClick={() => setPost(true)}>
									<Image
										id="post-image"
										src={key}
										alt="post"
										className={`h-full w-full object-cover`}
										fill
										sizes="(max-width: 261.34px) 100vw, 261.34px"
										priority={true}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</>
		);
	}
}
