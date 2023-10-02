"use client";

import "../stylesheet/globals.css";
import { App, useMyContext } from "./context";
import { Roboto as Inter } from "@next/font/google";
import Script from "next/script";

const inter = Inter({
	subsets: ["latin"],
	weight: ["400"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const value = useMyContext();

	return (
		<html suppressHydrationWarning id="html" className={`h-screen max-h-screen min-h-screen w-screen overflow-hidden ${inter.className}`}>
			<body className="no-flash h-screen  w-screen overflow-hidden bg-white text-sm dark:text-neutral-200 phone:text-base">
				<Script
					id="script"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: `
                            const theme = localStorage.getItem("theme")
                            if(theme === "dark"){
                                document.getElementById("html")?.classList.add("dark")
                            }else{
                                document.getElementById("html")?.classList.add("light")
                            }
                        `,
					}}
				/>
				<App.Provider value={value}>{children}</App.Provider>
			</body>
		</html>
	);
}
