/* eslint-disable semi */
import React from "react"
import { useSelector } from "react-redux"
import NotaProductRow from "./NotaProductRow"

function NotaProductTable(props) {
  const { productCart, grandTotal, handleProductInput, deleteProduct } = props
  const isPrinting = useSelector((state) => state.isPrinting)
  return (
    <table className="table is-fullwidth is-bordered is-narrow mb-5">
      <thead>
        <tr>
          {!isPrinting && <th className="column-minimum">Option</th>}
          <th className="column-big">Item</th>
          <th className="column-small">Unit</th>
          <th className="column-small">Harga</th>
          <th className="column-small">Jumlah</th>
          <th className="column-medium">Total</th>
        </tr>
      </thead>
      <tbody>
        {productCart.map((product, index) => (
          <NotaProductRow
            key={product._id}
            product={product}
            index={index}
            isPrinting={isPrinting}
            onChange={handleProductInput}
            onDeleteClick={deleteProduct}
          />
        ))}
      </tbody>
      <tfoot>
        {productCart.length > 0 && (
          <tr>
            <td className="has-text-right has-background-gray" colSpan="5">
              Grand Total
            </td>
            <td>{grandTotal}</td>
          </tr>
        )}
      </tfoot>
    </table>
  )
}

export default NotaProductTable
