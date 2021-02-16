import { gql, useMutation } from "@apollo/client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import React, { useState } from "react"
import Modal from "react-modal"
import { ME_QUERY } from "../pages/Profile"
import { customStyles } from "../styles/CustomModalStyles"
import * as Yup from "yup"

const CREATE_TWEET_MUTATION = gql`
  mutation createTweet($content: String) {
    createTweet(content: $content) {
      id
    }
  }
`

interface TweetValues {
  content: string
}

function Tweet() {
  const [createTweet] = useMutation(CREATE_TWEET_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const [modalOpen, setModalOpen] = useState(false)

  const initialValues: TweetValues = {
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
      <button
        style={{ marginRight: "10px", marginTop: "30px" }}
        onClick={openModal}
      >
        <span style={{ padding: "15px 70px 15px 70px" }}>Tweet</span>
      </button>

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
        <div className="header"></div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            await createTweet({
              variables: values,
            })

            setSubmitting(false)
            setModalOpen(false)
          }}
        >
          <Form>
            <Field
              name="content"
              type="text"
              as="textarea"
              placeholder="Spit a few lines..."
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

export default Tweet
