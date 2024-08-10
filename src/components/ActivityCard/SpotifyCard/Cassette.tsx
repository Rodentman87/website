import { motion } from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import Image from "next/image";
import React from "react";
import { BsSpotify } from "react-icons/bs";
import {
	COLOR_CONRTAST_MINIMUM,
	CONTRAST_AGAINST,
	WHITE,
} from "../ActivityCard";

interface CassetteProps {
	title: string;
	songLink: string;
	artist: string;
	artistLink: string;
	album: string;
	albumLink: string;
	cover: string;
	duration: number;
	endsAt: number;
}

interface Colors {
	primary: string;
	secondary: string;
}

export const Cassette: React.FC<CassetteProps> = ({
	title,
	artist,
	album,
	cover,
	songLink,
	artistLink,
	albumLink,
	duration,
	endsAt,
}) => {
	const [colors, setColors] = React.useState<Colors>({
		primary: "#FFFFFF",
		secondary: "#FFFFFF",
	});
	const [textColors, setTextColors] = React.useState<Colors>({
		primary: "#FFFFFF",
		secondary: "#FFFFFF",
	});

	const timeLeft = Math.max(0, endsAt - Date.now());
	const timeSinceStart = duration * 1000 - timeLeft;

	return (
		<>
			<div className="relative p-0 m-0 w-max backdrop-blur-sm">
				<a
					target="_blank"
					href="https://open.spotify.com/"
					className="absolute"
					style={{
						bottom: 50,
						right: 35,
					}}
				>
					<BsSpotify size={24} color={colors.primary} />
				</a>
				<Wheel timeLeft={timeLeft} x={88} y={108} />
				<Wheel timeLeft={timeLeft} x={250.99} y={109.99} />
				<div
					className="absolute flex flex-col text-sm font-bold select-none"
					style={{ top: 25, left: 35 }}
				>
					<a
						href={songLink}
						target="_blank"
						referrerPolicy="no-referrer"
						className="cursor-pointer"
						style={{
							color: textColors.secondary,
							maxWidth: 225,
							overflow: "hidden",
							whiteSpace: "nowrap",
							textOverflow: "clip",
						}}
					>
						{title}
					</a>
					<a
						href={artistLink}
						target="_blank"
						referrerPolicy="no-referrer"
						className="cursor-pointer"
						style={{
							color: textColors.primary,
							maxWidth: 225,
							overflow: "hidden",
							whiteSpace: "nowrap",
							textOverflow: "clip",
						}}
					>
						{artist}
					</a>
					<a
						href={albumLink}
						target="_blank"
						referrerPolicy="no-referrer"
						className="cursor-pointer"
						style={{
							color: textColors.primary,
							maxWidth: 225,
							overflow: "hidden",
							whiteSpace: "nowrap",
							textOverflow: "ellipsis",
						}}
					>
						{album}
					</a>
				</div>
				<Image
					alt={album}
					width={75}
					height={75}
					src={cover}
					className="absolute"
					style={{ top: 23, right: 29 }}
					onLoad={async (e) => {
						await new Promise((resolve) => setTimeout(resolve, 250));
						const colors = await extractColors(
							cover,
							e.target as HTMLImageElement
						);
						const bestColors = getBestColors(
							colors,
							CONTRAST_AGAINST,
							COLOR_CONRTAST_MINIMUM
						);
						const textcolors = getBestColors(
							colors,
							WHITE,
							COLOR_CONRTAST_MINIMUM
						);
						setColors({
							primary: bestColors.primary.hex(),
							secondary: bestColors.secondary.hex(),
						});
						setTextColors({
							primary: textcolors.primary.hex(),
							secondary: textcolors.secondary.hex(),
						});
					}}
				/>

				<svg
					width="384"
					height="247"
					viewBox="0 0 384 247"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clip-path="url(#clip0_203_3)">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M372 0H12C0 0 0 0.1 0 12.5V237C0 241.629 0 244.115 1.23968 245.45C2.6782 247 5.78597 247 12.5 247H372C378.364 247 381.353 247 382.757 245.508C384 244.187 384 241.697 384 237V13.5C384 6.48512 384 3.11532 382.316 1.49654C380.76 0 377.765 0 372 0ZM138 133C138 146.807 126.807 158 113 158C99.1929 158 88 146.807 88 133C88 119.193 99.1929 108 113 108C126.807 108 138 119.193 138 133ZM276 160C289.807 160 301 148.807 301 135C301 121.193 289.807 110 276 110C262.193 110 251 121.193 251 135C251 148.807 262.193 160 276 160Z"
							fill={colors.primary}
							fill-opacity="0.6"
						/>
						<motion.circle
							initial={{ r: 26 }}
							animate={{
								r: 60,
								transition: {
									duration: duration,
									delay: -(timeSinceStart / 1000),
									ease: "easeOut",
								},
							}}
							cx="276"
							cy="135"
							fill="#555"
						/>
						<circle cx="276" cy="135" r="24" fill="white" />
						<motion.circle
							initial={{ r: 60 }}
							animate={{
								r: 26,
								transition: {
									duration: duration,
									delay: -(timeSinceStart / 1000),
									ease: "easeIn",
								},
							}}
							cx="113"
							cy="133"
							fill="#555"
						/>
						<circle cx="113" cy="133" r="24" fill="white" />
						<path
							d="M79 215.92L78 212L307 212V215.92H79Z"
							fill="#7A7A7A"
							fill-opacity="0.2"
						/>
						<path
							d="M319 247L307 215.92V212C309 212.187 312.5 212.56 314 214.8C315.2 216.592 323.333 237.293 327 247H319Z"
							fill="#ADADAD"
							fill-opacity="0.2"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M31 23V202H355V23H31ZM79 169H313V98H79V169Z"
							fill="white"
						/>
						<path
							d="M35.5 47.5H274M35.5 71H274M35.5 93H274"
							stroke="black"
							strokeWidth={2}
						/>
						<mask
							id="mask0_203_3"
							maskUnits="userSpaceOnUse"
							x="31"
							y="23"
							width="324"
							height="179"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M31 23V202H355V23H31ZM79 169H313V98H79V169Z"
								fill="white"
							/>
						</mask>
						<g mask="url(#mask0_203_3)">
							<rect
								x="18"
								y="98"
								width="347"
								height="111"
								fill={colors.secondary}
							/>
						</g>
					</g>
					<defs>
						<clipPath id="clip0_203_3">
							<rect width="384" height="247" fill="white" />
						</clipPath>
					</defs>
				</svg>
			</div>
		</>
	);
};

const Wheel: React.FC<{
	x: number;
	y: number;
	timeLeft: number;
	reverse?: boolean;
}> = ({ x, y, timeLeft, reverse }) => {
	return (
		<motion.svg
			width="50"
			height="50"
			viewBox="0 0 50 50"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="absolute"
			style={{ left: x, top: y }}
			initial={{ rotate: 0 }}
			animate={{
				rotate: reverse ? 360 : -360,
				transition: { duration: 2, repeat: timeLeft / 2000, ease: "linear" },
			}}
		>
			<g clip-path="url(#clip0_203_41)">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M15.5575 48.1521C28.3404 53.3707 42.9335 47.2386 48.1521 34.4557C53.3707 21.6728 47.2386 7.07967 34.4557 1.86108C21.6728 -3.35751 7.07967 2.77459 1.86108 15.5575C-3.35751 28.3404 2.77459 42.9335 15.5575 48.1521ZM17.8253 42.5972C27.5403 46.5633 38.6311 41.9029 42.5972 32.1879C46.5633 22.4729 41.9029 11.3821 32.1879 7.416C22.4729 3.44987 11.3821 8.11027 7.416 17.8253C3.44987 27.5403 8.11027 38.6311 17.8253 42.5972Z"
					fill="#222"
				/>
				<path
					d="M12.4126 33.3667L9.04908 36.314L12.7333 40.5184L16.0968 37.571L12.4126 33.3667Z"
					fill="#222"
				/>
				<path
					d="M11.9914 18.2212L7.86259 16.5029L5.7147 21.664L9.84355 23.3823L11.9914 18.2212Z"
					fill="#222"
				/>
				<path
					d="M25.1164 10.0561L24.2457 5.66954L18.7625 6.75796L19.6332 11.1445L25.1164 10.0561Z"
					fill="#222"
				/>
				<path
					d="M38.6456 17.8939L42.0091 14.9466L38.3249 10.7422L34.9614 13.6896L38.6456 17.8939Z"
					fill="#222"
				/>
				<path
					d="M37.9787 33.0255L42.1283 34.6929L44.2126 29.5058L40.0629 27.8384L37.9787 33.0255Z"
					fill="#222"
				/>
				<path
					d="M25.5511 40.9458L26.4219 45.3323L31.905 44.2439L31.0343 39.8573L25.5511 40.9458Z"
					fill="#222"
				/>
			</g>
			<defs>
				<clipPath id="clip0_203_41">
					<rect width="50" height="50" fill="white" />
				</clipPath>
			</defs>
		</motion.svg>
	);
};

<svg
	width="384"
	height="247"
	viewBox="0 0 384 247"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g clip-path="url(#clip0_203_3)">
		<rect width="384" height="247" fill="white" fill-opacity="0.42" />
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M372 0H12C0 0 0 0.1 0 12.5V237C0 241.629 0 244.115 1.23968 245.45C2.6782 247 5.78597 247 12.5 247H372C378.364 247 381.353 247 382.757 245.508C384 244.187 384 241.697 384 237V13.5C384 6.48512 384 3.11532 382.316 1.49654C380.76 0 377.765 0 372 0ZM138 133C138 146.807 126.807 158 113 158C99.1929 158 88 146.807 88 133C88 119.193 99.1929 108 113 108C126.807 108 138 119.193 138 133ZM276 160C289.807 160 301 148.807 301 135C301 121.193 289.807 110 276 110C262.193 110 251 121.193 251 135C251 148.807 262.193 160 276 160Z"
			fill="#E97361"
			fill-opacity="0.6"
		/>
		<circle cx="276" cy="135" r="36" fill="black" />
		<circle cx="276" cy="135" r="25" fill="white" />
		<circle cx="113" cy="133" r="60" fill="black" />
		<circle cx="113" cy="133" r="25" fill="white" />
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M372 0H12C0 0 0 0.1 0 12.5V237C0 241.629 0 244.115 1.23968 245.45C2.6782 247 5.78597 247 12.5 247H372C378.364 247 381.353 247 382.757 245.508C384 244.187 384 241.697 384 237V13.5C384 6.48512 384 3.11532 382.316 1.49654C380.76 0 377.765 0 372 0ZM138 133C138 146.807 126.807 158 113 158C99.1929 158 88 146.807 88 133C88 119.193 99.1929 108 113 108C126.807 108 138 119.193 138 133ZM276 160C289.807 160 301 148.807 301 135C301 121.193 289.807 110 276 110C262.193 110 251 121.193 251 135C251 148.807 262.193 160 276 160Z"
			fill="#E97361"
			fill-opacity="0.6"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M113 158C126.807 158 138 146.807 138 133C138 119.193 126.807 108 113 108C99.1929 108 88 119.193 88 133C88 146.807 99.1929 158 113 158ZM113 152C123.493 152 132 143.493 132 133C132 122.507 123.493 114 113 114C102.507 114 94 122.507 94 133C94 143.493 102.507 152 113 152Z"
			fill="#ABABAB"
		/>
		<path
			d="M104.5 145.5L102.5 149.5L107.5 152L109.5 148L104.5 145.5Z"
			fill="#ABABAB"
		/>
		<path
			d="M98.3857 131.637L93.9136 131.607L93.8758 137.197L98.3478 137.227L98.3857 131.637Z"
			fill="#ABABAB"
		/>
		<path
			d="M107.451 119.117L104.987 115.385L100.322 118.465L102.786 122.197L107.451 119.117Z"
			fill="#ABABAB"
		/>
		<path
			d="M122.939 121.26L124.939 117.26L119.939 114.76L117.939 118.76L122.939 121.26Z"
			fill="#ABABAB"
		/>
		<path
			d="M128.041 135.521L132.513 135.496L132.482 129.906L128.01 129.931L128.041 135.521Z"
			fill="#ABABAB"
		/>
		<path
			d="M119.529 147.551L121.993 151.283L126.658 148.203L124.194 144.471L119.529 147.551Z"
			fill="#ABABAB"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M266.551 158.146C279.334 163.364 293.927 157.232 299.146 144.449C304.364 131.666 298.232 117.073 285.449 111.854C272.666 106.636 258.073 112.768 252.855 125.551C247.636 138.334 253.768 152.927 266.551 158.146ZM268.819 152.591C278.534 156.557 289.624 151.896 293.591 142.181C297.557 132.466 292.896 121.376 283.181 117.409C273.466 113.443 262.376 118.104 258.409 127.819C254.443 137.534 259.104 148.624 268.819 152.591Z"
			fill="white"
		/>
		<path
			d="M263.406 143.36L260.042 146.307L263.727 150.512L267.09 147.564L263.406 143.36Z"
			fill="white"
		/>
		<path
			d="M262.985 128.215L258.856 126.496L256.708 131.657L260.837 133.376L262.985 128.215Z"
			fill="white"
		/>
		<path
			d="M276.11 120.05L275.239 115.663L269.756 116.751L270.627 121.138L276.11 120.05Z"
			fill="white"
		/>
		<path
			d="M289.639 127.887L293.003 124.94L289.318 120.736L285.955 123.683L289.639 127.887Z"
			fill="white"
		/>
		<path
			d="M288.972 143.019L293.122 144.686L295.206 139.499L291.056 137.832L288.972 143.019Z"
			fill="white"
		/>
		<path
			d="M276.545 150.939L277.415 155.326L282.898 154.237L282.028 149.851L276.545 150.939Z"
			fill="white"
		/>
		<path
			d="M73 213.4C72.5 214.8 58 247 58 247H64L79 215.64C79 215.64 78.5 213.4 78 212C77 212 74 212.28 73 213.4Z"
			fill="#D9D9D9"
			fill-opacity="0.3"
		/>
		<path
			d="M79 215.92L78 212L307 212V215.92H79Z"
			fill="#7A7A7A"
			fill-opacity="0.7"
		/>
		<path
			d="M319 247L307 215.92V212C309 212.187 312.5 212.56 314 214.8C315.2 216.592 323.333 237.293 327 247H319Z"
			fill="#ADADAD"
			fill-opacity="0.38"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M31 23V202H355V23H31ZM79 169H313V98H79V169Z"
			fill="white"
		/>
		<path d="M35.5 47.5H274M35.5 71H274M35.5 93H274" stroke="black" />
		<mask
			id="mask0_203_3"
			style="mask-type:alpha"
			maskUnits="userSpaceOnUse"
			x="31"
			y="23"
			width="324"
			height="179"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M31 23V202H355V23H31ZM79 169H313V98H79V169Z"
				fill="white"
			/>
		</mask>
		<g mask="url(#mask0_203_3)">
			<rect x="18" y="98" width="347" height="111" fill="#E97361" />
		</g>
	</g>
	<defs>
		<clipPath id="clip0_203_3">
			<rect width="384" height="247" fill="white" />
		</clipPath>
	</defs>
</svg>;
