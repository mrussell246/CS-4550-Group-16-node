import * as dao from '../../dao/dao.js'

export const postController = (app) => {
    
    // creates a new user
    app.post('/api/create-post', createPost)

    // gets a post with a specific post id
    app.get('/api/get-post/:pid', getPost)
    
    // gets all of the posts
    app.get('/api/get-all-posts', getAllPosts)
    
    // updates a post with a specific post id
    app.put('/api/update-post/:pid', updatePost)
    
    // deletes a post with a specific post id
    app.delete('/api/delete-post/:pid', deletePost)
    

}

/* 
    Creates a new post and inserts into the database
    Returns the newly inserted post in JSON form
    The following fields are assumed to be included in the body of the post request: 
        songTitle
        username
        artists
        genre
        albumArt
        spotifyURI
        spotifyID
        review 
*/

const createPost = async (req, res) => {
    const newPost = req.body;
    newPost.likes = 0;
    let post = {}
    try {
        post = await dao.createPost(newPost)
        await dao.assignPostToUser(newPost.username, post._id)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    res.json(post);
}

// Gets a post from the datbase with the provided postID as a parameter 
const getPost = async (req, res) => {
    const postID = req.params.pid
    let post = {}
    try {
        post = await dao.getPost(postID)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    res.json(post)
}

// retrieves all posts in the database
const getAllPosts = async (req, res) => {
    let posts = {}
    try {
        posts = await dao.getAllPosts()
    } catch (e) {
        res.status(400).json(e)
        return
    }
    res.json(posts)
}

/* 
    Updates a post in the database with the provided postID as a parameter
    The changes are sent in the body of the HTTP request 
*/
const updatePost = async (req, res) => {
    const postID = req.params.pid
    const changes = req.body;
    let statusObj = {}
    try {
        statusObj = await dao.updatePost(postID, changes)
        
        if (changes.username !== undefined) {
            await dao.changeUserWhoPosted(postID, changes.username)
        }
    } catch (e){
        res.status(400).json(e)
        return
    }
    if (statusObj.acknowledged === false) {
        res.sendStatus(400)
        return
    }
    res.json(statusObj);
}

// Deletes a post in the database with the provided postID as a parameter
const deletePost = async (req, res) => {
    const postID = req.params.pid
    let statusObj = {}
    try {
        statusObj = await dao.deletePost(postID).catch((e) => {res.status(400).json(e); return})
    } catch (e) {
        res.status(400).json(e)
        return
    }
    res.json(statusObj);
}