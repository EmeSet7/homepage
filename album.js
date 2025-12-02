const resultDiv = document.getElementById('result');

  async function fetchCover(releaseId) {
    const url = `https://coverartarchive.org/release/${releaseId}/front`;
    // test if image exists
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('No cover');
      return url;
    } catch {
      return null;
    }
  }

  async function fetchAlbum(artist, album) {
    const query = `artist:${artist} AND release:${album}`;
    const url = `https://musicbrainz.org/ws/2/release/?query=artist:${artist}+AND+status:official+AND+(primary-type:album OR primary-type:ep)&fmt=json`;


    const res = await fetch(url);
    const data = await res.json();

    if (!data.releases || data.releases.length === 0) {
      resultDiv.innerHTML = 'No results found.';
      return;
    }

    const release = data.releases[0];
    const releaseId = release.id;
    const releaseTitle = release.title;
    const artistName = release['artist-credit'][0].name;

    const imageUrl = await fetchCover(releaseId);

    if (imageUrl) {
      resultDiv.innerHTML = `
        <h3>${artistName} – ${releaseTitle}</h3>
        <img src="${imageUrl}" alt="Album cover">
      `;
    } else {
      resultDiv.innerHTML = `
        <h3>${artistName} – ${releaseTitle}</h3>
        <p>No cover art available.</p>
      `;
    }
  }

  async function fetchRandomAlbum() {
    const offset = Math.floor(Math.random() * 100000); // pick random offset
    const url = `https://musicbrainz.org/ws/2/release/?query=artist:${artist}+AND+status:official+AND+(primary-type:album OR primary-type:ep)&fmt=json&limit=1&offset=${offset}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.releases || data.releases.length === 0) {
      resultDiv.innerHTML = 'Couldn’t find a random album. Try again.';
      return;
    }

    const release = data.releases[0];
    const releaseId = release.id;
    const releaseTitle = release.title;
    const artistName = release['artist-credit'][0].name;

    const imageUrl = await fetchCover(releaseId);

    if (imageUrl) {
      resultDiv.innerHTML = `
        <h3>${artistName} – ${releaseTitle}</h3>
        <img src="${imageUrl}" alt="Album cover">
      `;
    } else {
      resultDiv.innerHTML = `
        <h3>${artistName} – ${releaseTitle}</h3>
        <p>No cover art available.</p>
      `;
    }
  }

  document.getElementById('searchBtn').addEventListener('click', () => {
    const artist = document.getElementById('artist').value.trim();
    const album = document.getElementById('album').value.trim();

    if (!artist || !album) {
      resultDiv.innerHTML = 'Please enter both artist and album.';
      return;
    }

    fetchAlbum(artist, album);
  });

  document.getElementById('randomBtn').addEventListener('click', () => {
    fetchRandomAlbum();
  });
