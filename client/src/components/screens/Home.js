import React, {useState, useEffect, useContext, useRef} from 'react'
import './Home.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Avatar } from '@mui/material';
import { UserContext } from '../../App'
import { Link } from 'react-router-dom';
const Home = () => {
  const inputRef = useRef([])
  const [data, setData] = useState([])//array because is many posts when we have a user and they go to their home screen
  const { state, dispatch } = useContext(UserContext) //state has the state whether or not the user is signed in or not
  // const [clicks, setClicks] = useState(0)

  useEffect(() => {
    async function fetchData(){
      try {
        const request = await fetch("/allposts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        })
        const result = await request.json()
        setData(result.posts)
        // console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [state])

  const likePost = async (id) => {
    try {
      // console.log(id)
      const request = await fetch('/like', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          postId: id
        })
      })
      const result = await request.json()
       //to update the likes quantity when we give a like
      const newData = data.map(item => {
        if (item._id === result._id) {//return updated record with user data included
          return { ...result, postedBy: result.postedBy, likes: result.likes, comments: item.comments }
        } else {//return old record count with user data included
          return { ...item, postedBy: item.postedBy, likes: item.likes, comments: item.comments }
        }
      })
      setData(newData)
    } catch (error) {
      console.log(error)
    }
  }

  const unlikePost = async (id) => {
    try {
      const request = await fetch('/unlike', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          postId: id
        })
      })
      const result = await request.json()
       //to update the likes when we give a unlike
      const newData = data.map(item => {
        if (item._id === result._id) {//this helps to keep the name of user when we use thise in onclick 
          return { ...result, postedBy: result.postedBy, likes: result.likes, comments: item.comments }
        } else { //return updated record with user data included
          return { ...item, postedBy: item.postedBy, likes: item.likes, comments: item.comments }
        }//return old record count with user data included
      })
      setData(newData)
    } catch (error) {
      console.log({ error })
    }
  }

  const commentPost = async (text, postId, index) => {
    try {
      const request = await fetch('/comment', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          postId,
          text
        })
      })

      const result = await request.json()

        // Update the comment's "postedBy" object with the "pic" property
      const updatedComments = result.comments.map(comment => {
        const user = comment.postedBy
        if (!user.pic) {
          user.pic = "/broken-image.jpg" // Set default image if user does not have a profile picture
        }
        return { ...comment, postedBy: user }
      })

      const newData = data.map((item, i)=> {
        if (i === index && item._id === result._id) {
          return { ...result, postedBy: result.postedBy, likes: result.likes, updatedComments } //return updated record with user data included
        } else if (item._id === postId) {
          return { ...item, postedBy: item.postedBy, likes: item.likes, comments: result.comments }//return old record count with user data included
        }else {
          return item;
        }
      })
      setData(newData)
      
      if (inputRef.current[index]) {
        inputRef.current[index].form.reset()
      }
      // inputRef.current[index] = ""
    } catch (error) {
      console.log({ error })
    }
  }

  const deletePost = async (postid) => {
    try {
      console.log(postid)
      const request = await fetch(`/deletepost/${postid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      })
      const result = await request.json()
      if (result.error) {
        console.log(result.error);
        // display error message to the user
        return;
      }
      /*In summary, this code snippet creates a new array that excludes the item with a matching _id 
      value as the result._id variable.
      *filtering out the deleted record by filtering out the post with a matching _id value as the 
      result._id variable.
      *If the _id properties match, the callback function returns false, which excludes the post from 
      the filtered newData array.
      *If the _id properties do not match, the callback function returns true, which includes the post 
      in the filtered newData array.*/
      const newData = data.filter(item => {
        return item._id !== result._id
      })
      setData(newData)
    } catch (error) {
      console.log( error )
    }
  }

   /*************The main difference between the two code snippets is the result of the operation.

The first code snippet, which uses the filter() method, returns a new array that includes all the 
elements of the original data array except for the one that has an _id value that matches the _id 
value of the result object. In other words, it removes the deleted record from the original array.

The second code snippet, which uses the map() method, returns a new array that includes all the 
elements of the original data array, but with the element that has an _id value that matches the _id 
value of the result object replaced with the result object itself. In other words, it updates the 
existing comment with the new data.

So the first code snippet is used when you want to delete an element from an array, whereas the 
second code snippet is used when you want to update an element in an array with new data.*************/

  const deleteComment = async (commentId) => {
    try {
      const request = await fetch(`/deletecomment/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      })
      const result = await request.json()
      if (result.error) {
        console.log(result.errror)
        return;
      }
      // const newData = data.map(item => {
      //   if (item._id === result._id) {
      //     return { ...result, postedBy: result.postedBy, likes: result.likes, comments: result.comments }
      //   }else {
      //     return { ...item, postedBy: item.postedBy, likes: item.likes, comments: result.comments }
      //   }
      // })
      const newData = data.map(comment => {
        if (comment._id === result._id) { //checks if the _id of the item matches the _id of the deleted comment (result._id)
          return { ...result, postedBy: result.postedBy, likes: result.likes }  //If they match, it means that the deleted comment belongs to this item, so the code replaces the entire item with ...result (the updated post) and adds the postedBy and likes properties to it. 
        } else {
          return { ...comment, comments: comment.comments.map(comment => { //If the _id of the item does not match the _id of the deleted comment, it means that the deleted comment does not belong to this item, so the code keeps the original item but replaces its comments property with a new array of comments that are filtered to remove the deleted comment.
            if (comment._id === commentId) {
              return null; // we still create a new object, but we don't need to update postedBy and likes properties. Instead, we need to filter out the deleted comment from the comments array of that post. To do that, we use comments.map() method to iterate over each comment and check if its _id matches with the commentId (which is the ID of the deleted comment). If it matches, we return null, which means we want to remove this comment from the comments array. Otherwise, we return the original comment.
            } else {
              return comment; // keep the original comment & return old list 
            }
          }).filter(comment => comment !== null) } //Now, we have an array of objects with some of the objects containing null value. So, we use the filter() method to remove those null values and return an array of objects with updated comments array for the posts other than the one where the comment was deleted.
        }
      })

      setData(newData)

    } catch (error) {
      console.log(error)
    }
  }

  // const likeImage = () => {
  //     setClicks(clicks + 1)
  // }

  return (
    <div className='home__card__wrapper'>
      {
        data && data.map((item, index) => {
          return (
            <div className='card home__card' key={item._id}>
              <h5
                style={{
                  margin: "10px auto"
                }}
              >
                {
                  <Link to={ item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : "/profile" }>{item.postedBy.name}</Link>
                }
                {
                  item.postedBy._id === state._id
                  &&
                  <IconButton
                  onClick={() => {
                    deletePost(item._id)
                  }}
                  style={{
                    color: 'red',
                    float: "right"
                  }}
                  >
                    <DeleteIcon/>
                  </IconButton>
                }
              </h5>
              <div className='home__card__image'>
                <img src={item.pic} alt='' />
              </div>
              <div className='home__card__content'>
                {
                  item.likes.includes(state._id)
                  ?
                  
                    <span className='like__post'>
                      <FavoriteIcon
                        style={{ color: 'red' }}
                        onClick={() => { unlikePost(item._id) }}
                      />
                    </span>
                  
                  :
                  
                    <span className='like__post'>
                      <FavoriteBorderIcon
                        onClick={() => { likePost(item._id) }}
                      />
                    </span>
                 
                }
                <h6>{item.likes.length} likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {/* When we make a comment */}
                {
                  item.comments.map((record, index) => {
                    return (
                      <div className='parent' key={record._id}>
                        <h6
                          key={record._id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                              <span
                                style={{
                                  fontWeight: "500",
                                  marginRight: "10px",
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                
                                <Avatar className='avatar' 
                                    style={{
                                      width: '25px',
                                      height: '25px',
                                      marginRight:'8px'
                                    }}
                                    src={ item.comments[index].postedBy.pic }
                                />
                                
                                {
                                  record.postedBy.name
                                }
                              </span>
                              <span>
                                {
                                  record.text
                                }
                              </span>
                          </span>
                          <span>
                          {
                              record.postedBy._id === state._id
                              &&
                              <span className="delete__icon">
                                <DeleteIcon
                                  onClick={() => deleteComment(record._id)}
                                  style={{
                                    color: 'red',
                                    float: "right",
                                    cursor: 'pointer'
                                  }}
                                />
                              </span>
                          }
                          </span>
  
                        </h6>
                      </div>
                    )
                  })
                }

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    commentPost(e.target[0].value, item._id, index)
                    e.target.reset()
                  }}
                >
                  <input type="text" placeholder="add a comment" ref={() => (inputRef.current[index])} />
                </form>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Home