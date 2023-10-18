"use client";
import { BsChevronLeft, BsThreeDots } from "react-icons/bs";
import { AiFillHeart, AiOutlineClose, AiOutlineHeart } from "react-icons/ai";
import User from "../home/user";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import Avatar from "./avatar";
import { Comments, TypeComment, Popup, IPost } from "../../app/(interface)/post";
import { App } from "../../app/context";
import ImageTag from "next/image";
import { IoPaperPlaneOutline } from "react-icons/io5";
import axios from "axios";
import Link from "next/link";
import { set } from "nprogress";
const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_URL,
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

//type comment component
export function TypeComment(props: TypeComment): JSX.Element {
	const [text, setText] = useState("");
	const { user, comments, setComments, userPost, setUser } = useContext(App);

	async function comment() {
		await instance
			.post(`/main_user/comment/${user.user?._id}`, {
				post: props.id,
				text: text,
			})
			.then((res) => {
				let newFeed = [...user.feed];
				newFeed[userPost.index].comments += 1;
				setUser({ ...user, feed: newFeed });
				setComments([res.data[0], ...comments]);
				setText("");
			})
			.catch((err) => {
				console.log(err);
				return;
			});
	}
	function input(e: ChangeEvent<HTMLInputElement>) {
		setText(e.target.value);
	}
	return (
		<>
			<AiOutlineHeart size={24} className="text-neutral-400" />
			<input type="text" placeholder="Add a comment..." className="h-full w-full text-sm placeholder:text-neutral-400  dark:bg-neutral-900 bg-white" value={text} onChange={input} />
			<button className="text-violet-500" onClick={comment}>
				<IoPaperPlaneOutline size={24} />
			</button>
		</>
	);
}

//comment copmponent
export function Comment(props: Comments): JSX.Element {
	const [show, setShow] = useState<number | null>();
	const { user, comments, setComments, setList } = useContext(App);

	async function likeComment() {
		const data = {
			commentId: props.commentId,
			author: props.id,
			user: user.user?._id,
			postId: props.postId,
		};
		await instance
			.post(`/main_user/like-comment`, data)
			.then(() => {
				let newComments = [...comments];
				newComments[props.index].comments_info.likes.push(user.user?._id ?? "");
				setComments(newComments);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function openList(type: string) {
		if (props.commentId != undefined) setList({ type, open: true, _id: props.commentId });
	}

	async function unlikeComment() {
		const data = {
			commentId: props.commentId,
			author: props.id,
			user: user.user?._id,
			postId: props.postId,
		};
		await instance
			.post(`/main_user/like-comment`, data)
			.then(() => {
				let newComments = [...comments];
				const index = newComments[props.index].comments_info.likes.indexOf(user.user?._id ?? "");
				newComments[props.index].comments_info.likes.splice(index, 1);
				setComments(newComments);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	return (
		<div className="flex gap-2 ">
			<div className="flex max-w-[32px] flex-col items-center  gap-2  pb-2">
				<div className="h-[32px] w-[32px]">
					<Avatar height={32} width={32} image={props.avatar} story={false} />
				</div>
				<div
					className={`h-full rounded-bl-lg border-b  border-l border-neutral-200 dark:border-neutral-800   ${show === props.index ? "ml-14 w-14" : "ml-4 w-4"} ${
						props.caption && "hidden"
					}`}></div>
			</div>
			<div className="flex w-full flex-col gap-2 ">
				<div className="group flex w-full flex-col gap-2 rounded-lg bg-white p-5 dark:bg-neutral-900">
					<div className="flex justify-between">
						<span>{props.fullname}</span>
						{user.user?._id == props.id && <BsThreeDots size={16} className="hidden hover:cursor-pointer group-hover:block phone:block" />}
					</div>
					<span className="leading-5 text-neutral-600 dark:text-neutral-200">{props.text}</span>
					<div className="flex items-center justify-between text-neutral-400">
						<div className="flex items-center gap-2 ">
							{!props.caption && (
								<>{props.likes?.includes(user.user?._id ?? "") ? <button onClick={unlikeComment}>Unlike</button> : <button onClick={likeComment}>Like</button>}</>
							)}
							{props.edited && <span>edited</span>}
							<span>{createdAt(props.createdAt)}</span>
						</div>
						<div
							className={`flex items-center gap-1 ${!props.caption && "hover:cursor-pointer"}`}
							onClick={() => {
								openList("Likes");
							}}>
							{!props.caption && <span>{props.likes?.length}</span>}
							{props.likes?.includes(user.user?._id ?? "") ? (
								<AiFillHeart size={12} color="#7c3aed" className={`hover:cursor-pointer ${props.caption && "hidden"}`} />
							) : (
								<AiOutlineHeart size={12} className={`hover:cursor-pointer ${props.caption && "hidden"}`} />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function Popup(props: Popup) {
	const { user, setUser, userProfile, setUserProfile, setPopup, userPost, setUserPost, setComments, setPost } = useContext(App);
	const [tab, setTab] = useState(0);
	const [value, setValue] = useState("");
	async function unfollow() {
		const userProfileIndex = userProfile.user?.followers?.indexOf(user.user?._id ?? "");
		const userIndex = user.user?.following?.indexOf(props.author);
		let userProfileCopy = [...(userProfile.user?.followers ?? [])];
		let userCopy = [...(user.user?.following ?? [])];
		userProfileCopy.splice(userProfileIndex ?? 0, 1);
		userCopy.splice(userIndex ?? 0, 1);
		await instance
			.post(`/main_user/follow/${props.author}`, {
				user: user.user?._id,
			})
			.then(() => {
				setUserProfile({
					...userProfile,
					user: {
						...userProfile.user,
						followers: userProfileCopy,
					},
				});
				setUser({
					...user,
					user: {
						...user.user,
						following: userCopy,
					},
				});
				setPopup(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function follow() {
		await instance
			.post(`/main_user/follow/${props.author}`, {
				user: user.user?._id,
			})
			.then(() => {
				setUserProfile({
					...userProfile,
					user: {
						...userProfile.user,
						followers: [...(userProfile.user?.followers ?? []), user.user?._id ?? ""],
					},
				});

				setUser({
					...user,
					user: {
						...user.user,
						following: [...(user.user?.following ?? []), props.author],
					},
				});
				setPopup(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function hidePopup(e: React.MouseEvent<HTMLDivElement>) {
		(e.target as HTMLDivElement).id === "popup" && setPopup(false);
	}
	async function changeCaption() {
		console.log(value);
		await instance
			.post(`/main_user/caption/update`, { postId: props.postId, text: value })
			.then(() => {
				let userPostCopy = { ...userPost };
				let userProfileCopy = { ...userProfile };
				let userCopy = { ...user };
				if (userPostCopy) {
					userPostCopy.caption = value;
					userPostCopy.edited = true;
					setUserPost(userPostCopy);
				}
				if (userProfileCopy.post?.length !== 0) {
					userProfileCopy.post[props.postIndex].caption = value;
					userProfileCopy.post[props.postIndex].edited = true;
					setUserProfile(userProfileCopy);
				}
				if (userCopy.feed.length != 0) {
					userCopy.feed[props.postIndex].caption = value;
					userCopy.feed[props.postIndex].edited = true;
					setUser(userCopy);
				}
				setValue("");
				setPopup(false);
			})
			.catch((err) => {
				console.log(err.message);
			});
	}

	async function deletePost() {
		await instance
			.delete(`/main_user/post/delete`, {
				params: {
					id: props.postId,
				},
			})
			.then(() => {
				let userProfileCopy = { ...userProfile };
				userProfileCopy.post?.splice(props.postIndex, 1);
				let userCopy = { ...user };
				userCopy.feed.splice(props.postIndex, 1);
				setUser(userCopy);
				setPost(false);
				setPopup(false);
				setComments([]);
				setUserPost({});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	return (
		<>
			{user.user?._id === props.author ? (
				<div id="popup" className="fixed z-[60] flex h-full w-full items-center justify-center bg-black/50 p-5" onClick={hidePopup}>
					{tab === 0 ? (
						<div className="flex w-full max-w-[400px]  flex-col rounded-md bg-white font-bold dark:bg-neutral-900">
							<button className="border-b border-neutral-200 py-4 text-violet-500 dark:border-neutral-800" onClick={() => setTab(2)}>
								Edit
							</button>
							<button className="border-b border-neutral-200 py-4 text-red-500 dark:border-neutral-800" onClick={() => setTab(1)}>
								Delete
							</button>
							<button className="py-4" onClick={() => setPopup(false)}>
								Cancel
							</button>
						</div>
					) : tab === 1 ? (
						<div className="flex w-full max-w-[400px]  flex-col rounded-md bg-white font-bold dark:bg-neutral-900">
							<span className="grid place-items-center border-b border-neutral-200 py-4 dark:border-neutral-800">Are you sure?</span>
							<button className="border-b border-neutral-200 py-4 text-red-500 dark:border-neutral-800" onClick={deletePost}>
								Yes
							</button>
							<button className="border-b border-neutral-200 py-4 text-violet-500 dark:border-neutral-800" onClick={() => setTab(0)}>
								No
							</button>
							<button className="py-4" onClick={() => setPopup(false)}>
								Cancel
							</button>
						</div>
					) : (
						<div className="w flex w-full max-w-[400px] flex-col overflow-hidden rounded-md bg-white font-bold transition-width duration-500 ease-in-out dark:bg-neutral-900">
							<div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
								<button onClick={() => setTab(0)}>Back</button>
								<span>Edit</span>
								<button className=" text-violet-500" onClick={changeCaption}>
									Done
								</button>
							</div>

							<textarea
								placeholder="Write a caption."
								className="h-48 w-full resize-none p-2 dark:bg-neutral-900"
								value={value}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
								maxLength={2200}
							/>
						</div>
					)}
				</div>
			) : (
				<div id="popup" className="fixed z-[60] flex h-full w-full items-center justify-center bg-black/80 p-5" onClick={hidePopup}>
					<div className="flex w-full max-w-[400px]  flex-col  rounded-md bg-white font-bold dark:bg-neutral-900">
						<button className="border-b border-neutral-200 py-4 text-red-500 dark:border-neutral-800">Report</button>
						{user.user?.following?.includes(props.author) ? (
							<button className="border-b border-neutral-200 py-4 text-red-500 dark:border-neutral-800" onClick={unfollow}>
								Unfollow
							</button>
						) : (
							<button className="border-b border-neutral-200 py-4 text-green-500 dark:border-neutral-800" onClick={follow}>
								Follow
							</button>
						)}

						<button className="border-b border-neutral-200 py-4 dark:border-neutral-800">Share</button>
						<button className="border-b border-neutral-200 py-4 dark:border-neutral-800">Go to post</button>
						<button className="border-b border-neutral-200 py-4 dark:border-neutral-800">Copy link</button>
						<button className="py-4" onClick={() => setPopup(false)}>
							Cancel
						</button>
					</div>
				</div>
			)}
		</>
	);
}

//main component
export default function Post(props: IPost) {
	const mediaQuery = window.matchMedia("(max-width: 600px)");
	const postImageContainer2Ref = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(false);
	const [width, setWidth] = useState(window.innerWidth);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [picWidth, setPicWidth] = useState(0);
	const { setPost, user, comments, setComments, userPost, setUser, userProfile, setUserProfile, popup, setPopup, setErrorMessage, setErrorOpen } = useContext(App);

	async function fetchData() {
		setLoading(true);
		await instance
			.post(`/post/comments/${props.id}`)
			.then((res) => {
				setLoading(false);
				setComments(res.data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	}

	async function unfollow() {
		const userProfileIndex = userProfile.user?.followers?.indexOf(user.user?._id ?? "");
		const userIndex = user.user?.following?.indexOf(props.author);
		let userProfileCopy = [...(userProfile.user?.followers ?? [])];
		let userCopy = [...(user.user?.following ?? [])];
		userProfileCopy.splice(userProfileIndex ?? 0, 1);
		userCopy.splice(userIndex ?? 0, 1);
		await instance
			.post(`/main_user/follow/${props.author}`, {
				user: user.user?._id,
			})
			.then(() => {
				setUserProfile({
					...userProfile,
					user: {
						...userProfile.user,
						followers: userProfileCopy,
					},
				});
				setUser({
					...user,
					user: {
						...user.user,
						following: userCopy,
					},
				});
				setPopup(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function follow() {
		await instance
			.post(`/main_user/follow/${props.author}`, {
				user: user.user?._id,
			})
			.then(() => {
				setUserProfile({
					...userProfile,
					user: {
						...userProfile.user,
						followers: [...(userProfile.user?.followers ?? []), user.user?._id ?? ""],
					},
				});
				setUser({
					...user,
					user: {
						...user.user,
						following: [...(user.user?.following ?? []), props.author],
					},
				});
				setPopup(false);
			})
			.catch((err) => {});
	}

	function hidePost(e: any) {
		if ((e.target as HTMLDivElement).id === "post-image-container") {
			setPost(false);
			setComments([]);
		}
	}

	function updateImageDimensions() {
		if (mediaQuery.matches) {
			return {
				objectFit: "cover",
			};
		} else {
			return {
				objectFit: "contain",
			};
		}
	}

	useEffect(() => {
		fetchData();
		const img = new Image();
		img.src = props.post;

		img.onload = () => {
			const imageWidth = img.width;
			const imageHeight = img.height;
			setImageLoaded(true);
			imageHeight > imageWidth ? (imageHeight > 2000 ? setPicWidth(450) : setPicWidth(500)) : setPicWidth(1000);
		};
		const handleResize = () => {
			setWidth(window.innerWidth);
		};
		const handleClickOutside = (e: any) => {
			if (e.target.id === "post-modal") {
				setPost(false);
				setComments([]);
			}

			if (postImageContainer2Ref.current && postImageContainer2Ref.current === (e.target as Node)) {
				setComments([]);
				setPost(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			id="post-modal"
			className="fixed left-0 top-0 z-[100] flex h-full w-full bg-black/80 phone:h-[100svh] phone:flex-col phone:overflow-y-auto phone:bg-neutral-100 dark:phone:bg-neutral-900"
			onClick={hidePost}>
			<div className="close fixed left-[20px] top-[20px] z-50 rounded-full bg-white/25  p-2 hover:cursor-pointer">
				<AiOutlineClose color="white" size={20} className="" onClick={() => setPost(false)} />
			</div>
			{popup && <Popup author={props.author} postId={props.id} postIndex={userPost.index} />}
			<div className="fixed top-0 z-50 w-full">
				<div className="relative hidden  min-h-[83px] place-items-center justify-between bg-white p-5 dark:bg-neutral-900 phone:flex">
					<BsChevronLeft size={24} className=" hover:cursor-pointer" onClick={() => setPost(false)} />
					<span className="text-base">
						<b>post</b>
					</span>
					<BsThreeDots size={16} className="hover:cursor-pointer" onClick={() => setPopup(true)} />
				</div>
			</div>

			<div
				id="post-image-container"
				className={` relative  flex h-screen w-full max-w-[1526.84px]  items-center justify-center p-10 phone:mt-[83px] phone:p-0`}
				onClick={hidePost}>
				<div className="post-title relative  hidden place-items-center justify-between bg-white p-5 dark:bg-neutral-900">
					<BsChevronLeft size={24} className=" hover:cursor-pointer" onClick={() => setPost(false)} />
					<span className="text-base">
						<b>post</b>
					</span>
					<BsThreeDots size={16} className="hover:cursor-pointer" onClick={() => setPopup(true)} />
				</div>
				{imageLoaded ? (
					<div
						ref={postImageContainer2Ref}
						id="post-image-container-2"
						className={`post-image-container flex  h-[800px] ${picWidth} phone:w-full  phone:min-h-[calc(100svh-148px)] phone:max-h-[calc(100svh-148px)] relative items-center justify-center  p-5 transition-width phone:bg-white phone:p-0 phone:dark:bg-black`}>
						<ImageTag
							className="object-contain phone:cover"
							priority
							id="post-image"
							src={props.post}
							alt="post"
							height={800}
                     width={picWidth}
                     sizes="(max-width:1100px) 100vw"
						/>
					</div>
				): (
               <div className={`phone:min-h-[calc(100svh-148px)] phone:max-h-[calc(100svh-148px)] phone:dark:bg-black phone:w-full grid place-items-center text-2xl` }>
                  Loading...
               </div>
            )}
			</div>
			<div className="sticky top-[83px] z-50 hidden w-[400px]  max-w-[400px] flex-col  justify-between gap-4 border-b border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 phone:flex phone:w-full phone:max-w-none">
				<div className="flex justify-between ">
					<Link href={`/${props.usernameOrText}`}>
						<User fullname={props.fullname} avatar={props.avatar} usernameOrText={props.usernameOrText} type="post" />
					</Link>
					<div className="flex items-center gap-2 ">
						{user.user?._id !== props.author && (
							<>
								{user.user?.following?.includes(props.author) ? (
									<button className="rounded-md border border-violet-500 p-2  px-4 text-violet-500 transition-colors hover:bg-violet-500 hover:text-white">
										<b>Unfollow</b>
									</button>
								) : (
									<button className="rounded-md border border-violet-500 p-2  px-4 text-violet-500 transition-colors hover:bg-violet-500 hover:text-white">
										<b>Follow</b>
									</button>
								)}
							</>
						)}
						<BsThreeDots size={16} className="hover:cursor-pointer phone:hidden" onClick={() => setPopup(true)} />
					</div>
				</div>
			</div>
			<div className={`comments-box  h-full w-[400px] min-w-[400px] max-w-[400px] bg-white dark:bg-neutral-900  phone:w-full phone:min-w-0 phone:max-w-none`}>
				<div className="flex flex-col gap-4 border-b border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 phone:hidden">
					<div className="flex max-w-[500px] justify-between ">
						<Link href={`/${props.usernameOrText}`} className="max-w-[240px] ">
							<User fullname={props.fullname} avatar={props.avatar} usernameOrText={props.usernameOrText} type="post" />
						</Link>
						<div className="flex items-center gap-2">
							{user.user?._id !== props.author && (
								<>
									{user.user?.following?.includes(props.author) ? (
										<button
											className="rounded-md border border-violet-500 p-2  px-4 text-violet-500 transition-colors hover:bg-violet-500 hover:text-white"
											onClick={unfollow}>
											<b>Unfollow</b>
										</button>
									) : (
										<button
											className="rounded-md border border-violet-500 p-2  px-4 text-violet-500 transition-colors hover:bg-violet-500 hover:text-white"
											onClick={follow}>
											<b>Follow</b>
										</button>
									)}
								</>
							)}
							<BsThreeDots size={16} className="threedots hover:cursor-pointer" onClick={() => setPopup(true)} />
						</div>
					</div>
				</div>
				{loading ? (
					<div
						className={`grid  place-items-center space-y-5 overflow-y-auto bg-neutral-100 p-5 text-base  dark:bg-neutral-950 phone:w-full ${
							width > 600 && "h-[calc(100%-(83px+65px))]"
						} phone:pb-[85px]`}>
						<div className="circle"> </div>
					</div>
				) : (
					<>
						{comments.length === 0 && userPost.caption.length === 0 ? (
							<div
								className={`grid  place-items-center space-y-5 overflow-y-auto bg-neutral-100 p-5 text-base  dark:bg-neutral-950 phone:w-full ${
									width > 600 ? "h-[calc(100%-(83px+65px))]" : "h-full"
								} phone:pb-[85px]`}>
								Be the first to comment
							</div>
						) : (
							<div
								className={`space-y-5  overflow-y-auto bg-neutral-100 p-5   dark:bg-neutral-950 phone:w-full  ${
									width > 600 && "h-[calc(100%-(83px+65px))]"
								} phone:min-h-[100svh]`}>
								{userPost.caption.length > 1 && userPost && (
									<Comment
										createdAt={userPost.createdAt}
										avatar={userPost.avatar}
										fullname={userPost.fullname}
										text={userPost.caption}
										id={userPost._id}
										index={userPost.index}
										key={userPost.index}
										caption={true}
										edited={userPost.edited}
									/>
								)}
								{comments.map((key: any, postIndex: number) => {
									return (
										<Comment
											createdAt={key.comments_info.createdAt}
											avatar={key.comments_info.authorDetails.avatar}
											fullname={key.comments_info.authorDetails.fullname}
											text={key.comments_info.text}
											id={key.comments_info.authorDetails._id}
											index={postIndex}
											key={postIndex}
											caption={false}
											commentId={key.comments_info._id}
											likes={key.comments_info.likes}
											postId={props.id}
										/>
									);
								})}
							</div>
						)}
					</>
				)}

				<div className="flex w-full  flex-col  items-center gap-2  border-t border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 phone:hidden">
					<div className="flex w-full  items-center  justify-between gap-2  border-neutral-200 p-5  ">
						<TypeComment id={props.id} />
					</div>
				</div>
			</div>

			<div className="fixed bottom-0 z-[60] hidden w-full  items-center justify-between gap-2 border-t border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 phone:flex">
				<TypeComment id={props.id} />
			</div>
		</div>
	);
}
