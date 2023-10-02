"use client";
import { useState, useContext, ChangeEvent } from "react";
import { App } from "../../context";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
	const [index, setIndex] = useState(1);
	const { user, setUser } = useContext(App);
	const [data, setData] = useState({
		fullname: user.user?.fullname,
		username: user.user?.username,
		email: user.user?.email,
		bio: user.user?.bio,
		password: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [message, setMessage] = useState("");
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);
	const router = useRouter();
	const instance = axios.create({
		baseURL: process.env.url,
		withCredentials: true,
	});

	function input(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setData((state) => ({
			...state,
			[name]: value,
		}));
	}

	function update(type: string) {
		instance
			.post(`main_user/update/user/${type}`, data)
			.then((res) => {
				setError(false);
				setUser({ ...user, user: res.data });
				setMessage("Updated successfully");
				setSuccess(true);

				setTimeout(() => {
					setMessage("");
					setSuccess(false);
					setError(false);
				}, 3000);
			})
			.catch((e) => {
				setSuccess(false);
				setMessage(e.response.data);
				setError(true);
			});
	}

	function changeTab(tab: number) {
		setMessage("");
		setSuccess(false);
		setError(false);
		setIndex(tab);
	}

	return (
		<div className="flex h-[calc(100%-58px)] w-full flex-shrink-0 flex-col  items-center gap-5 overflow-y-scroll bg-neutral-100 p-5 text-sm dark:bg-neutral-950 phone:fixed phone:top-[52px] phone:mb-[60px]  phone:h-[calc(100%-(60px+52px))] tablet:p-0 tablet:phone:block">
			<div className="message-container flex h-full w-full max-w-[1000px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 phone:relative phone:block phone:border-0">
				<div className=" phone:max-w-ful min-w-[380px] max-w-[380px] overflow-y-auto border-r    border-neutral-200 dark:border-neutral-800 phone:min-w-full">
					<button
						className={`w-full border-l-4 p-5 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-800  ${
							index == 1 ? "border-l-violet-500 bg-neutral-200 dark:bg-neutral-800" : "border-l-transparent "
						}`}
						onClick={() => changeTab(1)}>
						Edit Profile
					</button>
					<button
						className={`w-full border-l-4  p-5 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
							index == 2 ? "border-l-violet-500 bg-neutral-200 dark:bg-neutral-800" : "border-l-transparent "
						}`}
						onClick={() => changeTab(2)}>
						Change Password
					</button>
					<button
						className={`w-full border-l-4  p-5 py-2 text-left hover:bg-neutral-200  dark:hover:bg-neutral-800  ${
							index == 3 ? "border-l-violet-500 bg-neutral-200 dark:bg-neutral-800" : "border-l-transparent "
						}`}
						onClick={() => changeTab(3)}>
						Change Apperance
					</button>
					<button
						className={`w-full border-l-4  p-5 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-800  ${
							index == 4 ? "border-l-violet-500 bg-neutral-200 dark:bg-neutral-800" : "border-l-transparent "
						}`}
						onClick={() => changeTab(4)}>
						Logout
					</button>
				</div>
				<div className="h-full w-full ">
					{index == 1 ? (
						<div className="flex h-full w-full flex-col items-center justify-center  gap-2">
							<div className="flex w-[280px] items-center justify-between">
								<span>Fullname</span>
								<input
									type="text"
									name="fullname"
									className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950"
									value={data.fullname}
									onChange={input}
								/>
							</div>
							<div className="flex w-[280px] items-center justify-between">
								<span>Username</span>
								<input
									type="text"
									name="username"
									className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950"
									value={data.username}
									onChange={input}
								/>
							</div>
							<div className="flex w-[280px] items-center justify-between">
								<span>Email</span>
								<input
									type="text"
									name="email"
									className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950"
									value={data.email}
									onChange={input}
								/>
							</div>
							<div className="flex w-[280px] items-center justify-between">
								<span>Bio</span>
								<textarea
									maxLength={150}
									name="bio"
									className="w-[188px] rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950"
									value={data.bio}
									onChange={input}
								/>
							</div>
							<button className="mt-5 w-full max-w-[280px] rounded bg-violet-500 p-1 text-white" onClick={() => update("bio")}>
								Save
							</button>
							{success && <span className="text-green-500">{message}</span>}
							{error && <span className="text-red-500">{message}</span>}
						</div>
					) : index == 2 ? (
						<div className="h-full w-full">
							<div className="flex h-full w-full  flex-col items-center  justify-center gap-2">
								<div className="flex w-[300px] items-center justify-between">
									<span>Old Password</span>
									<input
										type="password"
										name="password"
										className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950"
										value={data.password}
										onChange={input}
									/>
								</div>
								<div className="flex w-[300px] items-center justify-between">
									<span>New Password</span>
									<input
										type="password"
										name="newPassword"
										className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950"
										value={data.newPassword}
										onChange={input}
									/>
								</div>
								<div className="flex w-[300px] items-center justify-between">
									<span>Confirm Password</span>
									<input
										type="password"
										name="confirmPassword"
										className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950"
										value={data.confirmPassword}
										onChange={input}
									/>
								</div>
								<button className="mt-5 w-full max-w-[280px] rounded bg-violet-500 p-1 text-white" onClick={() => update("password")}>
									Save
								</button>
								{success && <span className="text-green-500">{message}</span>}
								{error && <span className="text-red-500">{message}</span>}
							</div>
						</div>
					) : index == 3 ? (
						<div className="h-full w-full">
							<div className="flex h-full w-full flex-col items-center justify-center  gap-2">
								<button
									className="rounded-md border border-neutral-200 bg-white p-2 px-5 dark:border-neutral-800 dark:text-neutral-950"
									onClick={() => {
										document.getElementById("html")?.classList.remove("dark");
										localStorage.setItem("theme", "light");
									}}>
									Light
								</button>
								<button
									className="rounded-md border border-neutral-200 bg-neutral-950 p-2 px-5 text-white dark:border-neutral-800"
									onClick={() => {
										document.getElementById("html")?.classList.add("dark");
										localStorage.setItem("theme", "dark");
									}}>
									Dark
								</button>
							</div>
						</div>
					) : (
						<div className="h-full w-full">
							<div className="flex h-full w-full flex-col items-center justify-center  gap-2">
								<span>Are you Sure?</span>
								<button
									className="rounded-md border border-neutral-200  p-2 px-5 "
									onClick={() => {
										instance.post(`/logout`).then(() => {
											router.push("/login");
										});
									}}>
									Yes
								</button>
								<button className="rounded-md border border-neutral-200 bg-rose-500 p-2 px-5 text-white">No</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
