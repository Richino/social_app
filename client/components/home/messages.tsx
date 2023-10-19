"use client";
import Header from "./header";
import Search from "./search";
import { App } from "../../app/context";
import { useContext, useEffect} from "react";
import User from "./user";
import axios from "axios";
import Link from "next/link";
import "nprogress/nprogress.css";
import nprogress from "nprogress";

export default function Messages() {
	const { messages, messageIndex, setMessages, user,  setMessageId } = useContext(App);
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_URL,
		withCredentials: true,
	});
	nprogress.configure({ showSpinner: false });
	async function fetchData() {
		instance.get("/messages").then((res) => {
			let data: Array<any> = res.data.reverse();
			setMessages(() => data);
		});
	}

	async function changeUser(position: number, id: string, unreads: number) {
		nprogress.start();
		if (unreads !== 0) {
			let messageCopy = [...messages];
			messageCopy[position]?.message.map((key: any) => {
				if (!key.readBy.includes(user.user?._id)) {
					key.readBy.push(user.user?._id);
				}
			});
			await instance.post(`/messages/read`, { user: messageCopy[position]._id })
			setMessages(messageCopy);
		}
		setMessageId(id);
	}

	function unread(key: any): number {
		let unread = 0;
		const index = messages.findIndex((obj: any) => obj._id === key._id);
		if (index === messageIndex) return unread;
		for (const message of key.message) {
			if (!message.readBy.includes(user.user?._id)) {
				unread += 1;
			}
		}
		return unread;
	}

	useEffect(() => {
		fetchData();
	}, []);
	return (
		<div className="w-full rounded-lg  border  border-neutral-200 bg-white pb-2 dark:border-neutral-800 dark:bg-neutral-900">
			<Header title="Messages" url="messages" />
			<div className="px-5 pb-5">
				<Search placeholder="Search messages" type="messages" mobile={false} />
			</div>

			{messages?.map((key: any, position: number) => {
				const unreadMsg = unread(key);
				return (
					<Link key={position} href={"/messages"} onClick={() => changeUser(position, key._id, unread(key))}>
						<div
							className={`p-5 py-2 hover:cursor-pointer hover:bg-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-800 ${
								position == messageIndex && "bg-neutral-200 dark:bg-neutral-900"
							} flex shrink-0 items-center`}>
							<User fullname={key?.fullname} usernameOrText={key.message[0].message} avatar={key?.avatar} type="message-main" />
							<div className="grid w-[32px] place-items-center">
								{unreadMsg !== 0 && <div className=" grid  place-items-center rounded bg-violet-500 p-2 py-1 text-white">{unreadMsg}</div>}
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
