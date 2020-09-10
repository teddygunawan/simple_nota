import React from "react"
import brand from "../assets/brand.png"

function NotaHeader() {
  return (
    <div className="columns">
      <div className="column">
        <img alt="brand" className="image is-128x128" src={brand} />
      </div>
      {/* <div className="column has-text-right">
        <label className="checkbox">
          <input type="checkbox" />
          Rekening
        </label>
      </div> */}
    </div>
  )
}

export default NotaHeader
