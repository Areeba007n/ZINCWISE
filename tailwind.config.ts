import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { forest: "#073e31", sage: "#eaf4df", leaf: "#4b9b3b", cream: "#faf8f3" } } }, plugins: [] } satisfies Config;
