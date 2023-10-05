"use client";
import { App } from "../../app/context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import User from "../home/user";
import Link from "next/link";
import nprogress from "nprogress";
import { usePathname } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";

export default function List() {
	const pathname = usePathname();
	nprogress.configure({ showSpinner: false });
	const { setList, list, setPost, user, messages, setMessages, setMessageIndex } = useContext(App);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_URL,
		withCredentials: true,
	});
	function hidePopup(e: React.MouseEvent<HTMLDivElement>) {
		(e.target as HTMLDivElement).id === "popup" && setList({ type: "", open: false, _id: "" });
	}

	function messageUser(key: any, index: number) {
		if (pathname !== `/${key.username}` && pathname !== "/messages") nprogress.start();

		if (pathname === "/messages") {
			const user = {
				fullname: key.fullname,
				avatar: key.avatar,
				username: key.username,
				_id: key._id,
				message: [],
			};
			let messageCopy = [...messages];
			const userExist = messageCopy.some((key: any) => key._id == user._id);
			if (!userExist) {
				messageCopy.unshift(user);
				setMessages(messageCopy);
			}
			let userIndex = messageCopy.map((key: any) => key._id).indexOf(user._id);

			if (messageCopy.length > 1 && userExist) {
				messageCopy.splice(userIndex, 1);
				messageCopy.unshift(user);
				setMessages(messageCopy);
				setMessageIndex(0);
			} else {
				setMessageIndex(userIndex);
			}
		}

		setPost(false);
		setList({ type: "", open: false, _id: "" });
	}

	async function fetchList() {
		setLoading(true);
		await instance
			.post(`/main_user/get-list`, { id: list._id, type: list.type })
			.then((res) => {
				setLoading(false);
				setData(res.data);
			})
			.catch(() => {
				setLoading(false);
				setData([]);
			});
	}
	useEffect(() => {
		fetchList();
	}, []);
	return (
		<div
			id="popup"
			className=" fixed left-0 top-0 z-[100] grid h-full w-full place-items-center bg-black/80 phone:w-full phone:flex-col phone:overflow-y-auto phone:bg-neutral-100"
			onClick={hidePopup}>
			<div className="flex h-[400px] w-full  max-w-[400px] flex-col  rounded-md phone:rounded-none bg-white font-bold dark:bg-neutral-900 phone:h-full phone:w-full phone:max-w-none">
				<div className="flex items-center  justify-between border-b border-neutral-200 p-5 dark:border-neutral-800">
					<BsChevronLeft size={24} className=" hover:cursor-pointer" onClick={() => setList({ type: "", open: false, _id: "" })} />
					{list.type}
					<div></div>
				</div>
				<div className="h-full overflow-y-auto">
					<>
						{loading && data.length === 0 ? (
							<div className="grid h-full place-items-center">
								<div className="circle" />
							</div>
						) : !loading && data.length === 0 ? (
							<div className="grid h-full place-items-center">No one liked this comment yet</div>
						) : (
							<>
								{data.map((key: any, index: number) => {
									return (
										<Link key={index} href={`/${list.type === "New Message" ? "messages" : key.username}`} onClick={() => messageUser(key, index)}>
											<div className="flex items-center justify-center p-2 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
												<User fullname={key.fullname} avatar={key.avatar} usernameOrText={key.username} type="list"/>
												{/*<div>
													{user.user?.following?.includes(key._id) && list.type !== "New Message" ? (
														<button className="self-start rounded bg-violet-500 p-1 px-5 text-white ">Unfollow</button>
													) : user.user?._id === key._id || list.type === "New Message" ? null : (
														<button className="self-start rounded bg-violet-500 p-1 px-5 text-white ">Follow</button>
													)}
                                                    </div>*/}
											</div>
										</Link>
									);
								})}
							</>
						)}
					</>
				</div>
			</div>
		</div>
	);
}
