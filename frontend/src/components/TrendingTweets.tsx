import { gql, useQuery } from "@apollo/client"
import { format } from "date-fns"
import React from "react"
import "../styles/trendingTweets.css"

export const TRENDING_TWEETS = gql`
  query TRENDING_TWEETS {
    tweets {
      id
      createdAt
      content
      author {
        id
        Profile {
          id
          avatar
        }
      }
      likes {
        id
      }
    }
  }
`

interface Tweet {
  id: number
  createdAt: Date
  content: string
  author: {
    Profile: {
      avatar: string
    }
  }
  likes: {
    id: number
    length: number
  }
}

function TrendingTweets() {
  const { loading, error, data } = useQuery(TRENDING_TWEETS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const getTrendingTweets = data.tweets
    .map((tweet: Tweet) => tweet)
    .sort(function (a: Tweet, b: Tweet) {
      return b.likes.length - a.likes.length
    })
    .slice(0, 5) //get only top 5

  return (
    <div className="trending-tweets">
      <h3 className="trending">Trending</h3>
      {getTrendingTweets.map((tweet: Tweet) => (
        <div className="popular-tweet-container" key={tweet.id}>
          <div className="date-title">
            <div className="title-logo">
              {tweet.author.Profile.avatar ? (
                <img
                  src={tweet.author.Profile.avatar}
                  style={{ width: "40px", borderRadius: "50%" }}
                  alt="avatar"
                />
              ) : (
                <i className="fa fa-user fa-2x" aria-hidden="true"></i>
              )}

              <p className="tweet-content">{tweet.content}</p>
            </div>
            <p className="date">
              {format(new Date(tweet.createdAt), "MM/dd/yy")}
            </p>
          </div>
          <div className="tweet-likes">
            {tweet.likes.length > 0 ? (
              <span>Likes {tweet.likes.length}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TrendingTweets
