import React from 'react';
function ProductCartInput(props) {
  return (
    <tr key={props.product.id}>
      {props.isPrinting ? null :
        <td>
          <button type="button" className="button is-danger" onClick={e => props.deleteProduct(props.product.id)}>
            <i class="fas fa-trash"></i>
          </button>
        </td>
      }
      <td>{props.product.name}</td>
      <td>{props.product.unit}</td>
      <td>{props.product.price}</td>
      <td>
        {props.isPrinting ? props.product.quantity : <input className="input" type="text" onChange={e => props.handleInput(e, props.index)} />}
      </td>
      <td>{props.product.total}</td>
    </tr>
  );
}

export default ProductCartInput;
