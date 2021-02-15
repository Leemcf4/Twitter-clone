import { gql, useMutation } from "@apollo/client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import React, { useState } from "react"
import { ME_QUERY } from "../pages/Profile"
import Modal from "react-modal"
import { customStyles } from "../styles/CustomModalStyles"

const CREATE_PROFILE_MUTATION = gql`
  mutation createProfile(
    $bio: String
    $location: String
    $website: String
    $avatar: String
  ) {
    createProfile(
      bio: $bio
      location: $location
      website: $website
      avatar: $avatar
    ) {
      id
    }
  }
`

interface ProfileValues {
  bio: String
  location: String
  website: String
  avatar: String
}

function CreateProfile() {
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const [modalOpen, setModalOpen] = useState(false)
  const initialValues: ProfileValues = {
    bio: "",
    location: "",
    website: "",
    avatar: "",
  }

  const openModal = () => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <div>
      <button onClick={openModal}>Create Profile</button>

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            await createProfile({
              variables: values,
            })

            setSubmitting(false)
            setModalOpen(false)
          }}
        >
          <Form>
            <Field name="bio" type="text" as="textarea" placeholder="Bio" />
            <ErrorMessage name="bio" component={"div"} />

            <Field name="location" type="text" placeholder="Location" />
            <ErrorMessage name="location" component={"div"} />
            <Field name="website" type="text" placeholder="Website" />
            <ErrorMessage name="website" component={"div"} />

            <button type="submit" className="login-button">
              <span>Create Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default CreateProfile
