import React, { useState, useEffect, useRef } from 'react';
import ProductInput from '../components/ProductInput';
const ipcRenderer = window.require('electron').ipcRenderer;
function Product(props) {
  let [products, setProducts] = useState([])
  let identities = useRef({})
  useEffect(() => {
    ipcRenderer.invoke('get-products').then(data => {
      setProducts(data.products)
      identities.current = data.identities
    });
  }, []);

  let addProduct = () => {
    identities.current["product_id"] += 1
    setProducts([
      ...products,
      {
        "id": identities.current["product_id"].toString(),
        "name": "",
        "price": 0,
        "unit": "Pcs"
      }
    ]);
  }

  let handleInput = (e, index, key) => {
    e.preventDefault()
    let newArr = [...products]
    newArr[index][key] = e.target.value
    setProducts(newArr)
  }

  let saveProducts = () => {
    let data = {
      products,
      "identities": identities.current
    }
    ipcRenderer.invoke('save-products', data).then(status => {

    });
  }

  let deleteProduct = (index) => {
    let tempArr = [...products]
    tempArr.splice(index, 1)
    setProducts(tempArr)
  }
  let productsDisplay = products.map((product, index) => (
    <ProductInput key={product.id} handleInput={handleInput} product={product} index={index} deleteProduct={deleteProduct} /> 
    // <tr key={product.id}>
    //   <td>
    //     <input className="input" type="text" placeholder="Nama Produk" value={product.name} onChange={e => handleInput(e, index, 'name')} />
    //   </td>
    //   <td>
    //     <input className="input is-half" type="text" placeholder="Unit" value={product.unit} onChange={e => handleInput(e, index, 'unit')} />
    //   </td>
    //   <td>
    //     <input className="input" type="text" placeholder="Harga per Kg" value={product.price} onChange={e => handleInput(e, index, 'price')} />
    //   </td>
    //   <td>
    //     <input className="button is-danger" type="button" value="Delete" onClick={e => deleteProduct(index)} />
    //   </td>
    // </tr>
  ))
  return (
    <div>
      <table className="table is-fullwidth is-bordered is-striped">
        <thead className="has-background-beige">
          <tr>
            <th>Item</th>
            <th>Unit</th>
            <th>Harga per Kg</th>
            <th>Option</th>
          </tr>
        </thead>
        <tbody>
          {productsDisplay}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><input className="button is-info" type="button" value="Add" onClick={addProduct} /></td>
          </tr>
        </tfoot>
      </table>
      <div class="columns">
        <div class="column has-text-right">
          <input className="button is-success" type="button" value="Save" onClick={saveProducts} />
        </div>
      </div>
    </div>
  );
}

export default Product;
