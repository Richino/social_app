"use client";
import { ChangeEvent, useEffect, useState, useRef, useContext } from "react";
import User from "../../../components/home/user";
import Avatar from "../../../components/common/avatar";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { BsChevronLeft } from "react-icons/bs";
import { IoIosAddCircleOutline } from "react-icons/io";
import { App } from "../../context";
import io from "socket.io-client";
import axios from "axios";

export default function Page() {
	const { user, setList, messages, messageIndex, setMessageIndex, list, setMessages, messageId } = useContext(App);

	const [text, setText] = useState("");
	const ref = useRef<HTMLDivElement>(null);

	const input = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);

	const [socket, setSocket] = useState<any>(null);
	const [socketConnected, setSocketConnected] = useState<boolean>(false);
	const [dataFetched, setDataFetched] = useState<boolean>(false);

	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_URL,
		withCredentials: true,
	});

	async function fetchData() {
		try {
			const res = await instance.get("/messages");
			let data: Array<any> = res.data.reverse();
			if (messageId.length > 0) {
				let userIndex = data.findIndex((key: any) => key._id === messageId);
				setMessageIndex(userIndex);
			}
			setMessages(data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTo(0, ref.current.scrollHeight);
		}
	}, [messageIndex]);

	useEffect(() => {
		const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
			auth: { id: user.user?._id },
		});
		setSocket(newSocket);

		if (!dataFetched) {
			fetchData();
			setDataFetched(true);
		}

		if (!socketConnected) {
			newSocket.on("connect", () => {
				console.log("connected");

				setSocketConnected(true);
			});
		}

		newSocket.on("received-message", async (data) => {
			if (messages.length === 0) {
				fetchData();
			} else {
				let messageCopy = [...messages];
				let userIndex = messageCopy.findIndex((key: any) => key._id === data.id);
				messageCopy[userIndex]?.message.unshift(data.message);
				let removedObj = messageCopy.slice(userIndex);
				messageCopy.splice(userIndex, 1);
				messageCopy.unshift(removedObj[0]);

				if (messageIndex === userIndex) {
					messageCopy[userIndex]?.message.forEach((key: any) => {
						if (!key.readBy.includes(user.user?._id)) {
							key.readBy.push(user.user?._id);
						}
					});
					await instance
						.post(`/messages/read`, { user: messageCopy[userIndex]._id })
						.then((res) => console.log("true"))
						.catch((error) => console.error("Error marking message as read:", error));
				}

				userIndex = messageCopy.findIndex((key: any) => key._id === data.id);
				setMessages(messageCopy);
				if (messageIndex === userIndex) setMessageIndex(userIndex);
			}
		});

		newSocket.on("send-message", (data) => {
			if (messages.length === 0) {
				fetchData();
			} else {
				let messageCopy = [...messages];
				let userIndex = messageCopy.findIndex((key: any) => key._id === data.recipient);
				messageCopy[userIndex]?.message.unshift(data.message);
				let removedObj = messageCopy.splice(userIndex, 1);
				messageCopy.unshift(removedObj[0]);
				setMessageIndex(0);
				setMessages(messageCopy);
			}
		});

		return () => {
			newSocket.disconnect();
		};
	}, [messages, messageIndex]);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTo(0, ref.current.scrollHeight);
		}
	}, [messageIndex, messages]);

	async function changeUser(position: number, id: string, unreads: number) {
		if (unreads !== 0) {
			let messageCopy = [...messages];
			messageCopy[position]?.message.forEach((key: any) => {
				if (!key.readBy.includes(user.user?._id)) {
					key.readBy.push(user.user?._id);
				}
			});
			try {
				await instance.post(`/messages/read`, { user: messageCopy[position]._id });
				setMessages(messageCopy);
			} catch (error) {
				console.error("Error marking message as read:", error);
			}
		}
		setMessageIndex(position);
	}

	function openList(type: string) {
		setList({ type, open: true, _id: user.user?._id });
	}

	function sendMessage(key: any) {
		if (text.length === 0) return;
		setText("");
		socket.emit("message", { message: text, id: key._id, sender: user.user?._id, index: messageIndex });
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
	return (
		<div
			className={`flex h-[calc(100%-58px)] w-full flex-shrink-0 flex-col  items-center gap-5 overflow-y-scroll bg-neutral-100 p-5 text-sm dark:bg-neutral-950 phone:fixed phone:top-[52px]  phone:mb-[60px] phone:h-[calc(100%-(60px+50px))] tablet:p-0 tablet:phone:block`}>
			<div className="message-container flex h-full w-full max-w-[1000px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 phone:relative phone:block phone:border-0">
				<div
					className={`users min-w-[380px] max-w-[380px] overflow-y-auto border-r border-neutral-200  dark:border-neutral-800  phone:min-w-full phone:max-w-full  phone:${
						messageIndex !== -1 && "hidden"
					}`}>
					<div className=" sticky top-0 flex min-h-[59px] items-center justify-between border-b border-neutral-200 p-2  px-5 dark:border-neutral-800  phone:mb-5 phone:min-h-[83px]">
						<span className="text-base">
							<b>Messages</b>
						</span>
						<IoIosAddCircleOutline className="hover:cursor-pointer" size={32} onClick={() => openList("New Message")} />
					</div>
					{messages?.map((key: any, position: number) => {
						const unreadMsg = unread(key);
						return (
							<div
								key={position}
								className={`p-5 py-2 hover:cursor-pointer hover:bg-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-800 ${
									position == messageIndex && "bg-neutral-200 dark:bg-neutral-800"
								} flex shrink-0 items-center`}
								onClick={() => changeUser(position, key._id, unread(key))}>
								<User fullname={key?.fullname} usernameOrText={""} avatar={key?.avatar} type="message" />
								<div className="grid w-[32px] place-items-center">
									{unreadMsg !== 0 && <div className=" grid  place-items-center rounded bg-violet-500 p-2 py-1 text-white">{unreadMsg}</div>}
								</div>
							</div>
						);
					})}
				</div>
				<div
					className={`left-0 h-full w-full overflow-hidden  phone:z-[90]    phone:${messageIndex < 0 && "hidden"} ${
						messageIndex < 0 && "new-message"
					} phone:fixed phone:top-[52px] phone:mb-[60px] phone:h-[calc(100%-(60px+52px))]`}>
					<div className={`${messageIndex < 0 ? "flex" : "hidden"} new-message h-full flex-col items-center justify-center gap-5 phone:hidden`}>
						<div className="flex h-[80px] w-[80px] items-center justify-center rounded-full border-4 border-white  p-5">
							<IoPaperPlaneOutline size={30} />
						</div>
						<button className="rounded-md bg-violet-500 px-6 py-2  text-white" onClick={() => openList("New Message")}>
							Send message
						</button>
					</div>
					<div className={`${messageIndex >= 0 ? "flex " : "hidden"}  messages p-5" relative h-full w-full flex-col overflow-hidden   bg-white dark:bg-neutral-900`}>
						<div className=" message-user-title absolute top-0   z-20 w-full border-b border-neutral-200 p-2  dark:border-neutral-800 phone:static phone:flex phone:items-center phone:justify-between">
							<div className="message-user-cheveron left-[20px] grid  place-items-center  overPhone2:hidden">
								<BsChevronLeft size={24} className=" hover:cursor-pointer" onClick={() => setMessageIndex(-1)} />
							</div>
							<div className="flex items-center gap-2">
								<Avatar story={false} height={42} width={42} image={messages[messageIndex]?.avatar} />
								<span>
									<b>{messages[messageIndex]?.fullname}</b>
								</span>
							</div>
							<div className="hidden phone:block"></div>
						</div>
						<div id="chat-container" ref={ref} className="message-box  phone:dark:bg-neutral-950 mt-[59px] phone:h-[calc(100svh-240px)] flex h-full flex-col-reverse gap-5 overflow-y-scroll p-5 phone:mb-0 phone:mt-0  ">
							{messages[messageIndex]?.message.map((key: any, position: number) => {
								return (
									<div key={position} className="w-full">
										<p
											className={`${
												key.sender === user.user?._id || key._id === user.user?._id
													? "float-right bg-neutral-100 dark:bg-neutral-800"
													: "float-left border border-neutral-200 dark:border-neutral-800 "
											}   w-auto max-w-[45%]  rounded-3xl p-5 phone:max-w-[80%]`}>
											{key.message}
										</p>
									</div>
								);
							})}
						</div>
						<div className=" bottom-0 z-50 flex  w-full  items-center justify-between gap-2 border-t border-neutral-200 p-5 dark:border-neutral-800 phone:border-b-0">
							<input
								type="text"
								placeholder="Enter message here..."
								className=" h-full w-full text-sm placeholder:text-neutral-400 dark:bg-neutral-900 phone:text-[16px]"
								value={text}
								onChange={input}
								onBlur={(e: any) => {
									e.preventDefault();
								}}
							/>
							<button className="text-violet-500" onClick={() => sendMessage(messages[messageIndex])}>
								<IoPaperPlaneOutline size={24} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
