import mongoose from 'mongoose'

const postsSchema = mongoose.Schema({
    songTitle: {type: String, required: true},
    review: {type: String, required: true},
    rating: {type: Number, min: 0, max: 5, required: true},
    username: {type: String, required: true},
    artists: Array,
    time: String,
    genre: String,
    albumArt: String,
    spotifyURI: String,
    spotifyID: String,
    likes: Number,
}, {collection: 'posts'})

export default postsSchema