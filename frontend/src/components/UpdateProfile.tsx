import { gql, useMutation, useQuery } from "@apollo/client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import React, { useRef, useState } from "react"
import { ME_QUERY } from "../pages/Profile"
import Modal from "react-modal"
import { customStyles } from "../styles/CustomModalStyles"

const UPDATE_PROFILE_MUTATION = gql`
  mutation updateProfile(
    $id: Int!
    $bio: String
    $location: String
    $website: String
    $avatar: String
  ) {
    updateProfile(
      id: $id
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
  id: Number
  bio: String
  location: String
  website: String
  avatar: String
}

function UpdateProfile() {
  const inputFile = useRef<HTMLInputElement | null>(null)
  const [image, setImage] = useState("")
  const [imageLoading, setImageLoading] = useState(false)

  const { loading, error, data } = useQuery(ME_QUERY)
  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  })

  const [modalOpen, setModalOpen] = useState(false)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const initialValues: ProfileValues = {
    id: data.me.Profile.id,
    bio: data.me.Profile.bio,
    location: data.me.Profile.location,
    website: data.me.Profile.website,
    avatar: data.me.Profile.avatar,
  }

  const openModal = () => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    const data = new FormData()
    data.append("file", files![0])
    data.append("upload_preset", "spitter")
    setImageLoading(true)
    const res = await fetch(process.env.REACT_APP_CLOUDINARY_ENDPOINT!, {
      method: "POST",
      body: data,
    })

    const file = await res.json()
    setImage(file.secure_url)
    setImageLoading(false)
  }

  return (
    <div>
      <button onClick={openModal} className="edit-button">
        Edit Profile
      </button>

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
        appElement={document.getElementById("app") as HTMLElement}
      >
        <input
          type="file"
          name="file"
          placeholder="upload profile image"
          onChange={uploadImage}
          ref={inputFile}
          style={{ display: "none" }}
        />

        {imageLoading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            {image ? (
              <span>
                <img
                  src={!image ? data.me.Profile.avatar : image}
                  style={{ width: "150px", borderRadius: "50%" }}
                  alt="avatar"
                  onClick={() => inputFile.current?.click()}
                />
              </span>
            ) : (
              <span>
                <i
                  className="fa fa-user fa-5x"
                  aria-hidden="true"
                  onClick={() => inputFile.current?.click()}
                ></i>
              </span>
            )}
          </>
        )}
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            await updateProfile({
              variables: { ...values, avatar: image },
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
              <span>Update Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default UpdateProfile
