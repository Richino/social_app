import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { App } from "../../app/context";
export default function Logout() {
	const router = useRouter();
	const ref = useRef<HTMLDivElement>(null);
	const { setLogout } = useContext(App);
	const instance = axios.create({
		baseURL: process.env.url,
		withCredentials: true,
	});

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && ref.current === (e.target as HTMLDivElement)) setLogout(false);
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	return (
		<div ref={ref} className="fixed top-0  z-[150] grid h-full w-full place-items-center bg-black/80">
			<div className="flex w-full max-w-[400px]  flex-col rounded-md bg-white font-bold dark:bg-neutral-900">
				<span className="grid place-items-center border-b border-neutral-200 py-4 dark:border-neutral-800">Logout?</span>
				<button
					className="border-b border-neutral-200 py-4 text-red-500 dark:border-neutral-800"
					onClick={() => {
						instance.post(`/logout`).then(() => {
							setLogout(false);
							router.push("/login");
						});
					}}>
					Yes
				</button>
				<button
					className=" py-4 text-violet-500 "
					onClick={() => {
						setLogout(false);
					}}>
					No
				</button>
			</div>
		</div>
	);
}
