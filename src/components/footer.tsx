import { motion, useReducedMotion } from "framer-motion";
import { useSessionState } from "hooks/useSessionState";
import React from "react";
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
				<motion.div layoutId="discord" variants={item} custom={{ i: 3 }}>
					<SocialIcon
						network="discord"
						bgColor="#5865F2"
						url="https://discord.likesdinosaurs.com"
					/>
				</motion.div>
			</motion.div>
		</footer>
	);
};

export default Footer;
