import React from 'react';
function ProductInput(props) {
    return (
        <tr>
            <td>
                <input className="input" type="text" placeholder="Nama Produk" value={props.product.name} onChange={e => props.handleInput(e, props.index, 'name')} />
            </td>
            <td>
                <input className="input is-half" type="text" placeholder="Unit" value={props.product.unit} onChange={e => props.handleInput(e, props.index, 'unit')} />
            </td>
            <td>
                <input className="input" type="text" placeholder="Harga per Kg" value={props.product.price} onChange={e => props.handleInput(e, props.index, 'price')} />
            </td>
            <td className="has-text-centered column-minimum">
                <button type="button" className="button is-danger" onClick={e => props.deleteProduct(props.index)}>
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    );
}

export default ProductInput;
