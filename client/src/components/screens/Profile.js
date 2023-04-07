import React, { useEffect, useState, useContext } from 'react'
import { Avatar, IconButton, LoadingButton } from '@mui/material';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import './Profile.css'
import { UserContext } from '../../App'

const Profile = () => {
    const [myPics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")
    // const [url, setUrl] = useState("")
    //To show a loading icon or bar while the picture is being updated, you can add a state variable to keep track of whether the image is being uploaded or not. Then, you can conditionally render a loading icon or bar based on this state variable.
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        // console.log(state)
        try {
            async function fetchData() {
                const request = await fetch('/myposts', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                    }
                })
                const result = await request.json()
                // console.log(result)
                setPics(result.myPosts)
            }
            fetchData()
        } catch (error) {
            console.log(error)
        }
    }, [state])

    useEffect(() => {
        if (image) {
            async function fetchData() {
                try {
                    const data = new FormData()
                    data.append("file", image)
                    data.append("upload_preset", "insta-clone")
                    data.append("cloud_name", "deus8embg")
                    const request = await fetch("https://api.cloudinary.com/v1_1/deus8embg/image/upload", {
                        method: "post",
                        body: data
                    })
                    const response = await request.json()
                    console.log(response)
                    // localStorage.setItem('user', JSON.stringify({ ...state, pic: response.url }))
                    // dispatch({ type: "UPDATEPIC", payload: response.url })
                    const fetchpic = await fetch('/updatepic', {
                        method: "Put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
                        },
                        body: JSON.stringify({
                            pic: response.url
                        })
                    })
                    // console.log(fetchpic)
                    localStorage.setItem('user', JSON.stringify({ ...state, pic: response.url }))
                    dispatch({ type: "UPDATEPIC", payload: response.url })
                } catch (error) {
                    console.log(error)
                }
                setIsUploading(false)
            }
            fetchData()
        }
    }, [image])
    
    const updatePhoto = (file) => {
        setImage(file)
        setIsUploading(true)
    }
  return (
   <div className='profile__wrapper'>
        <div className='profile__body'>
            <div className='profile__avatar__div'>
                <Avatar  src={ state?.pic || "/broken-image.jpg" } className='profile__avatar' />
            </div>
            <div className='profile__info'>
                <div className='profile__info__top'>
                    <div className='profile__name'>
                        {state ? state.name : "loading..."}   
                    </div>
                    <div className='profile__edits'>
                        <div className='file-field input-field'>
                        {
                            isUploading 
                            ? 
                            (
                                <div className="progress">
                                    <div className="indeterminate"></div>
                                </div>
                                        
                            ) 
                            : 
                            (
                                <div className='btn #64b5f6 blue darken-1'>
                                    <span>EditImage</span>
                                    <input
                                    type='file'
                                    accept="image/*"
                                    onChange={(e) => updatePhoto(e.target.files[0])}
                                    />
                                </div>
                            )
                        }
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
                        {state ? myPics.length : "0"} posts
                    </div>
                    <div className='followers'>
                        {state ? state.followers.length : "0"} followers
                    </div>
                    <div className='following'>
                        {state ? state.following.length : "0"} following
                    </div>
                </div>
                <div className='profile__info__bottom'>
                    <div className='profile__description'>
                        this is a test
                    </div>
                    <div className='profile__links'>
                        {state && state.email}
                    </div>
                </div>
            </div>
        </div>
        
        <div className='profile__gallery'>
            {
                  myPics.map(item => {
                      return (
                          <img className='profile__gallery__item' src={item.pic} alt="" key={ item._id } />
                    )
                })
            }
        </div>
   </div>
  )
}

export default Profile