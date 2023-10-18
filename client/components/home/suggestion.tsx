"use client";
import Header from "./header";


export default function Suggestion() {
	return (
		<div className="w-full rounded-lg  bg-white  pb-2">
			<Header title="Suggested For You" url="suggestions" />
			{/*data.map((key, index) => {
				return (
					<div
						key={index}
						className="flex items-center gap-2 p-2 px-5 transition-colors hover:cursor-pointer hover:bg-slate-100">
						<User
							fullname={key.fullname}
							avatar={key.avatar}
							usernameOrText={key.text}
						/>
					</div>
				);
			})*/}
		</div>
	);
}
