import React, {useEffect, createContext, useReducer, useContext} from "react";
import Navbar from './components/Navbar'
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import SignIn from "./components/screens/SignIn";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribedUserPosts'
import Reset from './components/screens/Reset'
import "./App.css"
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { reducer, initialState } from './reducers/userReducer'


export const UserContext = createContext()

const Routing = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({type:"USER", payload:user})
    } else {
      //for reset
      // if(!navigate.location.pathname.startsWith('/reset-password'))
        navigate('/signin')
    }
  }, [])
  return (
    <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/profile" element={<Profile/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/profile/:userid" element={<UserProfile />} />
        <Route path="/followingposts" element={<SubscribedUserPosts />} />
        <Route path="/reset-password" element={<Reset />} />
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
          <Navbar />
          <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
