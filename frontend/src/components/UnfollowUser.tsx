import { gql, useMutation } from "@apollo/client"
import React from "react"
import { ME_QUERY } from "../pages/Profile"

const DELETE_FOLLOW_QUERY = gql`
  mutation deleteFollow($id: Int!) {
    deleteFollow(id: $id) {
      id
    }
  }
`

interface Props {
  id: string
}

function UnfollowUser({ id }: Props) {
  const [deleteFollow] = useMutation(DELETE_FOLLOW_QUERY, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const handleUnfollow = async () => {
    await deleteFollow({
      variables: { id: parseInt(id) },
    })
  }
  return (
    <div>
      <button onClick={handleUnfollow} className="edit-button">
        Unfollow
      </button>
    </div>
  )
}

export default UnfollowUser
