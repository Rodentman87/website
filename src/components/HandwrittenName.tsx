import { motion } from "framer-motion";
import React from "react";

const duration = 3;

const mainTextVariants = (i: number) => ({
	hidden: {
		pathLength: 0,
		opacity: 0,
	},
	visible: {
		pathLength: 1,
		opacity: 1,
		transition: {
			pathLength: {
				ease: "easeOut",
				duration: duration,
				delay: i * 0.1 + 0.4,
			},
			opacity: {
				duration: 0.01,
				delay: i * 0.1 + 0.4,
			},
		},
	},
});

const dotVariants = {
	hidden: {
		pathLength: 0,
		opacity: 0,
	},
	visible: {
		pathLength: 1,
		opacity: 1,
		transition: {
			pathLength: {
				ease: "easeOut",
				duration: 0.5,
				delay: duration + 0.7,
			},
			opacity: {
				duration: 0.01,
				delay: duration + 0.7,
			},
		},
	},
};

export const HandwrittenName: React.FC<{
	onAnimationDone: () => void;
}> = ({ onAnimationDone }) => {
	return (
		<motion.svg
			className="absolute top-0 left-0 w-full origin-top-left not-sr-only"
			viewBox="0 0 199 76"
			fill="none"
			exit={{ opacity: 0, transition: { duration: 1 } }}
			xmlns="http://www.w3.org/2000/svg"
		>
			<motion.path
				variants={mainTextVariants(0)}
				initial="hidden"
				animate="visible"
				d="M2.4106 16.3289C2.55104 15.0649 4.06197 14.0174 4.79331 13.1189C6.34664 11.2105 8.03406 9.4393 9.62493 7.55918C11.6851 5.12442 14.7729 2.92613 18.0637 2.92613C21.4508 2.92613 21.3901 4.11958 22.2169 7.26134C23.8307 13.3937 20.1412 20.4127 17.8982 25.8598C17.8982 25.8598 5.5 57.5 5.09115 61.2861C4.68231 65.0722 21.1083 20.962 21.1083 20.962C23.2279 14.9171 26.1898 8.28675 29.8449 5.14337C33.5 2 37.2578 1.35226 39.3427 2.92613C41.4276 4.49999 41.4276 10.2129 41.4276 12.1261C41.4276 16.3911 40.8558 20.1804 39.5743 24.2713C39.5743 24.2713 28 57 26.7011 60.8559C25.4021 64.7118 37.3961 31.5081 43.198 19.754C49 8 55.3678 5.72845 58.9339 6.86422C62.5 8 62.5 13.5 61.9619 15.5C61.4239 17.5 54.5 43.5 53.9368 47.751C53.3736 52.0019 53.53 52.8018 54.003 55.1142C54.3112 56.6209 55.7016 59.8134 57.6598 59.8134C59.5007 59.8134 60.8801 57.4444 61.9619 56.2725C64.0919 53.965 66.3434 51.4251 67.836 48.661C68.9263 46.6419 70.1144 45.0408 71.8072 42.7704C73.5 40.5 74.9323 39.4115 77.4661 38.733C80 38.0546 79.6197 38.2161 81.0733 38.0546C83.5275 37.7819 85.851 37.4755 88.3373 37.4755C91.2891 37.4755 84.5 36.5 79.4848 37.2438C74.4697 37.9877 71.5 45.5 70.682 48.7603C69.864 52.0206 69.4262 53.597 70.0863 55.5775C70.8251 57.7939 74.091 57.4282 75.6791 56.5207C75.6791 56.5207 83.1149 50.8587 85.5574 48.4294C88 46 89.9754 41 89.9754 39.9244C89.9754 38.8488 90.4275 37.5027 89.3797 38.6669C87.8627 40.3524 87.5437 42.5968 86.6992 44.6236L83.8697 51.6229C83.6642 52.5682 83.0452 53.9512 83.5718 54.8991C84.2328 56.0888 85.0888 56.2394 86.4179 56.2394C87.9308 56.2394 90.5234 56.7646 91.9279 56.1732C93.3557 55.572 93.5334 55.3624 95.7667 53.4926C98 51.6229 103.612 45.0297 104.967 42.5719C106.322 40.114 106.952 38.0428 106.952 35.2417C106.952 33.3112 106.769 31.3112 104.421 31.8331C103.67 32 102.5 33.5 102.203 34.3316C101.907 35.1633 101 38.5 100.102 41.5129C99.2039 44.5257 98.6127 55.9746 98.6127 55.9746C98.6127 57.8319 98.293 58.3823 100.267 58.3243C101.443 58.2897 102.998 57.4877 104.106 56.984C105.693 56.2629 106.75 54.9156 108.276 53.5754C109.802 52.2351 111.581 50.5475 113.819 48.4956C116.058 46.4436 118.815 44.7945 121.249 42.969C123.683 41.1435 124.29 39.7526 126.543 37.4093C128.797 35.066 127.025 31.9767 124.955 30.3935C123.856 29.5528 120.057 28.3433 120.057 30.7741C120.057 33.5245 121.886 35.2726 123.333 37.492C124.781 39.7114 127.278 43.697 127.933 45.4841C128.589 47.2712 129 51 127.784 52.5164C126.569 54.0328 124.535 55.2771 123.234 55.8092C121.933 56.3413 120.66 56.3405 119.329 56.0077C117.473 55.5437 115 54 113.505 52.2351C112.009 50.4702 110.5 48.9911 111 48.4956C111.5 48 113.966 51.5587 116.483 53.0293C119 54.5 122.939 55.8027 125.716 55.9415C128.494 56.0804 132.298 57.4024 134.238 54.866C136.8 51.5156 138.507 47.126 140.161 43.2668C141 41.3088 141.045 39.024 141.866 37.1777C142.284 36.237 142.412 35.1022 142.759 34.1C143.137 33.0095 144.029 32.7798 144.778 32.1144C145.475 31.4944 146.86 31.5187 147.756 31.5187C149.07 31.5187 148.948 31.7909 148.948 33.041C148.948 34.364 149.043 35.7251 148.782 37.0287C148.462 38.6289 147.756 40.1286 147.756 41.7776V46.3445C147.756 47.639 147.362 49.7903 148.054 50.9445C148.69 52.0041 149.581 53.8816 150.884 54.171C154.097 54.8851 155.414 54.8105 158.181 52.3509C161.323 49.5574 164.529 45.3787 166.222 41.546C166.907 39.9972 167.989 38.5415 168.539 36.946C168.824 36.119 168.721 33.6198 169.267 33.0741C169.457 32.8837 169.498 35.6885 169.498 35.887C169.498 37.6126 169.437 39.2975 169.267 41.0165C168.98 43.906 168.12 46.6349 167.347 49.4222C166.575 52.2094 164.847 59.6318 164.022 64.0825C163.196 68.5331 162.966 72.1221 158.909 74.5565C157.895 75.1649 156.575 75.6296 155.368 75.2846C152.828 74.559 151.628 67.944 151.628 65.7702C151.628 63.2497 153.648 62.5665 155.666 61.2696C157.683 59.9726 166.219 54.9251 168.572 53.4926C170.925 52.0602 173.704 50.815 175.819 49.025C180.109 45.3949 184.9 42.4419 189.288 38.9647C191.251 37.4092 193.175 35.839 194.947 34.0669C195.677 33.337 196.865 32.5166 197.198 31.5187"
				stroke="#5bcefa"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<motion.path
				variants={mainTextVariants(1)}
				initial="hidden"
				animate="visible"
				d="M2.4106 16.3289C2.55104 15.0649 4.06197 14.0174 4.79331 13.1189C6.34664 11.2105 8.03406 9.4393 9.62493 7.55918C11.6851 5.12442 14.7729 2.92613 18.0637 2.92613C21.4508 2.92613 21.3901 4.11958 22.2169 7.26134C23.8307 13.3937 20.1412 20.4127 17.8982 25.8598C17.8982 25.8598 5.5 57.5 5.09115 61.2861C4.68231 65.0722 21.1083 20.962 21.1083 20.962C23.2279 14.9171 26.1898 8.28675 29.8449 5.14337C33.5 2 37.2578 1.35226 39.3427 2.92613C41.4276 4.49999 41.4276 10.2129 41.4276 12.1261C41.4276 16.3911 40.8558 20.1804 39.5743 24.2713C39.5743 24.2713 28 57 26.7011 60.8559C25.4021 64.7118 37.3961 31.5081 43.198 19.754C49 8 55.3678 5.72845 58.9339 6.86422C62.5 8 62.5 13.5 61.9619 15.5C61.4239 17.5 54.5 43.5 53.9368 47.751C53.3736 52.0019 53.53 52.8018 54.003 55.1142C54.3112 56.6209 55.7016 59.8134 57.6598 59.8134C59.5007 59.8134 60.8801 57.4444 61.9619 56.2725C64.0919 53.965 66.3434 51.4251 67.836 48.661C68.9263 46.6419 70.1144 45.0408 71.8072 42.7704C73.5 40.5 74.9323 39.4115 77.4661 38.733C80 38.0546 79.6197 38.2161 81.0733 38.0546C83.5275 37.7819 85.851 37.4755 88.3373 37.4755C91.2891 37.4755 84.5 36.5 79.4848 37.2438C74.4697 37.9877 71.5 45.5 70.682 48.7603C69.864 52.0206 69.4262 53.597 70.0863 55.5775C70.8251 57.7939 74.091 57.4282 75.6791 56.5207C75.6791 56.5207 83.1149 50.8587 85.5574 48.4294C88 46 89.9754 41 89.9754 39.9244C89.9754 38.8488 90.4275 37.5027 89.3797 38.6669C87.8627 40.3524 87.5437 42.5968 86.6992 44.6236L83.8697 51.6229C83.6642 52.5682 83.0452 53.9512 83.5718 54.8991C84.2328 56.0888 85.0888 56.2394 86.4179 56.2394C87.9308 56.2394 90.5234 56.7646 91.9279 56.1732C93.3557 55.572 93.5334 55.3624 95.7667 53.4926C98 51.6229 103.612 45.0297 104.967 42.5719C106.322 40.114 106.952 38.0428 106.952 35.2417C106.952 33.3112 106.769 31.3112 104.421 31.8331C103.67 32 102.5 33.5 102.203 34.3316C101.907 35.1633 101 38.5 100.102 41.5129C99.2039 44.5257 98.6127 55.9746 98.6127 55.9746C98.6127 57.8319 98.293 58.3823 100.267 58.3243C101.443 58.2897 102.998 57.4877 104.106 56.984C105.693 56.2629 106.75 54.9156 108.276 53.5754C109.802 52.2351 111.581 50.5475 113.819 48.4956C116.058 46.4436 118.815 44.7945 121.249 42.969C123.683 41.1435 124.29 39.7526 126.543 37.4093C128.797 35.066 127.025 31.9767 124.955 30.3935C123.856 29.5528 120.057 28.3433 120.057 30.7741C120.057 33.5245 121.886 35.2726 123.333 37.492C124.781 39.7114 127.278 43.697 127.933 45.4841C128.589 47.2712 129 51 127.784 52.5164C126.569 54.0328 124.535 55.2771 123.234 55.8092C121.933 56.3413 120.66 56.3405 119.329 56.0077C117.473 55.5437 115 54 113.505 52.2351C112.009 50.4702 110.5 48.9911 111 48.4956C111.5 48 113.966 51.5587 116.483 53.0293C119 54.5 122.939 55.8027 125.716 55.9415C128.494 56.0804 132.298 57.4024 134.238 54.866C136.8 51.5156 138.507 47.126 140.161 43.2668C141 41.3088 141.045 39.024 141.866 37.1777C142.284 36.237 142.412 35.1022 142.759 34.1C143.137 33.0095 144.029 32.7798 144.778 32.1144C145.475 31.4944 146.86 31.5187 147.756 31.5187C149.07 31.5187 148.948 31.7909 148.948 33.041C148.948 34.364 149.043 35.7251 148.782 37.0287C148.462 38.6289 147.756 40.1286 147.756 41.7776V46.3445C147.756 47.639 147.362 49.7903 148.054 50.9445C148.69 52.0041 149.581 53.8816 150.884 54.171C154.097 54.8851 155.414 54.8105 158.181 52.3509C161.323 49.5574 164.529 45.3787 166.222 41.546C166.907 39.9972 167.989 38.5415 168.539 36.946C168.824 36.119 168.721 33.6198 169.267 33.0741C169.457 32.8837 169.498 35.6885 169.498 35.887C169.498 37.6126 169.437 39.2975 169.267 41.0165C168.98 43.906 168.12 46.6349 167.347 49.4222C166.575 52.2094 164.847 59.6318 164.022 64.0825C163.196 68.5331 162.966 72.1221 158.909 74.5565C157.895 75.1649 156.575 75.6296 155.368 75.2846C152.828 74.559 151.628 67.944 151.628 65.7702C151.628 63.2497 153.648 62.5665 155.666 61.2696C157.683 59.9726 166.219 54.9251 168.572 53.4926C170.925 52.0602 173.704 50.815 175.819 49.025C180.109 45.3949 184.9 42.4419 189.288 38.9647C191.251 37.4092 193.175 35.839 194.947 34.0669C195.677 33.337 196.865 32.5166 197.198 31.5187"
				stroke="#f5abb9"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<motion.path
				variants={mainTextVariants(2)}
				initial="hidden"
				animate="visible"
				d="M2.4106 16.3289C2.55104 15.0649 4.06197 14.0174 4.79331 13.1189C6.34664 11.2105 8.03406 9.4393 9.62493 7.55918C11.6851 5.12442 14.7729 2.92613 18.0637 2.92613C21.4508 2.92613 21.3901 4.11958 22.2169 7.26134C23.8307 13.3937 20.1412 20.4127 17.8982 25.8598C17.8982 25.8598 5.5 57.5 5.09115 61.2861C4.68231 65.0722 21.1083 20.962 21.1083 20.962C23.2279 14.9171 26.1898 8.28675 29.8449 5.14337C33.5 2 37.2578 1.35226 39.3427 2.92613C41.4276 4.49999 41.4276 10.2129 41.4276 12.1261C41.4276 16.3911 40.8558 20.1804 39.5743 24.2713C39.5743 24.2713 28 57 26.7011 60.8559C25.4021 64.7118 37.3961 31.5081 43.198 19.754C49 8 55.3678 5.72845 58.9339 6.86422C62.5 8 62.5 13.5 61.9619 15.5C61.4239 17.5 54.5 43.5 53.9368 47.751C53.3736 52.0019 53.53 52.8018 54.003 55.1142C54.3112 56.6209 55.7016 59.8134 57.6598 59.8134C59.5007 59.8134 60.8801 57.4444 61.9619 56.2725C64.0919 53.965 66.3434 51.4251 67.836 48.661C68.9263 46.6419 70.1144 45.0408 71.8072 42.7704C73.5 40.5 74.9323 39.4115 77.4661 38.733C80 38.0546 79.6197 38.2161 81.0733 38.0546C83.5275 37.7819 85.851 37.4755 88.3373 37.4755C91.2891 37.4755 84.5 36.5 79.4848 37.2438C74.4697 37.9877 71.5 45.5 70.682 48.7603C69.864 52.0206 69.4262 53.597 70.0863 55.5775C70.8251 57.7939 74.091 57.4282 75.6791 56.5207C75.6791 56.5207 83.1149 50.8587 85.5574 48.4294C88 46 89.9754 41 89.9754 39.9244C89.9754 38.8488 90.4275 37.5027 89.3797 38.6669C87.8627 40.3524 87.5437 42.5968 86.6992 44.6236L83.8697 51.6229C83.6642 52.5682 83.0452 53.9512 83.5718 54.8991C84.2328 56.0888 85.0888 56.2394 86.4179 56.2394C87.9308 56.2394 90.5234 56.7646 91.9279 56.1732C93.3557 55.572 93.5334 55.3624 95.7667 53.4926C98 51.6229 103.612 45.0297 104.967 42.5719C106.322 40.114 106.952 38.0428 106.952 35.2417C106.952 33.3112 106.769 31.3112 104.421 31.8331C103.67 32 102.5 33.5 102.203 34.3316C101.907 35.1633 101 38.5 100.102 41.5129C99.2039 44.5257 98.6127 55.9746 98.6127 55.9746C98.6127 57.8319 98.293 58.3823 100.267 58.3243C101.443 58.2897 102.998 57.4877 104.106 56.984C105.693 56.2629 106.75 54.9156 108.276 53.5754C109.802 52.2351 111.581 50.5475 113.819 48.4956C116.058 46.4436 118.815 44.7945 121.249 42.969C123.683 41.1435 124.29 39.7526 126.543 37.4093C128.797 35.066 127.025 31.9767 124.955 30.3935C123.856 29.5528 120.057 28.3433 120.057 30.7741C120.057 33.5245 121.886 35.2726 123.333 37.492C124.781 39.7114 127.278 43.697 127.933 45.4841C128.589 47.2712 129 51 127.784 52.5164C126.569 54.0328 124.535 55.2771 123.234 55.8092C121.933 56.3413 120.66 56.3405 119.329 56.0077C117.473 55.5437 115 54 113.505 52.2351C112.009 50.4702 110.5 48.9911 111 48.4956C111.5 48 113.966 51.5587 116.483 53.0293C119 54.5 122.939 55.8027 125.716 55.9415C128.494 56.0804 132.298 57.4024 134.238 54.866C136.8 51.5156 138.507 47.126 140.161 43.2668C141 41.3088 141.045 39.024 141.866 37.1777C142.284 36.237 142.412 35.1022 142.759 34.1C143.137 33.0095 144.029 32.7798 144.778 32.1144C145.475 31.4944 146.86 31.5187 147.756 31.5187C149.07 31.5187 148.948 31.7909 148.948 33.041C148.948 34.364 149.043 35.7251 148.782 37.0287C148.462 38.6289 147.756 40.1286 147.756 41.7776V46.3445C147.756 47.639 147.362 49.7903 148.054 50.9445C148.69 52.0041 149.581 53.8816 150.884 54.171C154.097 54.8851 155.414 54.8105 158.181 52.3509C161.323 49.5574 164.529 45.3787 166.222 41.546C166.907 39.9972 167.989 38.5415 168.539 36.946C168.824 36.119 168.721 33.6198 169.267 33.0741C169.457 32.8837 169.498 35.6885 169.498 35.887C169.498 37.6126 169.437 39.2975 169.267 41.0165C168.98 43.906 168.12 46.6349 167.347 49.4222C166.575 52.2094 164.847 59.6318 164.022 64.0825C163.196 68.5331 162.966 72.1221 158.909 74.5565C157.895 75.1649 156.575 75.6296 155.368 75.2846C152.828 74.559 151.628 67.944 151.628 65.7702C151.628 63.2497 153.648 62.5665 155.666 61.2696C157.683 59.9726 166.219 54.9251 168.572 53.4926C170.925 52.0602 173.704 50.815 175.819 49.025C180.109 45.3949 184.9 42.4419 189.288 38.9647C191.251 37.4092 193.175 35.839 194.947 34.0669C195.677 33.337 196.865 32.5166 197.198 31.5187"
				stroke="white"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<motion.path
				variants={mainTextVariants(3)}
				initial="hidden"
				animate="visible"
				d="M2.4106 16.3289C2.55104 15.0649 4.06197 14.0174 4.79331 13.1189C6.34664 11.2105 8.03406 9.4393 9.62493 7.55918C11.6851 5.12442 14.7729 2.92613 18.0637 2.92613C21.4508 2.92613 21.3901 4.11958 22.2169 7.26134C23.8307 13.3937 20.1412 20.4127 17.8982 25.8598C17.8982 25.8598 5.5 57.5 5.09115 61.2861C4.68231 65.0722 21.1083 20.962 21.1083 20.962C23.2279 14.9171 26.1898 8.28675 29.8449 5.14337C33.5 2 37.2578 1.35226 39.3427 2.92613C41.4276 4.49999 41.4276 10.2129 41.4276 12.1261C41.4276 16.3911 40.8558 20.1804 39.5743 24.2713C39.5743 24.2713 28 57 26.7011 60.8559C25.4021 64.7118 37.3961 31.5081 43.198 19.754C49 8 55.3678 5.72845 58.9339 6.86422C62.5 8 62.5 13.5 61.9619 15.5C61.4239 17.5 54.5 43.5 53.9368 47.751C53.3736 52.0019 53.53 52.8018 54.003 55.1142C54.3112 56.6209 55.7016 59.8134 57.6598 59.8134C59.5007 59.8134 60.8801 57.4444 61.9619 56.2725C64.0919 53.965 66.3434 51.4251 67.836 48.661C68.9263 46.6419 70.1144 45.0408 71.8072 42.7704C73.5 40.5 74.9323 39.4115 77.4661 38.733C80 38.0546 79.6197 38.2161 81.0733 38.0546C83.5275 37.7819 85.851 37.4755 88.3373 37.4755C91.2891 37.4755 84.5 36.5 79.4848 37.2438C74.4697 37.9877 71.5 45.5 70.682 48.7603C69.864 52.0206 69.4262 53.597 70.0863 55.5775C70.8251 57.7939 74.091 57.4282 75.6791 56.5207C75.6791 56.5207 83.1149 50.8587 85.5574 48.4294C88 46 89.9754 41 89.9754 39.9244C89.9754 38.8488 90.4275 37.5027 89.3797 38.6669C87.8627 40.3524 87.5437 42.5968 86.6992 44.6236L83.8697 51.6229C83.6642 52.5682 83.0452 53.9512 83.5718 54.8991C84.2328 56.0888 85.0888 56.2394 86.4179 56.2394C87.9308 56.2394 90.5234 56.7646 91.9279 56.1732C93.3557 55.572 93.5334 55.3624 95.7667 53.4926C98 51.6229 103.612 45.0297 104.967 42.5719C106.322 40.114 106.952 38.0428 106.952 35.2417C106.952 33.3112 106.769 31.3112 104.421 31.8331C103.67 32 102.5 33.5 102.203 34.3316C101.907 35.1633 101 38.5 100.102 41.5129C99.2039 44.5257 98.6127 55.9746 98.6127 55.9746C98.6127 57.8319 98.293 58.3823 100.267 58.3243C101.443 58.2897 102.998 57.4877 104.106 56.984C105.693 56.2629 106.75 54.9156 108.276 53.5754C109.802 52.2351 111.581 50.5475 113.819 48.4956C116.058 46.4436 118.815 44.7945 121.249 42.969C123.683 41.1435 124.29 39.7526 126.543 37.4093C128.797 35.066 127.025 31.9767 124.955 30.3935C123.856 29.5528 120.057 28.3433 120.057 30.7741C120.057 33.5245 121.886 35.2726 123.333 37.492C124.781 39.7114 127.278 43.697 127.933 45.4841C128.589 47.2712 129 51 127.784 52.5164C126.569 54.0328 124.535 55.2771 123.234 55.8092C121.933 56.3413 120.66 56.3405 119.329 56.0077C117.473 55.5437 115 54 113.505 52.2351C112.009 50.4702 110.5 48.9911 111 48.4956C111.5 48 113.966 51.5587 116.483 53.0293C119 54.5 122.939 55.8027 125.716 55.9415C128.494 56.0804 132.298 57.4024 134.238 54.866C136.8 51.5156 138.507 47.126 140.161 43.2668C141 41.3088 141.045 39.024 141.866 37.1777C142.284 36.237 142.412 35.1022 142.759 34.1C143.137 33.0095 144.029 32.7798 144.778 32.1144C145.475 31.4944 146.86 31.5187 147.756 31.5187C149.07 31.5187 148.948 31.7909 148.948 33.041C148.948 34.364 149.043 35.7251 148.782 37.0287C148.462 38.6289 147.756 40.1286 147.756 41.7776V46.3445C147.756 47.639 147.362 49.7903 148.054 50.9445C148.69 52.0041 149.581 53.8816 150.884 54.171C154.097 54.8851 155.414 54.8105 158.181 52.3509C161.323 49.5574 164.529 45.3787 166.222 41.546C166.907 39.9972 167.989 38.5415 168.539 36.946C168.824 36.119 168.721 33.6198 169.267 33.0741C169.457 32.8837 169.498 35.6885 169.498 35.887C169.498 37.6126 169.437 39.2975 169.267 41.0165C168.98 43.906 168.12 46.6349 167.347 49.4222C166.575 52.2094 164.847 59.6318 164.022 64.0825C163.196 68.5331 162.966 72.1221 158.909 74.5565C157.895 75.1649 156.575 75.6296 155.368 75.2846C152.828 74.559 151.628 67.944 151.628 65.7702C151.628 63.2497 153.648 62.5665 155.666 61.2696C157.683 59.9726 166.219 54.9251 168.572 53.4926C170.925 52.0602 173.704 50.815 175.819 49.025C180.109 45.3949 184.9 42.4419 189.288 38.9647C191.251 37.4092 193.175 35.839 194.947 34.0669C195.677 33.337 196.865 32.5166 197.198 31.5187"
				stroke="black"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<motion.path
				variants={dotVariants}
				initial="hidden"
				animate="visible"
				d="M107.25 11.2656C105.967 11.2656 104.679 11.5291 103.841 12.6059C103.086 13.5772 102.889 15.9665 104.503 16.0311C105.343 16.0647 106.815 16.3134 107.382 15.5843C108.119 14.6374 107.895 13.6809 106.952 13.0527"
				stroke="black"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
				onAnimationComplete={() => onAnimationDone()}
			/>
			<motion.path
				initial={{ opacity: 0, pathLength: 0 }}
				animate={{ opacity: 1, pathLength: 1 }}
				transition={{
					opacity: { duration: 0.01, delay: 0.2 },
					pathLength: { duration: 0.25, delay: 0.2, ease: "easeInOut" },
				}}
				d="M2.4106 69H190"
				stroke="black"
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</motion.svg>
	);
};
