"use client";
import axios from "axios";
import { App } from "../../app/context";
import { useContext } from "react";

export default function EditAvatar() {
	const { user, setUser, setChangeProfile, userProfile, setUserProfile, setErrorMessage, setErrorOpen } = useContext(App);
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_URL,
		withCredentials: true,
		headers: { "Content-Type": "multipart/form-data" },
	});
	const hidePopup = (e: React.MouseEvent<HTMLDivElement>) => (e.target as HTMLDivElement).id === "popup-profile" && setChangeProfile(false);
	return (
		<div id="popup-profile" className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/80 p-5" onClick={hidePopup}>
			<div className="flex w-full max-w-[300px]  flex-col rounded-md bg-white font-bold dark:bg-neutral-900">
				<span className="grid place-items-center border-b border-neutral-200 py-4 dark:border-neutral-800">Change Profile Photo</span>
				<button
					className="border-b border-neutral-200 py-4 text-violet-500 dark:border-neutral-800"
					onClick={() => document.getElementById("file-input-upload-photo")?.click()}>
					Upload Photo
				</button>
				<button
					className="border-b border-neutral-200 py-4 text-red-500 dark:border-neutral-800"
					onClick={async () => {
						await instance
							.post("/image/profile/delete")
							.then((res: any) => {
								setUser({
									...user,
									user: { ...user.user, avatar: res.data },
								});
								if (user.user?._id === userProfile.user?._id)
									setUserProfile({
										...userProfile,
										user: {
											...userProfile.user,
											avatar: res.data,
										},
									});
								setChangeProfile(false);
							})
							.catch((err: any) => {
								setErrorMessage(err.response.data);
								setErrorOpen(true);
							});
					}}>
					Delete Photo
				</button>
				<button className="py-4" onClick={() => {}}>
					Cancel
				</button>
			</div>
			<input
				id="file-input-upload-photo"
				type="file"
				name="post"
				accept="image/png, image/jpeg"
				className="hidden"
				onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
					if (e.target.files && e.target.files.length > 0) {
						console.log(URL.createObjectURL(e.target.files?.[0]));
						const formData = new FormData();
						formData.append("image", e.target.files?.[0]);
						await instance
							.post("/image/profile/upload", formData)
							.then((res: any) => {
								setUser({
									...user,
									user: { ...user.user, avatar: res.data },
								});
								if (user.user?._id === userProfile.user?._id)
									setUserProfile({
										...userProfile,
										user: {
											...userProfile.user,
											avatar: res.data,
										},
									});
								setChangeProfile(false);
							})
							.catch((err: any) => {
								setErrorMessage(err.response.data);
								setErrorOpen(true);
							});
					}
				}}
			/>
		</div>
	);
}
