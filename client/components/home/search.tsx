"use client";
import axios from "axios";
import { App } from "../../app/context";
import { ChangeEvent, useContext } from "react";
import { RiSearchLine } from "react-icons/ri";
import { SearchProps } from "../../app/(interface)/search";

export default function Search(props: SearchProps) {
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_URL,
		withCredentials: true,
	});
	const { setUsers, setIsOpen, setMobileNav } = useContext(App);

	async function search(e: ChangeEvent<HTMLInputElement>) {
		if (props.mobile) setMobileNav(true);
		if (e.target.value.length === 0) {
			setIsOpen(false);
			setMobileNav(false);
			setUsers([]);
		} else {
			if (props.type === "messages") {
			} else {
				await instance
					.post("/search/user", { username: e.target.value })
					.then((res) => {
						setIsOpen(true);
						setUsers(res.data);
					})
					.catch((err) => console.log(err.message));
			}
		}
	}
	return (
		<div className="flex  w-full items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-950">
			<div className="shrink-0 px-3 hover:cursor-pointer">
				<RiSearchLine size={16} />
			</div>
			<input id="search" className="w-full bg-transparent p-2 placeholder:text-neutral-400" placeholder={props.placeholder} onChange={search} />
		</div>
	);
}
