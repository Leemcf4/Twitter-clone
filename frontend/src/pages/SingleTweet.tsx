import { gql, useQuery } from "@apollo/client"
import React, { Fragment } from "react"
import { useHistory, useParams } from "react-router-dom"
import "../styles/home.css"
import "../styles/primary.css"
import LeftNav from "../components/LeftNav"
import TrendingTweets from "../components/TrendingTweets"
import CreateReply from "../components/CreateReply"

export const TWEET_QUERY = gql`
  query tweet($id: Int) {
    tweet(id: $id) {
      id
      content
      author {
        id
        name
        Profile {
          id
          avatar
        }
      }
      comments {
        id
        content
        createdAt
        User {
          id
          name
          Profile {
            id
            avatar
          }
        }
      }
    }
  }
`

interface ParamType {
  id: string
}

interface CommentType {
  id: number
  content: string
  createdAt: Date
  User: {
    id: number
    name: string
    Profile: {
      id: number
      avatar: string
    }
  }
}

function SingleTweet() {
  const history = useHistory()
  const { id } = useParams<ParamType>()
  const { loading, error, data } = useQuery(TWEET_QUERY, {
    variables: { id: parseInt(id) },
  })

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
            <span className="back-arrow" onClick={() => history.goBack()}>
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </span>
            <h3 className="home-title">Tweet</h3>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 8fr",
              marginTop: "10px",
              marginLeft: "10px",
            }}
          >
            {data.tweet.author.Profile.avatar ? (
              <img
                src={data.tweet.author.Profile.avatar}
                style={{ width: "40px", borderRadius: "50%" }}
                alt="avatar"
              />
            ) : (
              <i className="fa fa-user fa-2x" aria-hidden="true"></i>
            )}

            <h5>{data.tweet.author.name}</h5>
          </div>
          <p
            style={{
              marginLeft: "20px",
              borderLeft: "1px solid var(--accent)",
              paddingLeft: "20px",
              height: "50px",
              marginTop: 0,
            }}
          >
            {data.tweet.content}
          </p>
          {data.tweet.comments.map((comment: CommentType) => (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 8fr",
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
              >
                {comment.User.Profile.avatar ? (
                  <img
                    src={data.me.Profile.avatar}
                    style={{ width: "40px", borderRadius: "50%" }}
                    alt="avatar"
                  />
                ) : (
                  <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                )}

                <h5>{comment.User.name}</h5>
              </div>
              <p>{comment.content}</p>
              {
                <CreateReply
                  name={comment.User.name}
                  avatar={comment?.User?.Profile?.avatar}
                  id={data.tweet.id}
                  comment={comment.content}
                  commentId={comment.id}
                />
              }
            </>
          ))}
        </div>
        <div className="right">
          <TrendingTweets />
        </div>
      </div>
    </>
  )
}

export default SingleTweet