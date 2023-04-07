const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const User = mongoose.model('User')
const requireLogin = require('../middleware/requireLogin')

router.get('/user/:userid', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.userid })
        .select("-password")
        .then(user => {
            if (!user) {
                return res.status(404).json({error: 'User not found'})
            }    
            Post.find({ postedBy: req.params.userid })
                .populate("postedBy", "_id name")
                .populate("comments.postedBy", "_id name")
                .then(posts => {
                    if (!posts) {
                        return res.status(422).json({error: 'No posts found for user'})
                    }
                    res.json({ user, posts })
                })
                .catch(err => {
                    console.log(err);
                    return res.status(422).json({ error: 'Error finding posts'})
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(422).json({ error: 'Error finding user'})
        })
})

router.put("/follow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followid, {
        $push: { followers: req.user._id }
        }, {
            new: true
        })
        .then((result1) => {
            console.log(result1)
            return User.findByIdAndUpdate(req.user._id, {
                            $push: { following: req.body.followid }
                        }, {
                            new: true
                        })
                        .select("-password")
        })
        .then((result2) => {
            console.log(result2)
            res.json(result2);
        })
        .catch((err) => {
            return res.status(422).json({ error: err });
        });
  });


router.put("/unfollow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowid, {
        $pull: { followers: req.user._id }
        }, {
            new: true
        })
        .then((result1) => {
            console.log(result1)
            
            return User.findByIdAndUpdate(req.user._id, {
                            $pull: { following: req.body.unfollowid }
                        }, {
                            new: true
                        })
                        .select("-password")
        })
        .then((result2) => {
            console.log(result2)
            res.json(result2);
        })
        .catch((err) => {
            return res.status(422).json({ error: err });
        });
});
  
router.put('/updatepic', requireLogin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true })
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(422).json({ error: "cannot post pic" })
    }
})

router.post('/search-users', (req, res) => {
    let userPattern = new RegExp("^" + req.body.query)
    User.find({ email: { $regex: userPattern } })
        .select("_id email pic name")
        .then(users => {
            res.json({ users })
        })
        .catch(err => {
            console.log(err)
        })
})

module.exports = router