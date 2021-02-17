import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { logoutModalStyles } from "../styles/LogoutModal"
import Modal from "react-modal"
import { useQuery } from "@apollo/client"
import { ME_QUERY } from "../pages/Profile"
import "../styles/logout.css"

function Logout() {
  const history = useHistory()

  const [modalOpen, setModalOpen] = useState(false)

  const { loading, error, data } = useQuery(ME_QUERY)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  const openModal = () => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
  }
  const handleLogout = async () => {
    localStorage.removeItem("token")
    history.push("/landing")
  }

  return (
    <div className="logout">
      <span onClick={openModal} style={{ flex: 1, flexDirection: "row" }}>
        <h4>
          {data.me.Profile?.avatar ? (
            <img
              src={data.me.Profile.avatar}
              style={{ width: "40px", borderRadius: "50%" }}
              alt="avatar"
            />
          ) : (
            <i className="fa fa-user fa-2x" aria-hidden="true"></i>
          )}

          <span style={{ marginLeft: "10px", marginTop: "-10px" }}>
            {data.me.name}
          </span>
          <span style={{ marginLeft: "30px" }}>
            <i className="fas fa-ellipsis-h"></i>
          </span>
        </h4>
      </span>
      <div style={{ position: "absolute", bottom: 0 }}>
        <Modal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          contentLabel="Modal"
          style={logoutModalStyles}
        >
          <span onClick={handleLogout} style={{ cursor: "pointer" }}>
            <p style={{ borderBottom: "1px solid black" }}>
              Log out @{data.me.name}
            </p>
          </span>
        </Modal>
      </div>
    </div>
  )
}

export default Logout
