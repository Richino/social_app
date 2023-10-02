"use client";
import { useRouter } from "next/navigation";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { HeaderProps } from "../../app/(interface)/header";

export default function Header(props: HeaderProps) {
	const router = useRouter();
	nprogress.configure({ showSpinner: false });
	function showAll(type: string) {
		nprogress.start();
		router.push(type);
	}

	return (
		<div className="flex items-center justify-between p-5">
			<span className="text-sm ">
				<b>{props.title}</b>
			</span>
			<button className="text-neutral-500" onClick={() => showAll(props.url)}>
				Show all
			</button>
		</div>
	);
}
