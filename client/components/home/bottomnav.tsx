import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext,  useEffect, useRef } from "react";
import { AiFillHome, AiOutlineHome, AiFillMessage, AiOutlineMessage } from "react-icons/ai";
import { MdExplore, MdOutlineExplore } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import { App } from "../../app/context";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

import Avatar from "../common/avatar";

export default function Bottomnav() {
	const pathname = usePathname();
	const { user, setBottomNavOffset, openCreatePost } = useContext(App);
	const ref = useRef<HTMLDivElement>(null);
	nprogress.configure({ showSpinner: false });

	useEffect(() => {
		setBottomNavOffset(ref.current?.offsetTop);
	}, []);
	return (
		<div ref={ref} className="fixed bottom-0 left-0 z-50 hidden w-full items-center justify-center gap-5 border-t border-slate-200 bg-white p-2 tablet:phone:flex dark:bg-neutral-900  dark:border-neutral-800">
			<div className="flex  items-center  gap-5 w-full justify-between px-5">
				{pathname === "/" ? (
					<Link href={"/"}>
						<AiFillHome className="hover:cursor-pointer" size={24} />
					</Link>
				) : (
					<Link href={"/"}>
						<AiOutlineHome className="hover:cursor-pointer" size={24} onClick={() => nprogress.start()} />
					</Link>
				)}
				{pathname === "/explore" ? (
					<Link href={"/explore"}>
						<MdExplore className="hover:cursor-pointer" size={24} />
					</Link>
				) : (
					<Link href={"/explore"}>
						<MdOutlineExplore className="hover:cursor-pointer" size={24} onClick={() => nprogress.start()} />
					</Link>
				)}
				{pathname === "/messages" ? (
					<Link href={"/messages"}>
						<AiFillMessage className="hover:cursor-pointer" size={24} />
					</Link>
				) : (
					<Link href={"/messages"}>
						<AiOutlineMessage className="hover:cursor-pointer" size={24} onClick={() => nprogress.start()} />
					</Link>
				)}
				<VscDiffAdded className="hover:cursor-pointer" size={24} onClick={() => openCreatePost(true)} />
				{pathname === "/" + user.user?.username ? (
					<Avatar story={false} height={42} width={42} image={user.user?.avatar ?? ""} />
				) : (
					<Link href={"/" + user.user?.username} onClick={() => nprogress.start()}>
						<Avatar story={false} height={42} width={42} image={user.user?.avatar ?? ""} />
					</Link>
				)}
			</div>
		</div>
	);
}
