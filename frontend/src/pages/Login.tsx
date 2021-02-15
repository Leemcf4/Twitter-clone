import React from "react"
import { gql, useMutation } from "@apollo/client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { Link, useHistory } from "react-router-dom"
import TwitterLogo from "../styles/assets/Twitter-Logo.png"
import "../styles/login.css"

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

interface LoginValues {
  email: string
  password: string
}

function Login() {
  const history = useHistory()

  const [login, { data }] = useMutation(LOGIN_MUTATION)

  const initialValues: LoginValues = {
    email: "",
    password: "",
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email required"),
    password: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Password required"),
  })

  return (
    <div className="container">
      <img
        src={TwitterLogo}
        alt="logo"
        style={{ width: "50px" }}
        className="logo"
      />
      <h3>Login to Spitter</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true)
          const res = await login({
            variables: values,
          })
          localStorage.setItem("token", res.data.login.token)
          setSubmitting(false)
          history.push("/users")
        }}
      >
        <Form>
          <Field name="email" type="text" placeholder="Email" />
          <ErrorMessage name="email" component={"div"} />

          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" component={"div"} />

          <button type="submit" className="login-button">
            <span>Login</span>
          </button>
        </Form>
      </Formik>
      <div className="register">
        <h4>Don't have an account?</h4>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  )
}

export default Login