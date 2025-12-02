async function getRandomAlbum() {
    try {
        // Pick a random letter to widen the search
        const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));

        // Query for releases that are albums or EPs
        const searchUrl = `https://musicbrainz.org/ws/2/release/?query=${randomLetter}&fmt=json&limit=100&type=album|ep`;

        const res = await fetch(searchUrl);
        const data = await res.json();

        if (!data.releases || data.releases.length === 0) {
            throw new Error("No releases found.");
        }

        // Pick a random release from the list
        const release = data.releases[Math.floor(Math.random() * data.releases.length)];
        const title = release.title;
        const artist = release["artist-credit"]?.[0]?.name || "Unknown Artist";
        const releaseId = release.id;

        // Try fetching cover art
        const coverUrl = `https://coverartarchive.org/release/${releaseId}/front`;

        // Update HTML
        document.getElementById("albumTitle").textContent = title;
        document.getElementById("artistName").textContent = artist;

        const img = document.getElementById("coverArt");
        img.src = coverUrl;
        img.style.display = "block";

    } catch (err) {
        console.error(err);
        alert("Couldn't find a random album. Try again.");
    }
}

document.getElementById("generateButton").addEventListener("click", getRandomAlbum);
