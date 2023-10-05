import React, { useContext } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import nprogress from "nprogress";
import { BsThreeDots, BsBookmark } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoChatbubbleOutline } from "react-icons/io5";
import { RxShare1 } from "react-icons/rx";
import { App } from "../../app/context";
import User from "./user";
import { PostFeedProps } from "../../app/(interface)/postFeed";

export default function PostFeed(props: PostFeedProps) {
	nprogress.configure({ showSpinner: false });
	const { setPost, setUserPost, user, setUser } = useContext(App);
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_URL,
		withCredentials: true,
	});

	return (
		<div className="w-full rounded-lg border border-neutral-200 bg-white pb-5 dark:border-neutral-800 dark:bg-neutral-900 tablet:phone:rounded-none tablet:phone:px-0">
			<div className="flex items-center justify-between p-3">
				<div className="w-max overflow-visible hover:cursor-pointer">
					<Link href={`/${props.usernameOrText}`} onClick={() => nprogress.start()}>
						<User fullname={props.fullname} usernameOrText={props.usernameOrText} avatar={props.avatar} type="post-feed" />
					</Link>
				</div>
				<BsThreeDots size={16} className="hover:cursor-pointer" />
			</div>

			<div className="relative h-[398px] w-[398px] overflow-hidden bg-black hover:cursor-pointer phone:w-full" onClick={handlePostClick}>
				<Image
					src={props.post}
					alt="post"
					style={{ objectFit: "cover" }}
					fill
					priority
					sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
				/>
			</div>

			<div className="flex items-center justify-between p-3 py-2">
				<div className="flex gap-2">
					{renderLikeButton()}
					<IoChatbubbleOutline size={20} />
					<RxShare1 size={20} />
				</div>
				<BsBookmark size={16} />
			</div>

			<div className="px-3">
				<span>
					<b>{props.likes.length}</b> Likes
				</span>
			</div>

			<div className="px-3 pt-2">
				<span>
					<b>{props.fullname} </b>
					<span>{props.caption}</span>
				</span>
			</div>

			<button className="px-3 pt-2 text-neutral-400">{renderCommentButtonText()}</button>
		</div>
	);

	function handlePostClick() {
		const post = {
			_id: props.id,
			author: props.author,
			fullname: props.fullname,
			username: props.usernameOrText,
			caption: props.caption,
			imageUrl: props.post,
			avatar: props.avatar,
			index: props.index,
			followers: props.followers,
			createdAt: props.createdAt,
			edited: props.edited,
		};
		setPost(true);
		setUserPost(post);
	}

	function renderLikeButton() {
		const likedByUser = user.feed[props.index].likes.includes(user.user?._id ?? "");
		const likeIcon = likedByUser ? <AiFillHeart size={22} color="#7c3aed" /> : <AiOutlineHeart size={22} />;

		const handleLikeClick = async () => {
			try {
				await instance.post(`/main_user/like/${props.id}`, {
					user: user.user?._id,
					author: props.author,
				});

				const userFeedsCopy = { ...user };
				const index = userFeedsCopy.feed[props.index].likes.indexOf(user.user?._id ?? "");

				if (likedByUser) {
					userFeedsCopy.feed[props.index].likes.splice(index, 1);
				} else {
					userFeedsCopy.feed[props.index].likes.push(user.user?._id ?? "");
				}

				setUser(userFeedsCopy);
			} catch (error) {
				console.error("Error liking post:", error);
			}
		};

		return <button onClick={handleLikeClick}>{likeIcon}</button>;
	}

	function renderCommentButtonText() {
		const { comments } = props;

		if (comments === 1) {
			return `View the ${comments} comment`;
		} else if (comments > 1) {
			return `View all ${comments} comments`;
		} else {
			return "No comments";
		}
	}
}
