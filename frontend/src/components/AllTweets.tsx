import { gql, useQuery } from "@apollo/client"
import React from "react"
import { formatDistance } from "date-fns"
import { subDays } from "date-fns/esm"
import "../styles/allTweets.css"
import { ME_QUERY } from "../pages/Profile"
import LikeTweet from "./LikeTweet"
import DeleteLike from "./DeleteLike"
import CreateComment from "./CreateComment"
import { Link } from "react-router-dom"

export const TWEETS_QUERY = gql`
  query TWEETS_QUERY {
    tweets {
      id
      createdAt
      content
      likes {
        id
      }
      comments {
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
    comments: []
    author: {
      id: any
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
          <Link to={`tweet/${tweet.id}`}>
            <div className="tweet-header">
              {tweet.author.Profile.avatar ? (
                <img
                  src={tweet.author.Profile.avatar}
                  style={{ width: "50px", borderRadius: "50%" }}
                  alt="avatar"
                />
              ) : (
                <i className="fa fa-user fa-2x" aria-hidden="true"></i>
              )}
              {/* <img
                src={tweet?.author?.Profile?.avatar}
                alt="avatar"
                style={{
                  width: "40px",
                  borderRadius: "50%",
                  objectFit: "contain",
                }} 
              />*/}
              <Link to={`/user/${tweet.author.id}`}>
                <h4 className="name">{tweet.author.name}</h4>
              </Link>
              <p className="date-time">
                {formatDistance(
                  subDays(new Date(tweet.createdAt), 0),
                  new Date()
                )}{" "}
                ago
              </p>
            </div>
            <p>{tweet.content}</p>
          </Link>
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

            <span style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <CreateComment
                avatar={tweet?.author?.Profile?.avatar}
                name={tweet.author.name}
                tweet={tweet.content}
                id={tweet.id}
              />
              {tweet.comments.length > 0 ? tweet.comments.length : null}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllTweets
