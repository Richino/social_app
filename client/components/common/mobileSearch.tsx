"use client";

import Link from "next/link";
import nprogress from "nprogress";
import User from "../home/user";
import { App } from "../../app/context";
import { useContext } from "react";
import { usePathname } from "next/navigation";

export default function MobileSearch() {
	const pathname = usePathname();
	const { users, setUsers, setIsOpen, setMobileNav } = useContext(App);
	return (
		<div className="fixed left-0 top-[50px] z-50 h-[calc(100%-100px)] w-full bg-white dark:bg-neutral-900">
			{!users.length ? (
				<div className="grid h-full place-items-center text-base text-neutral-500">No results found</div>
			) : (
				<div>
					{users.map((key: any, value: number) => {
						return (
							<Link
								key={value}
								href={`/${key.username}`}
								onClick={() => {
									if (`/${key.username}` !== pathname) nprogress.start();
									setIsOpen(false);
									setMobileNav(false);
									setUsers([]);
								}}>
								<div className="p-5 hover:bg-neutral-100 dark:hover:bg-neutral-800">
									<User fullname={key.fullname} avatar={key.avatar} usernameOrText={key.username} type="search-mobile" />
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
