import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const navigate = useNavigate()

    //when url has been set successfully then we can create post successfully
    useEffect(() => {
        if(url){ //mounts everytime we refresh without this
            async function fetchData() {
                try {
                    const request = await fetch("/createpost", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                        },
                        body: JSON.stringify({
                            title,
                            body,
                            pic: url
                        })
                    })
                    const response = await request.json()
                    console.log(response)
                    if (response.error) {
                        M.toast({html: response.error, classes: "#d50000 red accent-4"})
                    } else {
                        M.toast({ html: "Created Post Successfully", classes: "#00c853 green accent-4" })
                        navigate('/')
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchData()
        }
    }, [url])
    
    
    
    const postDetails = async () => {
        
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
  return (
      <div className='card input-filed'
          style={{
              margin: "30px auto",
              maxWidth: "500px",
              padding: "20px",
              textAlign: "center"
              
        }}
      >
          <input
                type='text'
                placeholder='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
          />
          <input
              type='text'
              placeholder='body'
              value={body}
              onChange={(e) => setBody(e.target.value)}
          />
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
          <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
            onClick={() => postDetails()}
          >
              SubmitPost
          </button>
    </div>

  )
}

export default CreatePost