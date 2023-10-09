import Image from "next/image";
import { AvatarProps } from "../../app/(interface)/avatar";

export default function Avatar(props: AvatarProps) {
	const height = `h-[${props.height}px]`;
	const width = `w-[${props.width}px]`;
	const maxWidth = `${props.width}px`;
	return (
		<div className={`relative rounded-full ${props.story && "bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 p-[2px]"}`}>
			<div className={`relative   shrink-0   overflow-hidden rounded-full border-[0px] border-white bg-white   hover:cursor-pointer ${height} ${width}`}>
				<Image src={props.image} alt="avatar" fill  style={{ objectFit: "cover" }} sizes={`(max-width: ${maxWidth}) 100vw`} priority/>
			</div>
		</div>
	);
}
