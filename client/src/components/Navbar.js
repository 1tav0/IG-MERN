import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'
import { Avatar } from '@mui/material'
const Navbar = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(UserContext)
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [userDetails, setUserDetails] = useState([])

  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])

  const renderList = () => {
    if (state) {
      // console.log(state)
      return [
        <ul id="nav-mobile" className="right hide-on-med-and-down" key="1">
          <li key="search"> <i data-target="modal1" className='large material-icons modal-trigger'> search </i> </li>
          <li key="profile"><Link to="/profile">Profile</Link></li>
          <li key="createpost"><Link to="/createpost">CreatePost</Link></li>
          <li key="followingposts"><Link to="/followingposts">Following</Link></li>
          <li>
            <button className='btn waves-effect waves-light #64b5f6 red darken-1'
                onClick={() => {
                  localStorage.clear()
                  dispatch({ type: "CLEAR" })
                  navigate('/signin')
                }}
            >
                SignOut
            </button>
          </li>
        </ul>
      ]
    } else {
      return [
        <ul id="nav-mobile" className="right hide-on-med-and-down" key="2">
            <li key="signin"><Link to="/signin">SignIn</Link></li>
            <li key="signup"><Link to="/signup">SignUp</Link></li>
        </ul>
      ]
    }
  }

  const fetchUsers = async (query) => {
      try {
        setSearch(query)
        const request = await fetch('/search-users', {
          method: 'Post',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query
          })
        })

        const result = await request.json()
        console.log(result)
        setUserDetails(result.users)
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <nav>
        <div className="nav-wrapper white">
            <Link to= {state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
            {renderList()}
        </div>
        <div id="modal1" className="modal" ref={searchModal} style={{ color: "black"}}>
              <div className="modal-content">
                  <div className='input__text'>
                        <input
                          type="text"
                          placeholder="search users"
                          value={search}
                          onChange={(e) => {
                            fetchUsers(e.target.value)
                          }}
                        />
                  </div>
                  <div>
                        <ul className="collection">
                            {
                              userDetails && Array.isArray(userDetails) && userDetails.map(item => {
                                return (
                                  <div
                                    onClick={() => {
                                      M.Modal.getInstance(searchModal.current).close()
                                      setSearch('')
                                      navigate(
                                        item._id !== state._id ? "/profile/" + item._id : "/profile"
                                      )
                                    }}
                                  >
                                      <li className="collection-item avatar"
                                          key={item._id}
                                          style={{
                                          display: 'flex',
                                          alignItems: 'center'
                                          }}>
                                          <Avatar src={item && item.pic}/>
                                          <span className="name" 
                                            style={{ 
                                              width: '650px', 
                                              marginLeft: '20px' 
                                              }}
                                          >
                                            { item.name }
                                          </span>
                                      </li>
                                  </div>
                                )
                              })
                            }
                        </ul>
                    </div>
                    <div className="modal-footer">
                      <button href="#!" className="modal-close waves-effect waves-green btn-flat"
                        onClick = {()=>{
                          setSearch('')
                        }}
                      >
                        close
                      </button>
                    </div>
                </div>
          </div>
    </nav>

  )
}

export default Navbar