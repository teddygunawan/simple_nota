import React from "react"
import { useSelector } from "react-redux"

function NotaProductRow(props) {
  const { product, onChange, onDeleteClick } = props
  const isPrinting = useSelector((state) => state.isPrinting)
  return (
    <tr key={product.id}>
      {isPrinting ? null : (
        <td>
          <button
            type="button"
            className="button is-danger"
            onClick={() => onDeleteClick(props.product.id)}>
            <i className="fas fa-trash" />
          </button>
        </td>
      )}
      <td>{product.name}</td>
      <td>{product.unit}</td>
      <td>{product.price}</td>
      <td>
        {isPrinting ? (
          product.quantity
        ) : (
          <input className="input" type="text" onChange={(e) => onChange(e, props.index)} />
        )}
      </td>
      <td>{product.total}</td>
    </tr>
  )
}

export default NotaProductRow
