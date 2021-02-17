import { gql, useMutation, useQuery } from "@apollo/client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import React, { useState } from "react"
import Modal from "react-modal"
import { ME_QUERY } from "../pages/Profile"
import { customStyles } from "../styles/CustomModalStyles"
import * as Yup from "yup"

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($content: String!, $id: Int!) {
    createComment(content: $content, id: $id) {
      id
    }
  }
`

interface CommentProps {
  content: string
}
interface Props {
  tweet: string
  name: string
  avatar: string
  id: number
}

function CreateComment({ avatar, tweet, name, id }: Props) {
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const [modalOpen, setModalOpen] = useState(false)

  const { loading, error, data } = useQuery(ME_QUERY)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const initialValues: CommentProps = {
    content: "",
  }

  const validationSchema = Yup.object({
    content: Yup.string()
      .required()
      .min(1, "Must be more than 1 character")
      .max(256, "Max 256 characters"),
  })

  const openModal = () => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <div>
      <span onClick={openModal}>
        <i className="far fa-comment" aria-hidden="true"></i>
      </span>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
        appElement={document.getElementById("app") as HTMLElement}
      >
        <span className="exit" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>
        <div className="header" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 8fr",
            marginTop: "10px",
          }}
        >
          {avatar ? (
            <img
              src={avatar}
              style={{ width: "40px", borderRadius: "50%" }}
              alt="avatar"
            />
          ) : (
            <i className="fa fa-user fa-2x" aria-hidden="true"></i>
          )}

          <h5>{name}</h5>
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
          {tweet}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            await createComment({
              variables: { ...values, id },
            })

            setSubmitting(false)
            setModalOpen(false)
          }}
        >
          <Form>
            {data.me.Profile.avatar ? (
              <img
                src={data.me.Profile.avatar}
                style={{ width: "40px", borderRadius: "50%" }}
                alt="avatar"
              />
            ) : (
              <i className="fa fa-user fa-2x" aria-hidden="true"></i>
            )}
            <Field
              name="content"
              type="text"
              as="textarea"
              placeholder="Spit back..."
            />
            <ErrorMessage name="content" component={"div"} />

            <div className="footer"></div>
            <button type="submit" className="tweet-button">
              <span>Tweet</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default CreateComment
