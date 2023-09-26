import React, { useState, useEffect } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import M from 'materialize-css'
const Signup = () => {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const navigate = useNavigate()

    //if we get a new url thena again we call a callback to post data
    useEffect(() => {
        if (url) { //if because we dont want the useEffect to be called when we mount but when we get a new url
            uploadFields()
        }
    }, [url])

    const uploadData = async () => {
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
            // console.log(response)
            setUrl(response.url)
        } catch (error) {
            console.log(error)
        }
    }

    const uploadFields = async() => {
        try {
            const mailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            if(!mailformat.test(email))
            {
                M.toast({html: "Invalid Email Address", classes: "#d50000 red accent-4"})
                return;
            }
            const herokuBackendURL = "https://insta-mernbackend-2be90e891ef6.herokuapp.com"; 
            const request = await fetch(`${herokuBackendURL}/signup`, {
                method: "post",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name,
                    password,
                    email,
                    pic:url
                })
            })
            const response = await request.json()
            if (response.error) {
                M.toast({html: response.error, classes: "#d50000 red accent-4"})
            } else {
                M.toast({ html: response.message, classes: "#00c853 green accent-4" })
                navigate('/signin')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const PostData = () => {
        if (image) {
            uploadData()
        } else {
            uploadFields()
        }
    }

    return (
        <div className='my__card'>
            <div className="card auth__card input-field">
                <h2 className='card__title'>
                    Instagram
                </h2>
                <div className='input__text'>
                    <input
                        type="text"
                        placeholder="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='input__text'>
                    <input
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='input__text'>
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='file-field input-field'>
                    <div className='btn #64b5f6 blue darken-1'>
                        <span>Upload Image</span>
                        <input
                            type='file'
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className='file-path-wrapper'>
                        <input className='file-path validate' type='text' />
                    </div>
                </div>
                <div>
                    <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
                        onClick = { () => PostData() }
                    >
                        Submit
                    </button>
                    <h5>
                        <Link to='/signin'>Already have an account ?</Link>
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default Signup