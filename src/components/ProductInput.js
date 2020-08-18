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
            <td>
                <input className="button is-danger" type="button" value="Delete" onClick={e => props.deleteProduct(props.index)} />
            </td>
        </tr>
    );
}

export default ProductInput;
