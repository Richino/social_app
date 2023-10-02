"use client";
import { MdOutlineExplore, MdExplore } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import {
	AiOutlineHome,
	AiFillHome,
	AiOutlineMessage,
	AiOutlineHeart,
	AiFillMessage,
	AiFillHeart,
} from "react-icons/ai";
import { RiSettings3Line, RiSettings3Fill } from "react-icons/ri";
import { HiOutlineUsers, HiUsers } from "react-icons/hi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Avatar from "../common/avatar";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

export default function Sidenav() {
	const pathname = usePathname();
	return (
		<div className="side-nav sticky top-0  left-0 hidden  h-full min-w-min flex-col items-center justify-between gap-12 overflow-y-auto overflow-x-hidden border-r border-slate-200 bg-white p-5 tablet:flex tablet:phone:hidden">
			<span className="title pb-10 text-2xl font-bold">M</span>
			<div className="flex flex-col items-center  gap-12">
				{pathname === "/" ? (
					<Link href={"/"}>
						<AiFillHome
							className="hover:cursor-pointer"
							size={24}
						/>
					</Link>
				) : (
					<Link href={"/"}>
						<AiOutlineHome
							className="hover:cursor-pointer"
							size={24}
							onClick={() => nprogress.start()}
						/>
					</Link>
				)}
				<div className="shrink-0 hover:cursor-pointer">
					<img
						src={"/assets/icons/search.svg"}
						alt="search icon"
						className="h-[20px]"
					/>
				</div>
				{pathname === "/explore" ? (
					<Link href={"/explore"}>
						<MdExplore className="hover:cursor-pointer" size={24} />{" "}
					</Link>
				) : (
					<Link href={"/explore"}>
						<MdOutlineExplore
							className="hover:cursor-pointer"
							size={24}
							onClick={() => nprogress.start()}
						/>
					</Link>
				)}
				{pathname === "/suggestions" ? (
					<Link href={"/suggestions"}>
						<HiUsers className="hover:cursor-pointer" size={24} />
					</Link>
				) : (
					<Link href={"/suggestions"}>
						<HiOutlineUsers
							className="hover:cursor-pointer"
							size={24}
							onClick={() => nprogress.start()}
						/>
					</Link>
				)}
				{pathname === "/messages" ? (
					<Link href={"/messages"}>
						<AiFillMessage
							className="hover:cursor-pointer"
							size={24}
						/>
					</Link>
				) : (
					<Link href={"/messages"}>
						<AiOutlineMessage
							className="hover:cursor-pointer"
							size={24}
							onClick={() => nprogress.start()}
						/>
					</Link>
				)}
				{pathname === "/activities" ? (
					<Link href={"/activities"}>
						<AiFillHeart
							className="hover:cursor-pointer"
							size={24}
						/>
					</Link>
				) : (
					<Link href={"/activities"}>
						<AiOutlineHeart
							className="hover:cursor-pointer"
							size={24}
							onClick={() => nprogress.start()}
						/>
					</Link>
				)}
				<VscDiffAdded className="hover:cursor-pointer" size={24} />
				{pathname === "/stacy123" ? (
					<Link href={"/stacy123"}>
						<div className="h-[32px] w-[32px]">
							<Avatar
								story={false}
								height={32}
								width={32}
								image="/assets/user/profile.jpg"
							/>
						</div>
					</Link>
				) : (
					<Link href={"/stacy123"}>
						<div
							className="h-[32px] w-[32px]"
							onClick={() => nprogress.start()}>
							<Avatar
								story={false}
								height={32}
								width={32}
								image="/assets/user/profile.jpg"
							/>
						</div>
					</Link>
				)}
			</div>
			{pathname === "/settings" ? (
				<Link href={"/settings"}>
					<RiSettings3Fill
						className="hover:cursor-pointer"
						size={24}
					/>
				</Link>
			) : (
				<Link href={"/settings"}>
					<RiSettings3Line
						className="hover:cursor-pointer"
						size={24}
						onClick={() => nprogress.start()}
					/>
				</Link>
			)}
		</div>
	);
}
