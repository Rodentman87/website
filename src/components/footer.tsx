import { motion } from "framer-motion";
import { useSessionState } from "hooks/useSessionState";
import Image from "next/image";
import Link from "next/link";
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

	return (
		<footer>
			<motion.div
				layoutId="footer"
				className={styles.footer}
				initial={renderedOnce ? false : "hidden"}
				animate="visible"
				onAnimationComplete={() => setRenderedOnce(true)}
			>
				<motion.div layoutId="twitter" variants={item} custom={{ i: 0 }}>
					<SocialIcon url="https://twitter.com/rodentman87" />
				</motion.div>
				<motion.div layoutId="gh" variants={item} custom={{ i: 1 }}>
					<SocialIcon url="https://github.com/Rodentman87" />
				</motion.div>
				<motion.div layoutId="email" variants={item} custom={{ i: 2 }}>
					<SocialIcon url="mailto:maisy@likesdinosaurs.com" />
				</motion.div>
				<motion.div>
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
			</motion.div>
		</footer>
	);
};

export default Footer;
