"use client";
import Avatar from "../common/avatar";
import { VscDiffAdded } from "react-icons/vsc";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Search from "./search";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AiFillHeart, AiOutlineHeart, AiOutlineLogout } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { App } from "../../app/context";
import { useContext, useEffect, useRef, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import User from "./user";
import { BsChevronLeft } from "react-icons/bs";


export default function Nav() {
	const pathname = usePathname();
	const { user, openCreatePost, users, setUsers, isOpen, setIsOpen, mobileNav, setMobileNav, settings, setSettings, setLogout } = useContext(App);
	nprogress.configure({ showSpinner: false });
	const navbarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (navbarRef.current && !navbarRef.current.contains(e.target as HTMLDivElement)) setIsOpen(false);
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [navbarRef]);
	return (
		<>
			<div className="sticky left-0 top-0 z-40 flex h-full max-h-[58px] min-h-[58px] justify-center  gap-4 border-b border-neutral-200 bg-white py-2   dark:border-neutral-800 dark:bg-neutral-900 tablet:hidden">
				<div className="flex items-center justify-center gap-5">
					<div className="w-[250px] nestHub:grid nestHub:place-items-center">
						{pathname === "/" ? (
							<button className="title text-2xl font-bold">Moments</button>
						) : (
							<Link href={"/"} onClick={() => nprogress.start()}>
								<button className="title text-2xl font-bold">Moments</button>
							</Link>
						)}
					</div>
					<div className="h-full w-[400px] ">
						<Search placeholder="Search here..." type="nav" mobile={false} />
						{isOpen && (
							<div
								ref={navbarRef}
								id="nav-bar"
								className="z-[100] ml-[-3.5px] mt-[16px] h-[400px] w-[400px] rounded border bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
								{users.map((key: any, value: number) => {
									return (
										<Link
											key={value}
											href={`/${key.username}`}
											onClick={() => {
												if (`/${key.username}` !== pathname) nprogress.start();
												setIsOpen(false);
												setUsers([]);
											}}>
											<div className="p-5 hover:bg-neutral-100 dark:hover:bg-neutral-800">
												<User fullname={key.fullname} avatar={key.avatar} usernameOrText={key.username} type="user-search" />
											</div>
										</Link>
									);
								})}
							</div>
						)}
					</div>
					<div className="flex w-[250px] shrink-0 items-center justify-end gap-4  nestHub:justify-center">
						<div
							className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-neutral-100 p-2 hover:cursor-pointer dark:bg-neutral-950"
							onClick={() => openCreatePost(true)}>
							<IoIosAddCircleOutline size={22} />
						</div>
						{pathname === "/messages" ? (
							<div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-neutral-100 p-2 hover:cursor-pointer dark:bg-neutral-950">
								<IoChatbubbleEllipsesOutline size={20} />
							</div>
						) : (
							<Link href={"/messages"} onClick={() => nprogress.start()}>
								<div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-neutral-100 p-2 hover:cursor-pointer dark:bg-neutral-950">
									<IoChatbubbleEllipsesOutline size={20} />
								</div>
							</Link>
						)}
						{pathname === "/" + user.user?.username ? (
							<Avatar story={false} height={42} width={42} image={user.user?.avatar ?? ""} />
						) : (
							<Link href={"/" + user.user?.username} onClick={() => nprogress.start()}>
								<Avatar story={false} height={42} width={42} image={user.user?.avatar ?? ""} />
							</Link>
						)}

						<div
							className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-neutral-100 p-2 hover:cursor-pointer dark:bg-neutral-950"
							onClick={() => setLogout(true)}>
							<AiOutlineLogout size={22} />
						</div>
					</div>
				</div>
			</div>
			<div className="fixed top-0  z-40 hidden  w-full items-center    justify-between gap-5    border-b border-slate-200 bg-white p-2 px-5 dark:border-neutral-800 dark:bg-neutral-900 phone:flex">
				{mobileNav ? (
					<button>
						<BsChevronLeft
							size={24}
							className=" hover:cursor-pointer"
							onClick={() => {
								setIsOpen(false);
								setMobileNav(false);
								setUsers([]);
							}}
						/>
					</button>
				) : (
					<span className="title text-2xl font-bold ">M</span>
				)}
				<Search type="nav" placeholder="Search here..." mobile={true} />
				<div className="flex gap-5">
					{pathname === "/activities" ? (
						<Link href={"/activities"}>
							<AiFillHeart className="hover:cursor-pointer" size={24} />
						</Link>
					) : (
						<Link href={"/activities"}>
							<AiOutlineHeart className="hover:cursor-pointer" size={24} />
						</Link>
					)}
					<RxHamburgerMenu
						className="hover:cursor-pointer"
						size={24}
						onClick={() => {
							let settingCopy = { ...settings };
							settingCopy.isSettingOpen = true;
							setSettings(settingCopy);
						}}
					/>
				</div>
			</div>
		</>
	);
}
