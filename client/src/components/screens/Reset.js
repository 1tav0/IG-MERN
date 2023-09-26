import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import M from 'materialize-css'

const Reset = () => {
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    const PostData = async () => {
        try {
            const mailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            if(!mailformat.test(email))
            {
                M.toast({html: "Invalid Email Address", classes: "#d50000 red accent-4"})
                return;
            }
            const herokuBackendURL = "https://insta-mernbackend-2be90e891ef6.herokuapp.com";
            const request = await fetch(`${herokuBackendURL}/reset-password`, {
                method: "post",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    email
                })
            })
            const response = await request.json()
            console.log(response)
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
  return (
    <div className='my__card'>
        <div className="card auth__card input-field">
            <h2 className='card__title'>
                  Instagram
            </h2>
            <div className='input__text'>
                <input
                      type="text"
                      placeholder="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
                    onClick={() => PostData()}
                >
                    Reset Password
                  </button>
            </div>
        </div>
    </div>
  )
}

export default Reset