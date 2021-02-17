import {
  ApolloCache,
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"
import React from "react"
import "./App.css"
import Users from "./components/Users"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import Landing from "./components/Landing"
import { setContext } from "apollo-link-context"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import IsAuth from "./components/IsAuth"
import Profile from "./pages/Profile"
import Home from "./pages/Home"
import SingleTweet from "./pages/SingleTweet"
import SingleUser from "./pages/SingleUser"

const httpLink = new HttpLink({ uri: "http://localhost:4000" })
const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem("token")

  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const link = authLink.concat(httpLink as any)
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <Router>
          <Switch>
            <Route exact path="/landing">
              <Landing />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <IsAuth>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/tweet/:id">
                <SingleTweet />
              </Route>
              <Route path="/user/:id">
                <SingleUser />
              </Route>
            </IsAuth>
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  )
}

export default App
