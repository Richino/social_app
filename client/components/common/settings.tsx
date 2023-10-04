import { useRef, useContext, MouseEvent, ChangeEvent, useState } from "react";
import { App } from "../../app/context";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
export default function Settings() {
	const { settings, setSettings,setLogout } = useContext(App);
	const ref = useRef<HTMLDivElement>(null);

	const [index, setIndex] = useState(0);
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
		baseURL: process.env.NEXT_PUBLIC_URL,
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

	function closeModal(e: MouseEvent<HTMLDivElement>) {
		if (ref.current && ref.current === (e.target as Node)) {
			setSettings({ ...settings, isSettingOpen: false });
		}
	}

	function closeModal2() {
		setSettings({ ...settings, isSettingOpen: false });
	}
	return (
		<div ref={ref} className="fixed top-0 z-[100] h-full w-full bg-black/80" onClick={closeModal}>
			<div className="absolute bottom-0  flex w-full flex-col bg-white dark:bg-neutral-900">
				<button
					className="border-b border-neutral-200 p-5 dark:border-neutral-800"
					onClick={() => {
						setIndex(1);
					}}>
					Edit Profile
				</button>
				<button
					className="border-b border-neutral-200 p-5 dark:border-neutral-800"
					onClick={() => {
						setIndex(2);
					}}>
					Change Password
				</button>
				<button className="border-b border-neutral-200 p-5 dark:border-neutral-800">Activity</button>
				<button
					className="border-b border-neutral-200 p-5 dark:border-neutral-800"
					onClick={() => {
						setIndex(3);
					}}>
					Apperance
				</button>
				<button className="border-b border-neutral-200 p-5 text-rose-500 dark:border-neutral-800" onClick={() =>{
                    setLogout(true);
                }}>Logout</button>
				<button className=" p-5" onClick={closeModal2}>
					Close
				</button>
			</div>
			{index > 0 && (
				<div className={`fixed top-0 h-full w-full`}>
					{index == 1 ? (
						<div className="flex h-full w-full flex-col items-center justify-center  gap-2 bg-white dark:bg-neutral-900 p-5 pg">
							<BsChevronLeft size={24} className=" absolute left-[20px] top-[20px] hover:cursor-pointer" onClick={() => setIndex(0)} />
							<div className="flex w-[280px] items-center justify-between phone:w-full gap-10">
								<span className="phone:min-w-[60px]">Fullname</span>
								<input
									type="text"
									name="fullname"
									className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 phone:w-full"
									value={data.fullname}
									onChange={input}
								/>
							</div>
							<div className="flex w-[280px] items-center justify-between phone:w-full gap-10">
								<span className="phone:min-w-[60px]">Username</span>
								<input
									type="text"
									name="username"
									className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 phone:w-full"
									value={data.username}
									onChange={input}
								/>
							</div>
							<div className="flex w-[280px] items-center justify-between phone:w-full gap-10">
								<span className="phone:min-w-[60px]">Email</span>
								<input
									type="text"
									name="email"
									className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 phone:w-full"
									value={data.email}
									onChange={input}
								/>
							</div>
							<div className="flex w-[280px] items-center justify-between phone:w-full gap-10">
								<span className="phone:min-w-[60px]">Bio</span>
								<textarea
									maxLength={150}
									name="bio"
									className="w-[188px] rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 phone:w-full"
									value={data.bio}
									onChange={input}
								/>
							</div>
							<button className="mt-5 w-full max-w-[280px] rounded bg-violet-500 p-1 text-white phone:max-w-none" onClick={() => update("bio")}>
								Save
							</button>
							{success && <span className="text-green-500">{message}</span>}
							{error && <span className="text-red-500">{message}</span>}
						</div>
					) : index == 2 ? (
						<div className="h-full w-full bg-white p-5 dark:bg-neutral-900">
							<BsChevronLeft size={24} className=" absolute left-[20px] top-[20px] hover:cursor-pointer" onClick={() => setIndex(0)} />
							<div className="flex h-full w-full  flex-col items-center  justify-center gap-2">
								<div className="shrink-1 flex w-[300px] items-center justify-between gap-10 phone:w-full">
									<span className="shrink-0 phone:min-w-[115px]">Old Password</span>
									<input
										type="password"
										name="password"
										className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 phone:w-full"
										value={data.password}
										onChange={input}
									/>
								</div>
								<div className="flex w-[300px] items-center justify-between gap-10 phone:w-full">
									<span className="shrink-0 phone:min-w-[115px]">New Password</span>
									<input
										type="password"
										name="newPassword"
										className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 phone:w-full"
										value={data.newPassword}
										onChange={input}
									/>
								</div>
								<div className="flex w-[300px] items-center justify-between gap-10 phone:w-full">
									<span className="shrink-0 phone:min-w-[115px]">Confirm Password</span>
									<input
										type="password"
										name="confirmPassword"
										className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 phone:w-full"
										value={data.confirmPassword}
										onChange={input}
									/>
								</div>
								<button className="mt-5 w-full max-w-[280px] rounded bg-violet-500 p-1 text-white phone:w-full phone:max-w-none" onClick={() => update("password")}>
									Save
								</button>
								{success && <span className="text-green-500">{message}</span>}
								{error && <span className="text-red-500">{message}</span>}
							</div>
						</div>
					) : index == 3 ? (
						<div className="h-full w-full bg-white p-5 dark:bg-neutral-900">
							<BsChevronLeft size={24} className=" absolute left-[20px] top-[20px] hover:cursor-pointer" onClick={() => setIndex(0)} />
							<div className="flex h-full w-full flex-col items-center justify-center  gap-2">
								<button
									className="rounded-md border border-neutral-200 bg-white p-2 px-5 dark:border-neutral-800 dark:text-neutral-950 phone:w-full"
									onClick={() => {
										document.getElementById("html")?.classList.remove("dark");
										localStorage.setItem("theme", "light");
									}}>
									Light
								</button>
								<button
									className="rounded-md border border-neutral-200 bg-neutral-950 p-2 px-5 text-white dark:border-neutral-800 phone:w-full"
									onClick={() => {
										document.getElementById("html")?.classList.add("dark");
										localStorage.setItem("theme", "dark");
									}}>
									Dark
								</button>
							</div>
						</div>
					) : (
						<div className="h-full w-full bg-white dark:bg-neutral-900">
							<BsChevronLeft size={24} className=" absolute left-[20px] top-[20px] hover:cursor-pointer" onClick={() => setIndex(0)} />
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
			)}
		</div>
	);
}
