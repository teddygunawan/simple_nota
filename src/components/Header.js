import React from "react"
import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import brand from "../assets/brand.png"

function Header() {
  const isPrinting = useSelector((state) => state.isPrinting)
  return (
    <div>
      {!isPrinting && (
        <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <NavLink exact to="/" className="navbar-item">
              <img src={brand} alt="Brand" />
            </NavLink>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
              <NavLink exact to="/" className="navbar-item" activeClassName="is-active">
                Nota
              </NavLink>
              <NavLink exact to="/products" className="navbar-item" activeClassName="is-active">
                Products
              </NavLink>
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}

export default Header
