"use client";


export default function Stories() {
	return (
		<div className=" h-max  w-full  rounded-lg  bg-white tablet:phone:rounded-none">
			<div className="stories flex gap-4 overflow-y-auto p-5 pb-2">
				{/*data.map((key, index) => {
					return (
						<div
							key={index}
							className="flex w-[60px] min-w-[60px] flex-col items-center justify-center gap-1   ">
							<Avatar height={60} width={60} story={true} image={key.avatar} />
							<span className=" w-[60px] min-w-[60px] truncate">{key.fullname}</span>
						</div>
					);
				})*/}
			</div>
		</div>
	);
}
