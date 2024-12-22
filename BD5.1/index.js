const port = 3000;

const express = require('express');

const { track } = require('./models/track.model');
const { sequelize } = require('./lib/index');

const app = express();

const movieData = [
  {
    name: 'Raabta',
    genre: 'Romantic',
    release_year: 2012,
    artist: 'Arijit Singh',
    album: 'Agent Vinod',
    duration: 4,
  },
  {
    name: 'Naina Da Kya Kasoor',
    genre: 'Pop',
    release_year: 2018,
    artist: 'Amit Trivedi',
    album: 'Andhadhun',
    duration: 3,
  },
  {
    name: 'Ghoomar',
    genre: 'Traditional',
    release_year: 2018,
    artist: 'Shreya Ghosal',
    album: 'Padmaavat',
    duration: 3,
  },
  {
    name: 'Bekhayali',
    genre: 'Rock',
    release_year: 2019,
    artist: 'Sachet Tandon',
    album: 'Kabir Singh',
    duration: 6,
  },
  {
    name: 'Hawa Banke',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Darshan Raval',
    album: 'Hawa Banke (Single)',
    duration: 3,
  },
  {
    name: 'Ghungroo',
    genre: 'Dance',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'War',
    duration: 5,
  },
  {
    name: 'Makhna',
    genre: 'Hip-Hop',
    release_year: 2019,
    artist: 'Tanishk Bagchi',
    album: 'Drive',
    duration: 3,
  },
  {
    name: 'Tera Ban Jaunga',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Tulsi Kumar',
    album: 'Kabir Singh',
    duration: 3,
  },
  {
    name: 'First Class',
    genre: 'Dance',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'Kalank',
    duration: 4,
  },
  {
    name: 'Kalank Title Track',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'Kalank',
    duration: 5,
  },
];

// ---------------------------------------------------------- //
//                    Tutorial BD 5.2                         //
// ---------------------------------------------------------- //

// API 1: Fetch All the Tracks
async function fetchAllTracks() {
  let response = await track.findAll();
  return { tracks: response };
}

app.get('/tracks', async (req, res) => {
  try {
    let result = await fetchAllTracks();

    if (result.tracks.length === 0) {
      return res.status(404).json({ message: 'No Track Found!' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// API 2: Fetch track by ID
async function fetchTrackByID(id) {
  let response = await track.findOne({ where: { id } });
  return { tracks: response };
}

app.get('/tracks/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchTrackByID(id);

    if (!result.tracks) {
      return res.status(404).json({ message: 'No Track Found!' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /tracks/details/4

// API 3: Fetch tracks by Artist
async function fetchTrackByArtist(artist) {
  let response = await track.findAll({ where: { artist } });
  return { tracks: response };
}

app.get('/tracks/artist/:artist', async (req, res) => {
  try {
    let artist = req.params.artist;
    let result = await fetchTrackByArtist(artist);

    if (result.tracks.length === 0) {
      return res.status(404).json({ message: 'No Track Found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /tracks/artist/Tulsi%20Kumar
// Path = /tracks/artist/Arijit%20Singh

// API 4: Fetch tracks sorted by release_year
async function fetchTracksSortByReleaseYear(order) {
  let response = await track.findAll({
    order: [['release_year', order]],
  });
  return { tracks: response };
}

app.get('/tracks/sort/release_year', async (req, res) => {
  try {
    let order = req.query.order;

    // Validate the `order` query parameter
    if (!['ASC', 'DESC'].includes(order)) {
      return res
        .status(400)
        .json({ message: 'Invalid order parameter. Use ASC or DESC.' });
    }

    let result = await fetchTracksSortByReleaseYear(order);

    if (result.tracks.length === 0) {
      return res.status(404).json({ message: 'No Track Found!' });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /tracks/sort/release_year?order=ASC
// Path = /tracks/sort/release_year?order=DESC

/*
  - If /tracks/sort/release_year?ASC
      {"message":"Invalid order parameter. Use ASC or DESC."}
*/

// ---------------------------------------------------------- //
//                    Tutorial BD 5.3                         //
// ---------------------------------------------------------- //

// API 5: Adding a New Track (POST METHOD)
async function addNewTrack(newTrack) {
  let response = await track.create(newTrack);
  return { response };
}

app.post('/tracks/new', async (req, res) => {
  try {
    let newTrack = req.body.newTrack;
    let result = await addNewTrack(newTrack);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------------------- //
//                    Tutorial BD 5.1                         //
// ---------------------------------------------------------- //

// Seeding The Data to Database
app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await track.bulkCreate(movieData);

    res.status(200).json({ message: 'Database Seeding Successful' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
