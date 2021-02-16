import { gql, useMutation, useQuery } from "@apollo/client"
import React from "react"
import { ME_QUERY } from "../pages/Profile"
import { TWEETS_QUERY } from "./AllTweets"

const LIKE_TWEET_MUTATION = gql`
  mutation likeTweet($id: Int) {
    likeTweet(id: $id) {
      id
    }
  }
`

interface Props {
  id: number
}

function LikeTweet({ id }: Props) {
  const [likeTweet] = useMutation(LIKE_TWEET_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }, { query: ME_QUERY }],
  })

  const handleCreateLike = async () => {
    await likeTweet({
      variables: { id },
    })
  }

  return (
    <span
      onClick={handleCreateLike}
      style={{ marginRight: "5px", cursor: "pointer" }}
    >
      <i className="far fa-thumbs-up" aria-hidden="true" />
    </span>
  )
}

export default LikeTweet
