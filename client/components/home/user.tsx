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
							? "w-[260px]"
							: props.type === "create-post"
							? "w-[320px] phone:w-[120px]"
							: props.type === "list"
							? "w-[320px]"
							: props.type === "post"
							? "w-[270px]"
							: props.type === "message-main"
							? "w-[130px]"
							: props.type === "user-search"
							? "w-[300px]"
							: props.type === "post-feed"
							? "w-[300px]"
							: "w-full"
					}   truncate dark:text-neutral-200`}>
					<b>{props.fullname}</b>
				</span>
				<span className=" line-clamp-1  w-full truncate text-neutral-400 dark:text-neutral-200">{props.usernameOrText}</span>
			</div>
		</div>
	);
}
