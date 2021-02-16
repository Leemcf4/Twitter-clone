import { gql, useQuery } from "@apollo/client"
import React from "react"
import { formatDistance } from "date-fns"
import { subDays } from "date-fns/esm"
import "../styles/allTweets.css"
import { ME_QUERY } from "../pages/Profile"
import LikeTweet from "./LikeTweet"
import DeleteLike from "./DeleteLike"

export const TWEETS_QUERY = gql`
  query TWEETS_QUERY {
    tweets {
      id
      createdAt
      content
      likes {
        id
      }
      author {
        id
        name
        Profile {
          id
          avatar
        }
      }
    }
  }
`

function AllTweets() {
  const { loading, error, data } = useQuery(TWEETS_QUERY)
  const { loading: meLoading, error: meError, data: meData } = useQuery(
    ME_QUERY
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>
  if (meLoading) return <p>Loading...</p>
  if (meError) return <p>{meError.message}</p>

  interface AllTweets {
    id: any
    content: string
    createdAt: Date
    likes: []
    author: {
      name: string
      Profile: {
        avatar: string
      }
    }
  }

  interface LikedTweets {
    id: number
    tweet: {
      id: number
    }
  }
  console.log(data)

  return (
    <div>
      {data.tweets.map((tweet: AllTweets) => (
        <div key={tweet.id} className="tweet-container">
          <div className="tweet-header">
            <img
              src={tweet.author.Profile.avatar}
              alt="avatar"
              style={{
                width: "40px",
                borderRadius: "50%",
                objectFit: "contain",
              }}
            />
            <h4 className="name">{tweet.author.name}</h4>
            <p className="date-time">
              {formatDistance(
                subDays(new Date(tweet.createdAt), 0),
                new Date()
              )}{" "}
              ago
            </p>
          </div>
          <p>{tweet.content}</p>
          <div className="likes">
            {meData.me.likedTweet
              .map((t: LikedTweets) => t.tweet.id)
              .includes(tweet.id) ? (
              <span>
                <DeleteLike
                  id={
                    meData.me.likedTweet.filter(
                      (like: LikedTweets) => like.tweet.id === tweet.id
                    )[0].id
                  }
                />
                {tweet.likes.length}
              </span>
            ) : (
              <span>
                <LikeTweet id={tweet.id} />
                {tweet.likes.length}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllTweets
