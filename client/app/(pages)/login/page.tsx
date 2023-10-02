"use client";
import { ChangeEvent, useState } from "react";
import Gallery from "../../../components/common/gallery";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function Page() {
	const router = useRouter();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("...");
	const [isChecked, setChecked] = useState(false);
	const [data, setData] = useState({
		email: "",
		password: "",
	});
	const instance = axios.create({
		baseURL: process.env.url,
		withCredentials: true,
	});

	function input(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setData((state) => ({
			...state,
			[name]: value,
		}));
	}

	async function login(e: any) {
		console.log("Here");
		e.preventDefault();
		setError(false);
		setMessage("message");
		setLoading(true);
		await instance
			.post("/login", data)
			.then((res) => {
				setError(false);
				setMessage("...");
				setLoading(true);
				router.push("/");
			})
			.catch((err) => {
				setError(true);
				setLoading(false);
				setMessage(err.response.data);
				setLoading(false);
			});
	}

	return (
		<div className="relative flex h-screen w-screen overflow-hidden  overflow-y-auto text-xs dark:bg-neutral-900">
			<div className=" margin-b-24 flex w-[38vw] min-w-[500px] flex-col items-center justify-center  p-14 phone:h-screen phone:w-full phone:min-w-[100%] landscape:min-w-[400px] landscape:p-10 phone:landscape:block">
				<form onSubmit={login} className="flex w-[80%] flex-col space-y-5 text-neutral-800 phone:w-[100%]">
					<span className="text-4xl font-bold text-neutral-700 dark:text-neutral-200">Login</span>
					<div className="flex flex-col space-y-1">
						<span className="dark:text-neutral-200">Email Address</span>
						<input
							className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs placeholder:text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
							type="email"
							placeholder="example@mail.com"
							name="email"
							value={data.email}
							onChange={input}
							onFocus={(e) => e.preventDefault()}
						/>
					</div>
					<div className="flex flex-col space-y-1 ">
						<span className="dark:text-neutral-200">Password</span>
						<input
							autoComplete="off"
							className="rounded-lg border border-neutral-200 p-2 placeholder:text-xs placeholder:text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
							type="password"
							placeholder="password"
							name="password"
							value={data.password}
							onChange={input}
							onFocus={(e) => e.preventDefault()}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<button
								type="button"
								className={`flex w-10 min-w-[40px] items-center rounded-full transition-colors hover:cursor-pointer ${
									isChecked ? "bg-violet-600" : "bg-neutral-400 "
								}`}
								onClick={(e) => {
									e.preventDefault();
									setChecked(!isChecked);
								}}>
								<div className={`m-[2px] h-5 w-5 rounded-full bg-white  transition-transform ${isChecked ? "translate-x-4" : "translate-x-0"}`} />
							</button>
							<span className="dark:text-neutral-200">Keep me signed in</span>
						</div>
						<span className=" text-violet-600">Forgot password</span>
					</div>
					<button className="mb-10 w-full rounded bg-violet-600 p-2 text-white " onClick={login}>
						<span>{loading ? "Loading..." : "Login"}</span>
					</button>
					<div className="my-5 ">
						<span className="dark:text-neutral-200">Dont have an account? </span>
						<Link href={"/register"} className="text-violet-600">
							Sign up
						</Link>
					</div>
					<span className={`flex w-full justify-center text-red-500 ${error ? "visible" : "invisible"}`}>{message}</span>
				</form>
			</div>
			<Gallery />
		</div>
	);
}
