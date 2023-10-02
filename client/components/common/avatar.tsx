import Image from "next/image";
import { AvatarProps } from "../../app/(interface)/avatar";

export default function Avatar(props: AvatarProps) {
	return (
		<div className={`relative rounded-full ${props.story && "bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 p-[2px]"}`}>
			<div
				className={`relative  shrink-0 overflow-hidden   rounded-full border-[0px] border-white bg-white hover:cursor-pointer h-[${props.height}px] w-[${props.width}px] aspect-square`}>
				<Image src={props.image} alt="avatar" fill style={{ objectFit: "cover" }} sizes={`(max-width: ${props.width}px) 100vw`} />
			</div>
		</div>
	);
}
