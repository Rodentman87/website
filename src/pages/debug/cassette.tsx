import { Cassette } from "@components/ActivityCard/SpotifyCard/Cassette";
import { Track } from "@spotify/web-api-ts-sdk";
import Head from "next/head";
import { useState } from "react";
import Layout from "../../components/layout";

export default function AchievmentsDebug() {
	const [title, setTitle] = useState("Test Album");
	const [songLink, setSongLink] = useState("https://open.spotify.com/track/1");
	const [artist, setArtist] = useState("Test Artist");
	const [artistLink, setArtistLink] = useState(
		"https://open.spotify.com/artist/1"
	);
	const [album, setAlbum] = useState("Test Album");
	const [albumLink, setAlbumLink] = useState(
		"https://open.spotify.com/album/1"
	);
	const [cover, setCover] = useState(
		"https://i.scdn.co/image/ab67616d0000b27373d50b9ec2d2a127a06d21d3"
	);
	const [endsAt, setEndsAt] = useState(0);
	const [duration, setDuration] = useState(10);

	return (
		<Layout>
			<Head>
				<title>Cassette Debug</title>
			</Head>
			<section>
				<div className="p-2 mb-2 bg-gray-100 rounded-md shadow-md">
					<h2>Options</h2>
					<p className="flex flex-col gap-2 m-0 mt-1">
						<button
							onClick={async () => {
								const res = await fetch(
									"https://api.lanyard.rest/v1/users/152566937442975744"
								);
								const body = await res.json();
								const activity = body.data.activities.find((a) => a.type === 2);
								if (!activity) return;
								const song_id = activity.sync_id;
								if (song_id) {
									const song = (await fetch(`/api/song/${song_id}`).then(
										(res) => res.json()
									)) as Track | null;
									setTitle(song.name);
									setSongLink(song.external_urls.spotify);
									setArtist(song.artists[0].name);
									setArtistLink(song.artists[0].external_urls.spotify);
									setAlbum(song.album.name);
									setAlbumLink(song.album.external_urls.spotify);
									setCover(song.album.images[0].url);
									setEndsAt(activity.timestamps.end);
									setDuration(song.duration_ms / 1000);
								}
							}}
						>
							Pull from Spotify
						</button>
						<label>
							Title:
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="p-1 ml-2 bg-gray-200 rounded-md"
							/>
						</label>
						<label>
							Artist:
							<input
								type="text"
								value={artist}
								onChange={(e) => setArtist(e.target.value)}
								className="p-1 ml-2 bg-gray-200 rounded-md"
							/>
						</label>
						<label>
							Album:
							<input
								type="text"
								value={album}
								onChange={(e) => setAlbum(e.target.value)}
								className="p-1 ml-2 bg-gray-200 rounded-md"
							/>
						</label>
						<label>
							Cover:
							<input
								type="text"
								value={cover}
								onChange={(e) => setCover(e.target.value)}
								className="p-1 ml-2 bg-gray-200 rounded-md"
							/>
						</label>
					</p>
				</div>
				<div className="p-2 mb-2 bg-gray-100 rounded-md shadow-md">
					<Cassette
						key={title}
						title={title}
						songLink={songLink}
						artist={artist}
						artistLink={artistLink}
						album={album}
						albumLink={albumLink}
						cover={cover}
						duration={duration}
						endsAt={endsAt}
					/>
				</div>
			</section>
		</Layout>
	);
}
