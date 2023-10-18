"use client";
import Link from "next/link";
import nprogress from "nprogress";
import User from "../home/user";
import { App } from "../../app/context";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import Search from "../home/search";

export default function TabletSearch() {
	const pathname = usePathname();
	const { users, setUsers, setIsOpen, setMobileNav, setTabletSearch } = useContext(App);

	const searchUser = (user: string) => {
		if (user !== pathname) nprogress.start();
		setIsOpen(false);
		setMobileNav(false);
		setTabletSearch(false);
		setUsers([]);
	};
	return (
		<div className="fixed left-[70px] top-0 z-[9999] h-screen w-[calc(100%-70px)] space-y-5 border-l border-neutral-800 bg-neutral-900 phone:hidden ">
			<div className="flex items-center gap-5 p-5">
				<BsChevronLeft size={25} onClick={() => setTabletSearch(false)} />
				<Search placeholder="Search here..." type="nav" mobile={false} />
			</div>
			<div className=" z-50  w-full bg-white dark:bg-neutral-900">
				{!users.length ? (
					<div className="grid h-full place-items-center text-base text-neutral-500">Results will show here</div>
				) : (
					<div>
						{users.map((key: any, value: number) => {
							return (
								<Link key={value} href={`/${key.username}`} onClick={() => searchUser(`/${key.username}`)}>
									<div className="p-5 hover:bg-neutral-100 dark:hover:bg-neutral-800">
										<User fullname={key.fullname} avatar={key.avatar} usernameOrText={key.username} type="search-mobile" />
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
