"use client";
import { App } from "../../app/context";
import Image from "next/image";
import { useContext, useState } from "react";
import { BsChevronLeft } from "react-icons/bs";
import User from "../home/user";
import axios from "axios";

export default function Create() {
	const [index, setIndex] = useState(1);
	const [url, setUrl] = useState<any>("");
	const [value, setValue] = useState("");
	const [image, setImage] = useState<any>("");
	const { user, openCreatePost, setUserProfile, userProfile, setErrorOpen, setErrorMessage } = useContext(App);
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_URL,
		withCredentials: true,
		headers: { "Content-Type": "multipart/form-data" },
	});

	const uploadPhoto = async (e: any) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("image", image);
		formData.append("caption", value);
		await instance
			.post("/image/post/upload", formData)
			.then((res) => {
				if (res.data.author === user.user?._id) {
					setUserProfile({
						...userProfile,
						post: [res.data, ...(userProfile.post ?? [])],
					});
				}
				openCreatePost(false);
			})
			.catch((err) => {
				setErrorMessage(err.response.data);
				setErrorOpen(true);
			});
	};

	const generatePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const base64DataUrl = event.target?.result;
				setUrl(base64DataUrl);
				setImage(file);
			};
			reader.readAsDataURL(file);
		}
		setIndex(2);
	};

	return (
		<div
			id="create-post"
			className="fixed left-0 top-0 z-[80] flex h-screen w-full items-center justify-center bg-black/75 p-10"
			onClick={(e: React.MouseEvent<HTMLDivElement>) => (e.target as HTMLDivElement).id === "create-post" && openCreatePost(false)}>
			<div className=" grid aspect-square h-full place-items-center overflow-hidden phone:aspect-[4/5]">
				<div className="aspect-square w-full rounded bg-white dark:bg-neutral-900">
					<div className="flex items-center justify-between border-b border-neutral-200 p-3 dark:border-neutral-800">
						{index === 1 ? (
							<button className=" text-red-500" onClick={() => openCreatePost(false)}>
								<b>Close</b>
							</button>
						) : (
							<BsChevronLeft size={24} className=" hover:cursor-pointer" onClick={() => setIndex(index - 1)} />
						)}
						<span>
							<b>Create new post</b>
						</span>
						{index === 1 ? (
							<div />
						) : index === 2 ? (
							<button onClick={() => setIndex(3)}>Next</button>
						) : (
							<button className="text-violet-500" onClick={uploadPhoto}>
								<b>Post</b>
							</button>
						)}
					</div>
					<div className={`mt-[-33px] h-full place-items-center ${index == 1 ? "grid" : "hidden"}`}>
						<div className="grid place-items-center gap-5">
							<Image alt="create image" src={"assets/icons/gallery.svg"} height={80} width={80} />
							<button className="rounded-md bg-violet-500 p-5 py-2 text-white" onClick={() => document.getElementById("file-input")?.click()}>
								Select from computer
							</button>
							<input id="file-input" type="file" name="post" accept="image/png, image/jpeg" className="hidden" onChange={generatePhoto} />
						</div>
					</div>
					<div className={`h-[calc(100%-49px)] w-full place-items-center ${index >= 2 ? "flex" : "hidden"} relative phone:h-full`}>
						<div className={`relative h-full ${index == 3 ? "w-full phone:w-0" : "w-full"} bg-black transition-width duration-500 ease-in-out `}>
							<Image alt="create image" src={url} fill style={{ objectFit: "contain" }} />
						</div>
						<div className={`h-full ${index == 3 ? "w-full" : "w-0"} space-y-2 transition-width duration-500  ease-in-out`}>
							<div className="p-2">
								<User avatar={user.user?.avatar ?? ""} fullname={user.user?.fullname ?? ""} usernameOrText={""} type="create-post" />
							</div>
							<textarea
								placeholder="Write a caption."
								className="aspect-square h-48 w-full resize-none p-2 dark:bg-neutral-900 dark:placeholder:text-neutral-400"
								value={value}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
								maxLength={2200}
							/>
							<div className="p-2 text-neutral-500">
								<span>{`${value.length}/2200`}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
