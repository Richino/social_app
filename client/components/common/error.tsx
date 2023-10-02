import { useContext, useRef, useEffect } from "react";
import { App } from "../../app/context";

export default function Error() {
	const { errorMessage, setErrorOpen, setErrorMessage } = useContext(App);
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && ref.current === (e.target as HTMLDivElement)) {
				setErrorMessage("");
				setErrorOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	return (
		<div ref={ref} className="fixed left-0 top-0 z-[150] grid h-full w-full place-items-center bg-black/80 p-5 text-white">
			<div className="relative grid   w-[400px] place-items-center rounded bg-white  dark:bg-neutral-900 phone:w-full">
				<span className=" w-full  border-b border-neutral-200 p-5 text-center text-neutral-900 dark:border-neutral-800 dark:text-neutral-200 font-bold">Error</span>
				<span className=" w-full  border-b border-neutral-200 p-5 text-center text-neutral-900 dark:border-neutral-800 dark:text-neutral-200">{errorMessage}</span>
				<button
					className="p-5 text-red-500"
					onClick={() => {
						setErrorMessage("");
						setErrorOpen(false);
					}}>
					Dismiss
				</button>
			</div>
		</div>
	);
}
