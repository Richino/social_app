"use client";
import { ChangeEvent, MouseEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import Gallery from "../../../components/common/gallery";
import Link from "next/link";
import axios from "axios";
export default function Page() {
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_URL,
		withCredentials: true,
	});
	const router = useRouter();
	const [isChecked, setChecked] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("...");
	const [data, setData] = useState({
		username: "",
		fullname: "",
		email: "",
		password: "",
		confirm_password: "",
	});

	function input(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setMessage("message");
		setError(false);
		setData((state) => ({
			...state,
			[name]: value,
		}));
	}

	async function register(e: any) {
		e.preventDefault();
		setError(false);
		setMessage("message");
		setLoading(true);
		await instance
			.post("/register", data)
			.then(() => router.push("/"))
			.catch((err) => {
				setError(true);
				setLoading(false);
				setMessage(err.response.data);
				setLoading(false);
			});
	}

	return (
		<div className="relative flex h-screen w-screen overflow-y-auto  text-xs dark:bg-neutral-900 phone:items-center phone:justify-center ">
			<div
				onSubmit={register}
				className=" margin-b-24 grid w-[38vw] min-w-[500px] place-items-center overflow-y-auto p-14 phone:w-full phone:min-w-[100%] phone:landscape:block phone:landscape:min-w-[400px] phone:landscape:p-10 ">
				<form className="flex w-[80%] flex-col space-y-5 text-neutral-800 dark:text-neutral-200 phone:w-[100%] phone:landscape:w-[100%]">
					<span className="text-4xl font-bold text-neutral-700 dark:text-neutral-200">Register</span>
					<div className="flex flex-col space-y-1">
						<span>Username</span>
						<input
							className="rounded-lg border p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-500"
							type="text"
							placeholder="johnk123"
							name="username"
							value={data.username}
							onChange={input}
						/>
					</div>
					<div className="flex flex-col space-y-1">
						<span>Fullname</span>
						<input
							className="bg-sl rounded-lg border p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-500"
							type="text"
							placeholder="John Kramer"
							name="fullname"
							value={data.fullname}
							onChange={input}
						/>
					</div>
					<div className="flex flex-col space-y-1">
						<span>Email</span>
						<input
							className="rounded-lg border p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-500"
							type="email"
							placeholder="example@mail.com"
							name="email"
							value={data.email}
							onChange={input}
						/>
					</div>
					<div className="flex flex-col space-y-1 ">
						<span>Password</span>
						<input
							className="rounded-lg border p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-500 dark:text-neutral-200"
							type="password"
							placeholder="7 + characters required"
							name="password"
							value={data.password}
							onChange={input}
						/>
					</div>
					<div className="flex flex-col space-y-1 ">
						<span>Confirm Password</span>
						<input
							className="rounded-lg border p-2 placeholder:text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:placeholder:text-neutral-500"
							type="password"
							placeholder="7 + characters required"
							name="confirm_password"
							value={data.confirm_password}
							onChange={input}
						/>
					</div>
					<div className="flex items-center justify-between ">
						<div className="flex items-center space-x-2">
							<button
								className={`flex w-10 min-w-[40px] items-center rounded-full transition-colors hover:cursor-pointer ${
									isChecked ? "bg-violet-600" : "bg-neutral-400 "
								}`}
								onClick={(e) => {
									e.preventDefault();
									setChecked(!isChecked);
								}}>
								<div className={`m-[2px] h-5 w-5 rounded-full bg-white  transition-transform ${isChecked ? "translate-x-4" : "translate-x-0"}`}></div>
							</button>
							<span>Keep me signed in</span>
						</div>
						<div className="phone:hidden landscape:hidden">
							<span>Already have an account? </span>
							<Link className="text-violet-600" href={"/login"}>
								Login
							</Link>
						</div>
					</div>
					<button className="mb-10 w-full rounded bg-violet-600 p-2 text-white" onClick={register}>
						<span>{loading ? "Loading..." : "Register"}</span>
					</button>
					<div className="hidden phone:block landscape:block">
						<span>Already have an account? </span>
						<Link className="text-violet-600" href={"/login"}>
							Login
						</Link>
					</div>
					<span className={`flex w-full justify-center text-red-500 ${error ? "visible" : "invisible"}`}>{message}</span>
				</form>
			</div>
			<Gallery />
		</div>
	);
}
