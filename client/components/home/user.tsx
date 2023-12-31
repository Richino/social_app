import Avatar from "../common/avatar";
import { UserProps } from "../../app/(interface)/user";
export default function User(props: UserProps) {
	return (
		<div className="flex w-full gap-2 overflow-hidden">
			<Avatar story={false} height={42} width={42} image={props.avatar} />
			<div className="flex  flex-col justify-center gap-[2px] ">
				<span
					className={`${
						props.type == "message"
							? "w-[260px]  max-w-[150px] text-ellipsis overflow-hidden z-50"
							: props.type === "create-post"
							? "w-[320px] phone:w-[120px]"
							: props.type === "list"
							? "w-[320px]"
							: props.type === "post"
							? "w-[270px] phone:w-[150px] text-ellipsis overflow-hidden"
							: props.type === "message-main"
							? "w-[130px]"
							: props.type === "user-search"
							? "w-[300px]"
							: props.type === "post-feed"
							? "w-[300px]"
							: "w-full"
					}   truncate dark:text-neutral-200 font-semibold`}>
					{props.fullname}
				</span>
				<span className=" line-clamp-1  w-full truncate text-neutral-400 dark:text-neutral-200">{props.usernameOrText}</span>
			</div>
		</div>
	);
}
