import clsx from "clsx";
import { CURSOR_SKINS } from "modules/cursor-skins/cursorSkinList";
import { CursorSkin } from "modules/cursor-skins/CursorSkinStore";
import useCursorSkin from "modules/cursor-skins/hooks/useCursorSkin";
import { useCursorSkinStore } from "modules/cursor-skins/hooks/useCursorSkinStore";
import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout";

export default function CursorList() {
	const store = useCursorSkinStore();
	const { cursorSkinId } = useCursorSkin();

	return (
		<Layout>
			<Head>
				<title>Cursor Skins</title>
			</Head>
			<section>
				<div className="flex flex-col gap-2 p-2 bg-gray-100 rounded-md shadow-md dark:bg-gray-700">
					<h2>Cursor Skins</h2>
					<div className="flex flex-row flex-wrap gap-2">
						<button
							key={"none"}
							disabled={cursorSkinId === null}
							onClick={() => store.selectCursorSkin(null)}
							className={clsx(
								"relative w-24 h-24 p-2 bg-white bg-opacity-25 border-2 border-solid rounded-md shadow-sm overflow-clip transition-shadow",
								{
									"border-green-400": cursorSkinId === null,
									"hover:shadow-md": cursorSkinId !== null,
								}
							)}
						>
							None
						</button>
						{(CURSOR_SKINS as unknown as CursorSkin[]).map((skin) => {
							const isUnlocked = store.unlockedCursorSkins.includes(skin.id);
							const isSelected = cursorSkinId === skin.id;

							return (
								<button
									key={skin.id}
									disabled={!isUnlocked || isSelected}
									onClick={() => store.selectCursorSkin(skin.id as any)}
									className={clsx(
										"relative w-24 h-24 p-2 bg-white bg-opacity-25 border-2 border-solid rounded-md shadow-sm overflow-clip transition-shadow",
										{
											"border-green-400": isSelected,
											"hover:shadow-md": !isSelected && isUnlocked,
										}
									)}
								>
									{!isUnlocked && (
										<div className="absolute top-0 left-0 z-50 flex flex-row items-center justify-center w-full h-full bg-gray-400 bg-opacity-25 backdrop-blur-md">
											<Image
												src="/locked_1f512.png"
												alt="locked"
												width={64}
												height={64}
											/>
										</div>
									)}
									<Image
										className="w-full h-full"
										src={skin.defaultSrc.src}
										alt={"TODO"}
										width={64}
										height={64}
									/>
								</button>
							);
						})}
					</div>
				</div>
			</section>
		</Layout>
	);
}
