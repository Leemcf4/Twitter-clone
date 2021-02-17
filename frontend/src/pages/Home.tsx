import { gql, useQuery } from "@apollo/client"
import React from "react"
import { useHistory } from "react-router-dom"
import "../styles/home.css"
import "../styles/primary.css"
import LeftNav from "../components/LeftNav"
import AllTweets from "../components/AllTweets"
import HomePageTweet from "../components/HomePageTweet"
import TrendingTweets from "../components/TrendingTweets"

export const ME_QUERY = gql`
  query me {
    me {
      id
      name
      Profile {
        id
        bio
        location
        website
        avatar
      }
    }
  }
`

function Home() {
  const history = useHistory()
  const { loading, error, data } = useQuery(ME_QUERY)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  console.log(data)
  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav />
        </div>
        <div className="home">
          <div className="home-header">
            <h3 className="home-title">Home</h3>
          </div>
          <HomePageTweet />

          <AllTweets />
        </div>
        <div className="right">
          {" "}
          <TrendingTweets />{" "}
        </div>
      </div>
    </>
  )
}

export default Home
