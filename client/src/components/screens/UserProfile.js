import React, { useEffect, useState, useContext } from 'react'
import { Avatar, Button, IconButton } from '@mui/material';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import './Profile.css'
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom'

const Profile = () => {
    const [userProfile, setUserProfile] = useState('')
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    // const [showFollow, setShowFollow] = useState( true);
    const [showFollow, setShowFollow] = useState(state ?  !state.following.includes(userid) : true )
    // console.log(userid)
    // console.log(state)
    useEffect(() => {
        try {
            async function fetchData() {
                const herokuBackendURL = "https://insta-mernbackend-2be90e891ef6.herokuapp.com";
                const request = await fetch(`${herokuBackendURL}/user/${userid}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                    }
                    })
                    const result = await request.json();
                    setUserProfile(result);
                }
                fetchData();
          } catch (error) {
            console.log(error);
          }
    }, [])

    //without this the bug of refesh will set the state to true and follow button will show regardless if we've followed the user already
    useEffect(() => {
        // set showFollow to false if user is already being followed
        setShowFollow(state && !state.following.includes(userid));
      }, [state, userid]);
    
    const followUser = async () => {
        try {
            const herokuBackendURL = "https://insta-mernbackend-2be90e891ef6.herokuapp.com";
            const request = await fetch(`${herokuBackendURL}/follow`, {
                method: "Put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify({
                    followid: userid
                })
            })
    
            const result = await request.json()
    
            // Check if user is already following the person they are trying to follow If the user is not already following the person they are trying to follow, we update the local state accordingly. If the user is already following the person, we do not update the local state. This should prevent the user from following the same person multiple times.
                dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } })
                localStorage.setItem('user', JSON.stringify(result))
                setUserProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [
                                ...prevState.user.followers, result._id
                            ]
                        }
                    }
                })
           
            //to prevent a user from unfollowing someone they have already unfollowed. You could update the setShowFollow state based on whether the user's followers include the userid or not.
            setShowFollow(false)//Here, setShowFollow is set to the opposite of whether the result.followers includes the userid, which means that if the user's followers include the userid, then setShowFollow will be false (unfollow button will be displayed), and if the user's followers do not include the userid, then setShowFollow will be true (follow button will be displayed).
        } catch (error) {
            console.log(error)
        }
    }

    const unfollowUser = async () => {
        try {
            const herokuBackendURL = "https://insta-mernbackend-2be90e891ef6.herokuapp.com";
            const request = await fetch(`${herokuBackendURL}/unfollow`, {
                method: "Put",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                }, 
                body: JSON.stringify({
                    unfollowid: userid
                })
            })

            const result = await request.json()
            console.log(result)
            dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } })
            localStorage.setItem('user', JSON.stringify(result))
            setUserProfile((prevState) => {
                //const newFollowing = prevState.user.following.filter(item => item !== result._id)//dnt need it updates following array also 
                const newFollowers = prevState.user.followers.filter(item => item !== result._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollowers
                    }
                }
            })
            setShowFollow( true)
        } catch (error) {
            console.log(error)
        }
    }
  
    return (
        <>
            {
                userProfile
                ? 
                <div className='profile__wrapper'>
                    <div className='profile__body'>
                        <div className='profile__avatar__div'>
                                <Avatar src={userProfile ? userProfile.user.pic : "/broken-image.jpg"} className='profile__avatar' />
                        </div>
                        <div className='profile__info'>
                            <div className='profile__info__top'>
                                <div className='profile__name'>
                                    {userProfile.user ? userProfile.user.name : "loading..."}   
                                </div>
                                <div className='profile__edits'>
                                    <div className='profile__edits__edit'>
                                        <Button variant="outlined" className='edit'>
                                            Edit Profile
                                        </Button>
                                    </div>
                                    <div className='profile__edits__gears'>
                                        <IconButton>
                                            <MiscellaneousServicesIcon className='gears'/>
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                            <div className='profile__info__middle'>
                                <div className='posts'>
                                    {userProfile && userProfile.posts.length} posts
                                </div>
                                <div className='followers'>
                                {userProfile && userProfile.user.followers.length} followers
                                </div>
                                <div className='following'>
                                {userProfile && userProfile.user.following.length} following
                                </div>
                            </div>
                            <div className='profile__info__bottom'>
                                <div className='profile__description'>
                                    this is a test
                                </div>
                                <div className='profile__links'>
                                {userProfile.user ? userProfile.user.email : "loading..."}   
                                </div>
                                <div className='profile__info__bottom__buttons'>
                                        {
                                            <>  {
                                                    showFollow
                                                    ?
                                                    <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
                                                        onClick={() => followUser()}
                                                    >
                                                        Follow
                                                    </button>
                                                    :
                                                    <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
                                                        onClick={() => unfollowUser()}
                                                    >
                                                        Unfollow
                                                    </button>
                                                }
                                            </>
                                        }
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='profile__gallery'>
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img className='profile__gallery__item' src={item.pic} alt="" key={ item._id } />
                                )
                            })
                        }
                    </div>
                </div>
                : 
                <h2>
                    loading...
                </h2>
            }
        </>
  )
}

export default Profile