"use client";
import { MdOutlineExplore, MdExplore } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import { AiOutlineHome, AiFillHome, AiOutlineMessage, AiOutlineHeart, AiFillMessage, AiFillHeart } from "react-icons/ai";
import { RiSettings3Line, RiSettings3Fill } from "react-icons/ri";
import { BiSearch } from "react-icons/bi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Avatar from "../common/avatar";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { useContext } from "react";
import { App } from "../../app/context";
import { Kalam } from "@next/font/google";
const kalam = Kalam({
	weight: "400",
	subsets: ["latin"],
});

export default function Sidenav() {
	const pathname = usePathname();
	const { user,  setTabletSearch } = useContext(App);
	const changeTab = () => {
		nprogress.start();
		setTabletSearch(false);
	};

	return (
		<div className=" left-0  top-0 hidden min-w-[73px] h-full  flex-col items-center justify-between gap-12 overflow-y-auto overflow-x-hidden border-r border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 tablet:flex tablet:phone:hidden">
			<span className={`${kalam.className}  text-2xl font-bold`}>M</span>
			<div className="flex flex-col items-center  gap-12">
				{pathname === "/" ? (
					<Link href={"/"}>
						<AiFillHome className="hover:cursor-pointer" size={24} />
					</Link>
				) : (
					<Link href={"/"}>
						<AiOutlineHome className="hover:cursor-pointer" size={24} onClick={changeTab} />
					</Link>
				)}
				<div className="shrink-0 hover:cursor-pointer" onClick={() => setTabletSearch(true)}>
					<BiSearch size={24} />
				</div>

				{pathname === "/messages" ? (
					<Link href={"/messages"}>
						<AiFillMessage className="hover:cursor-pointer" size={24} />
					</Link>
				) : (
					<Link href={"/messages"}>
						<AiOutlineMessage className="hover:cursor-pointer" size={24} onClick={changeTab} />
					</Link>
				)}
				{pathname === "/activities" ? (
					<Link href={"/activities"}>
						<AiFillHeart className="hover:cursor-pointer" size={24} />
					</Link>
				) : (
					<Link href={"/activities"}>
						<AiOutlineHeart className="hover:cursor-pointer" size={24} onClick={changeTab} />
					</Link>
				)}
				<VscDiffAdded className="hover:cursor-pointer" size={24} />
				{pathname === `/${user.user?.username}` ? (
					<Link href={`/${user.user?.username}`}>
						<div className="h-[32px] w-[32px]">
							<Avatar story={false} height={32} width={32} image={`${user.user?.avatar}`} />
						</div>
					</Link>
				) : (
					<Link href={`/${user.user?.username}`}>
						<div className="h-[32px] w-[32px]" onClick={changeTab}>
							<Avatar story={false} height={32} width={32} image={`${user.user?.avatar}`} />
						</div>
					</Link>
				)}
			</div>
			{pathname === "/settings" ? (
				<Link href={"/settings"}>
					<RiSettings3Fill className="hover:cursor-pointer" size={24} />
				</Link>
			) : (
				<Link href={"/settings"}>
					<RiSettings3Line className="hover:cursor-pointer" size={24} onClick={changeTab} />
				</Link>
			)}
		</div>
	);
}
