const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/allposts', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')//post created want to be at top not in order that is right now which is at bottom 
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/followingposts', requireLogin, (req, res) => {
    //if postedBy in following then return the post 
    Post.find({postedBy: { $in: req.user.following}})
        .populate("postedBy", "_id name  pic")
        .populate("comments.postedBy", "_id name pic")
        .sort("-createdAt") //so post cant be at the top, note createdAt property comes when we set the timestamps to true in the model for the post
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, pic } = req.body
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please add all the input fields" })
    }
    req.user.password = undefined //hide from the backend
    // console.log(req.user)
    // res.send('ok')
    const post = new Post({
        title,
        body,
        pic,
        postedBy: req.user
    })
    post.save()
        .then(result => {
            res.json({ post: result })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/myposts',requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id }) //get all posts of the users who are logged in 
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .then(myPosts => {
            res.json({ myPosts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{ likes: req.user._id }
    }, {
        new: true
    })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(422).json({error: err})
    })
})


router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{ likes: req.user._id }
    }, {
        new: true
    })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(422).json({error: err})
    })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{ comments: comment }
    }, {
        new: true
    })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(422).json({error: err})
    })
})

router.delete('/deletepost/:postid',requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postid })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .then(post => {
            if(!post){
                return res.status(422).json({error: "Post not found"})
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.deleteOne()
                    .then(result => {
                        res.json(result)
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ error: "Internal server error" });
                    })
            } else {
                res.status(401).json({ error: "Unauthorized" });
            }
        })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "Internal server error" });
    })
})

router.delete('/deletecomment/:commentId', requireLogin, (req, res) => {
    Post.findOneAndUpdate(
        { "comments._id": req.params.commentId, "comments.postedBy": req.user._id },
        { $pull: { comments: { _id: req.params.commentId } } },
        { new: true }
    )
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .then( post => {
        if (!post) {
            return res.status(422).json({ error: "Post not found"})
        }
        res.json(post)
    })
    .catch( err => {
        console.log(err)
        res.status(422).json({ error: "Internal server error"})
    })
})

module.exports = router