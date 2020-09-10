import React from "react"
import { useSelector } from "react-redux"

function CustomerInput(props) {
  const isPrinting = useSelector((state) => state.isPrinting)
  const { customer, onChange } = props
  return (
    <div className={`column ${!isPrinting && "is-one-quarter"}`}>
      <div>
        Tanggal:
        {new Date().toISOString().slice(0, 10)}
      </div>
      <div>
        Nama:
        {isPrinting ? (
          customer.name
        ) : (
          <input type="text" className="input" name="name" value={customer.name} onChange={onChange} />
        )}
      </div>
      <div>
        Alamat:
        {isPrinting ? (
          customer.address
        ) : (
          <input type="text" className="input" name="address" value={customer.address} onChange={onChange} />
        )}
      </div>
      <div>
        No HP:
        {isPrinting ? (
          customer.phone
        ) : (
          <input type="text" className="input" name="phone" value={customer.phone} onChange={onChange} />
        )}
      </div>
    </div>
  )
}

export default CustomerInput
