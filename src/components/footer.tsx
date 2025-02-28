import { motion } from "framer-motion";
import { useSessionState } from "hooks/useSessionState";
import Image from "next/image";
import Link from "next/link";
import { useFinderItem } from "pages/finder";
import { SocialIcon } from "react-social-icons";
import styles from "./layout.module.css";

const item = {
	visible: ({ i }) => ({
		opacity: 1,
		transition: {
			delay: i * 0.1,
		},
	}),
	hidden: { opacity: 0 },
};

const Footer = () => {
	// Use this state here so that the icons don't pop in an out on every page transition
	const [renderedOnce, setRenderedOnce] = useSessionState(
		"footer-rendered",
		false,
		true
	);
	const achievementButtonRef = useFinderItem("achievementButton");

	const hasPointer =
		(typeof window !== "undefined" &&
			window.matchMedia("(pointer:fine)").matches) ||
		typeof window === "undefined";

	return (
		<footer>
			<motion.div
				layoutId="footer"
				className={styles.footer}
				initial={renderedOnce ? false : "hidden"}
				animate="visible"
				onAnimationComplete={() => setRenderedOnce(true)}
			>
				<motion.div
					layoutId="bluesky"
					variants={item}
					custom={{ i: 0 }}
					className="cursor-pointer"
				>
					<SocialIcon url="https://bsky.app/profile/maisy.likesdinosaurs.com" />
				</motion.div>
				<motion.div layoutId="gh" variants={item} custom={{ i: 1 }}>
					<SocialIcon url="https://github.com/Rodentman87" />
				</motion.div>
				<motion.div layoutId="discord" variants={item} custom={{ i: 2 }}>
					<SocialIcon
						network="discord"
						url="https://discord.likesdinosaurs.com"
					/>
				</motion.div>
				<motion.div layoutId="email" variants={item} custom={{ i: 3 }}>
					<SocialIcon url="mailto:maisy@likesdinosaurs.com" />
				</motion.div>
				<motion.div
					layoutId="achievements"
					variants={item}
					custom={{ i: 4 }}
					ref={achievementButtonRef as any}
				>
					<Link href="/achievements">
						<div className="bg-yellow-300 aspect-square w-[50px] rounded-full flex flex-row justify-center items-center">
							<Image
								src="/trophy_1f3c6.png"
								alt="Achievements"
								width={36}
								height={36}
							/>
						</div>
					</Link>
				</motion.div>
				<motion.div
					layoutId="cursors"
					variants={item}
					custom={{ i: 5 }}
					className={hasPointer ? "visible" : "hidden"}
				>
					<Link href="/cursor-skins">
						<div className="bg-gray-100 aspect-square w-[50px] rounded-full flex flex-row justify-center items-center cursor-pointer">
							<Image
								src="/pencil_270f-fe0f.png"
								alt="cursors"
								width={36}
								height={36}
							/>
						</div>
					</Link>
				</motion.div>
			</motion.div>
		</footer>
	);
};

export default Footer;
