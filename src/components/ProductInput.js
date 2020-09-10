import React from "react"

function ProductInput(props) {
  const { product } = props
  return (
    <tr>
      <td>
        <input
          className="input"
          type="text"
          placeholder="Nama Produk"
          value={product.name}
          onChange={(e) => props.onChange(e, props.index, "name")}
        />
      </td>
      <td>
        <input
          className="input is-half"
          type="text"
          placeholder="Unit"
          value={product.unit}
          onChange={(e) => props.onChange(e, props.index, "unit")}
        />
      </td>
      <td>
        <input
          className="input"
          type="text"
          placeholder="Harga per Kg"
          value={product.price}
          onChange={(e) => props.onChange(e, props.index, "price")}
        />
      </td>
      <td className="has-text-centered column-minimum">
        <button
          type="button"
          className="button is-danger"
          onClick={() => props.deleteProduct(props.index)}>
          <i className="fas fa-trash" />
        </button>
      </td>
    </tr>
  )
}

export default ProductInput
