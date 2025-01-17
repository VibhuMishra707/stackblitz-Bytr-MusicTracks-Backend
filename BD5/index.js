// ---------------------------------------------------------- //
//                    Tutorial BD 5.1                         //
// ---------------------------------------------------------- //

const port = 3000;

const express = require("express");

const { sequelize } = require("./lib/index");

// ---------------------------------------------------------- //
//                    Tutorial BD 5.5                         //
// ---------------------------------------------------------- //

const { Op } = require("@sequelize/core");

// ---------------------------------------------------------- //
//                    Tutorial BD 5.1                         //
// ---------------------------------------------------------- //

const { track } = require("./models/track.model");
const { user } = require("./models/user.model");
const { like } = require("./models/like.model");

const app = express();

// ---------------------------------------------------------- //
//                    Tutorial BD 5.3                         //
// ---------------------------------------------------------- //

app.use(express.json());

// ---------------------------------------------------------- //
//                    Tutorial BD 5.1                         //
// ---------------------------------------------------------- //
const musicTrack = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghosal",
    album: "Padmaavat",
    duration: 3,
  },
  {
    name: "Bekhayali",
    genre: "Rock",
    release_year: 2019,
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    duration: 6,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke (Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanishk Bagchi",
    album: "Drive",
    duration: 3,
  },
  {
    name: "Tera Ban Jaunga",
    genre: "Romantic",
    release_year: 2019,
    artist: "Tulsi Kumar",
    album: "Kabir Singh",
    duration: 3,
  },
  {
    name: "First Class",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Title Track",
    genre: "Romantic",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
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

app.get("/tracks", async (req, res) => {
  try {
    let result = await fetchAllTracks();

    if (result.tracks.length === 0) {
      return res.status(404).json({ message: "No Track Found!" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// API 2: Fetch track by ID
async function fetchTrackByID(id) {
  let response = await track.findOne({ where: { id } });    // If not found | Returns null Value
  return { tracks: response };
}

app.get("/tracks/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchTrackByID(id);

    if (!result.tracks) {
      return res.status(404).json({ message: "No Track Found!" });
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

app.get("/tracks/artist/:artist", async (req, res) => {
  try {
    let artist = req.params.artist;
    let result = await fetchTrackByArtist(artist);

    if (result.tracks.length === 0) {
      return res.status(404).json({ message: "No Track Found" });
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
    order: [["release_year", order]],
  });
  return { tracks: response };
}

app.get("/tracks/sort/release_year", async (req, res) => {
try {
    let order = req.query.order;

    // Validate the `order` query parameter
    if (!["ASC", "DESC"].includes(order)) {
      return res
        .status(400)
        .json({ message: "Invalid order parameter. Use ASC or DESC." });
    }

    let result = await fetchTracksSortByReleaseYear(order);

    if (result.tracks.length === 0) {
      return res.status(404).json({ message: "No Track Found!" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /tracks/sort/release_year?order=ASC
// Path = /tracks/sort/release_year?order=DESC

/*
  -IF: /tracks/sort/release_year?ASC
      {"message":"Invalid order parameter. Use ASC or DESC."}
*/

// ---------------------------------------------------------- //
//                    Tutorial BD 5.3                         //
// ---------------------------------------------------------- //

// API 5: Adding a New Track (POST METHOD)
async function addNewTrack(trackData) {
  let newTrack = await track.create(trackData);
  return { newTrack };
}

app.post("/tracks/new", async (req, res) => {
  try {
    // let trackData = req.body;
    let trackData = req.body;
    /*
  -IF: let trackData = req.body.newTrack;
  -- Then Body will be:
  {
      "newTrack": {
          "name": "Heer Asmani",
          "genre": "Pop",
          "release_year": 2024,
          "artist": "B Praak",
          "album": "Fighter",
          "duration": 4
      }
  }
  -- Output would be:
  {
      "newTrack": {
          "id": 14,
          "name": "Heer Asmani",
          "genre": "Pop",
          "release_year": 2024,
          "artist": "B Praak",
          "album": "Fighter",
          "duration": 4,
          "updatedAt": "2024-12-22T11:09:58.953Z",
          "createdAt": "2024-12-22T11:09:58.953Z"
      }
  }
*/

    // Validate the trackData in Body
    if (
      !trackData.name ||
      !trackData.genre ||
      !trackData.release_year ||
      !trackData.artist ||
      !trackData.album ||
      !trackData.duration
    ) {
      return res.status(400).json({
        message: "Invalid Track Data, Please provide all required fields.",
      });
    }

    let result = await addNewTrack(trackData);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// API 6: Update Track By ID
// async function updateTrackByID(trackData, id) {
async function updateTrackByID(id, trackData) {
  let updatedTrack = await track.findOne({ where: { id } });
  // console.log("Updating the track with ID: ", id);    To Debug
  if (!updatedTrack) {
    // console.log("Track not found!");    It helped in Debuging | Previously, async function updateTrackByID(trackData, id);
    return null;
  }
  console.log("Track found: ", updatedTrack);
  updatedTrack.set(trackData);
  await updatedTrack.save();
  return { updatedTrack: updatedTrack };
}

app.post("/tracks/update/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);

    // Validate id is a number
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID is not a number" });
    }

    let trackData = req.body;
    let result = await updateTrackByID(id, trackData);

    if (!result) {
      return res.status(404).json({ message: "Track not found!" });
    }

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// API 7: Delete Track By ID
async function deleteTrackByID(id) {
  let deletedTrack = await track.findOne({ where: { id } });
  await track.destroy({ where: { id } });    // track.destroy | stores Boolean Value
  if (!deletedTrack) {
    return null;
  }
  return { message: "Track Deleted", deletedTrack: deletedTrack };
}

app.post("/tracks/delete/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID is not a number" });
    }
    let result = await deleteTrackByID(id);
    if (!result) {
      return res.status(404).json({ message: "Track Not Found!" });
    }
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------------------- //
//                    Tutorial BD 5.4                         //
// ---------------------------------------------------------- //

// user - API 1: Create New User by POST (Method)
async function createNewUser(userData) {
  let newUser = await user.create(userData);
  return { newUser: newUser };
}

app.post("/users/new", async (req, res) => {
  try {
    let userData = req.body;

    if (!userData.username || !userData.email || !userData.password) {
      return res
        .status(400)
        .json({ message: "Invalid user data, please provide all fields." });
    }
    let result = await createNewUser(userData);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// user - API 2: Update User By ID
async function updateUserByID(id, userData) {
  let updatedUser = await user.findOne({ where: { id } });
  if (!updatedUser) {
    return null;
  }
  updatedUser.set(userData);
  await updatedUser.save();
  return { updatedUser: updatedUser };
}

app.post("/users/update/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID is not a number" });
    }
    let userData = req.body;
    let result = await updateUserByID(id, userData);
    if (!result) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// user - My API: Fetch All Users
async function fetchAllUsers() {
  let response = await user.findAll();
  return { users: response };
}

app.get("/users", async (req, res) => {
  try {
    let result = await fetchAllUsers();
    if (result.users.length === 0) {
      return res.status(404).json({ message: "No User Found!" });
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------------------- //
//                    Tutorial BD 5.5                         //
// ---------------------------------------------------------- //

// Like - API 1: User Liked a Track
async function likeTrack(userId, trackId) {
  let userFound = await user.findOne({ where: { id: userId } });
  let trackFound = await track.findOne({ where: { id: trackId } });
  let isRecordExist = { userFound, trackFound };
  if (!userFound || !trackFound) {
    return isRecordExist;
  }
  
  let alreadyLiked = await like.findOne({where: {userId: userId, trackId: trackId}});;
  if (alreadyLiked) {
    return null;
  }
  
  let newLike = await like.create({ userId: userId, trackId: trackId });
  return { newLike: newLike };
}

app.get("/users/:userId/like", async (req, res) => {
  try {
    let userId = parseInt(req.params.userId);
    let trackId = parseInt(req.query.trackId);
    if (isNaN(userId) || isNaN(trackId)) {
      return res.status(400).json({ message: "Both IDs must be numbers" });
    }

    let result = await likeTrack(userId, trackId);
    
    if (!result) {
      return res.status(409).json({message: "Like Already Exist!"})
    }

    // if (!result.userFound && !result.trackFound) {    // It is different from | if (result.userFound === null && result.trackFound === null) {
/* ---- Chat GPT 4O ----
In your if checks, you're evaluating `!result.userFound && !result.trackFound` without verifying that result contains userFound and trackFound.        But, In case of `result.userFound === null && result.trackFound === null`, It strictly compare the value `result.userFound` and `hresult.trackFound` with Null.
*/
    if (result.userFound === null && result.trackFound === null) {
      return res.status(404).json({ message: "User and Track Not Found!" });
    }
    if (result.userFound === null) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    if (result.trackFound === null) {
      return res.status(404).json({ message: "Track Not Found!" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Path = /users/1/like?trackId=4

// like - API 2: User Disliked a Track
async function userDisliked(userId, trackId) {
  let userFound = await user.findOne({where : {id : userId}});
  let trackFound = await track.findOne({where: {id : trackId}});
  let isRecordExist = {userFound, trackFound};
  if (!userFound || !trackFound){
    return isRecordExist;
  }
  let response = await like.destroy({where: {
    userId: userId,
    trackId: trackId
  }});
  if (response === 0) {    // response === false  | Does not work
    return null;
  }
  return {message: `User ID: ${userId} disliked track with Track ID: ${trackId}`};
}

app.get('/users/:userId/dislike', async (req, res) => {
  try {
    let userId = parseInt(req.params.userId);
    let trackId = parseInt(req.query.trackId);
    if (isNaN(userId) || isNaN(trackId)) {
      return res.status(400).json({message: "Both IDs must be numbers."})
    }
    let result = await userDisliked(userId, trackId);

    if (result === null) {
      return res.status(404).json({message: "No such like is present!"})
    }
    
    if (result.userFound === null && result.trackFound === null) {
      return res.status(404).json({message: "User and Track Not Found!"})
    }
    if (result.userFound === null) {
      return res.status(404).json({message: "No User Found!"});
    }
    if (result.trackFound === null) {
      return res.status(404).json({message: "No Track Found!"});
    }
    
// It requires to be the first Condition, else {"error":"Cannot read properties of null (reading 'userFound')"}
    // if (result === null) {
    //   return res.status(404).json({message: "No such like is present!"})
    // }
    
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// Path = /users/1/dislike?trackId=4

// like - API 3: fetch All Liked Tracks of a User
async function fetchAllLikedTracks(userId) {
  let userFound = await user.findOne({where: {id : userId}});
  if (!userFound) {
    return null;
  }
  
  let likeTrackIdRecords = await like.findAll({where: {userId: userId}, attributes: ['trackId']});
  // console.log(likeTrackIdRecords);    // Check This Out
 
  let likedTrackIds = [];
  for (let i=0; i<likeTrackIdRecords.length; ++i) {
    likedTrackIds.push(likeTrackIdRecords[i].trackId);
/*  ---- Chat GPT 4O ----
Each element in the array is an instance of your ORM model (likely Sequelize) for the like table. These instances have a property called `dataValues` where the actual values of the fields reside, along with other metadata like `_previousDataValues`.
-> When you use likeTrackIdRecords[i].trackId, Sequelize uses a getter to fetch the value from dataValues.
*/
  }
  // console.log(likedTrackIds);
  
  let likedTracks =  await track.findAll({
    where: {
      id: { [Op.in] : likedTrackIds }
    }
  });
  return {likedTracks: likedTracks}
}

app.get('/users/:userId/liked', async (req, res) => {
  try {
    let userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({message: "User ID is not a number!"});
    }
    let result = await fetchAllLikedTracks(userId);
    if (!result) {
      return res.status(404).json({message: "No User Found!"});
    }
    if (result.likedTracks.length === 0) {
      return res.status(404).json({message: `No Liked Tracks By User ID: ${userId}`});
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

// like - API 4: fetch All Liked Tracks of a User for particular Artist
async function fetchLikedTracksArtist(userId, artist) {
  let userFound = await user.findOne({where: {id : userId}});
  if (!userFound) {
    return null;
  }
  let likeTrackIdRecords = await like.findAll({where: {userId : userId}, attributes: ['trackId']});
  let likedTrackIds = [];
  for (let i=0; i<likeTrackIdRecords.length; ++i) {
    likedTrackIds.push(likeTrackIdRecords[i].trackId);
  }
  let likedTracksArtist = await track.findAll({where:
    { id: 
      { [Op.in] : likedTrackIds }, artist}
    });
  return {likedTracksArtist: likedTracksArtist};
}

app.get('/users/:userId/liked-artist', async(req, res) => {
  try {
    let userId = parseInt(req.params.userId);
    let artist = req.query.artist;

    if (isNaN(userId)) {
      return res.status(400).json({message: "User ID is not a number!"});
    }
    let result = await fetchLikedTracksArtist(userId, artist);
    if (!result) {
      return res.status(404).json({message: "User Not Found!"});
    }
    if (result.likedTracksArtist.length === 0) {
       return res.status(404).json({message: `No Liked Tracks By User ID: ${userId} for ${artist}`});
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

// like - My API: Fetch All Likes
async function fetchAllLikes() {
  let response = await like.findAll();
  return {likes: response};
}

app.get('/likes', async (req, res) => {
  try {
    let result = await fetchAllLikes();
    if (result.likes.length === 0) {
      return res.status(404).json({message: "No Like Found!"});
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
})

// Path = /users/1/like?trackId=4

// ---------------------------------------------------------- //
//                    Tutorial BD 5.1                         //
// ---------------------------------------------------------- //

// Seeding The Data to Database
app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

// ---------------------------------------------------------- //
//                    Tutorial BD 5.5                         //
// ---------------------------------------------------------- //
    await user.create({
      username: "testuser",
      email: "testuser@gmail.com",
      password: "testuser",
    });

// ---------------------------------------------------------- //
//                    Tutorial BD 5.1                         //
// ---------------------------------------------------------- //

    await track.bulkCreate(musicTrack);

    res.status(200).json({ message: "Database Seeding Successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error seeding the data", error: error.message });
  }
});

app.listen(port, () => {
  // console.log(`Server is running on  ${port}`);
  console.log(`App is listening at http://localhost:${port}`);
});
