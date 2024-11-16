/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			cursor: {
				pointer: "var(--pointer-cursor)",
				"not-allowed": "var(--not-allowed-cursor)",
			},
		},
	},
	plugins: [],
	darkMode: "class",
};
