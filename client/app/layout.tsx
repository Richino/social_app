"use client";
import { ThemeProvider } from "../components/themes";
import "../stylesheet/globals.css";
import { App, useMyContext } from "./context";
import { Roboto as Inter } from "@next/font/google";

const inter = Inter({
	subsets: ["latin"],
	weight: ["400"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const value = useMyContext();

	return (
		<html suppressHydrationWarning id="html" className={`h-screen max-h-screen min-h-screen w-screen overflow-hidden ${inter.className}`}>
			<body className="no-flash h-screen  w-screen overflow-hidden bg-white text-sm dark:text-neutral-200 phone:text-base">
				<ThemeProvider attribute="class" defaultTheme="system">
					<App.Provider value={value}>{children}</App.Provider>
				</ThemeProvider>
			</body>
		</html>
	);
}
