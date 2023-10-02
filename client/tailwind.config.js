/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	mode: "jit",
	darkMode: "class",
	theme: {
		extend: {
			transitionProperty: {
				width: "width",
			},
		},
		screens: {
			phone: { max: "600px" },
			navbar: { max: "1080px" },
			nestHub: { max: "1024px" },
			tablet: { max: "1000px" },
			overPhone: { max: "601px" },
			overPhone2: { min: "601px" },
		},
	},
	plugins: [],
};
