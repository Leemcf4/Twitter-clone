import { gql, useMutation } from "@apollo/client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import React, { useState } from "react"
import { ME_QUERY } from "../pages/Profile"
import * as Yup from "yup"
import "../styles/primary.css"
import { TWEETS_QUERY } from "./AllTweets"

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

function HomePageTweet() {
  const [createTweet] = useMutation(CREATE_TWEET_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }],
  })

  const initialValues: TweetValues = {
    content: "",
  }

  const validationSchema = Yup.object({
    content: Yup.string()
      .required()
      .min(1, "Must be more than 1 character")
      .max(256, "Max 256 characters"),
  })

  return (
    <div className="home-page-tweet">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true)
          await createTweet({
            variables: values,
          })

          setSubmitting(false)
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

          <button type="submit" className="home-tweet-button">
            <span>Tweet</span>
          </button>
        </Form>
      </Formik>

      <div className="footer"></div>
    </div>
  )
}

export default HomePageTweet
