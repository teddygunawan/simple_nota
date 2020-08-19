import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toMoney, toNumber } from '../utils/helpers'
import ProductInput from '../components/ProductInput';
const ipcRenderer = window.require('electron').ipcRenderer;
function Product(props) {
  let [products, setProducts] = useState([])
  let identities = useRef({})

  /* Initialize products and identities hook and attach enter listener */
  useEffect(() => {
    ipcRenderer.invoke('get-products').then(data => {
      if (data.products && data.identities) {
        setProducts(data.products)
        identities.current = data.identities
      }
    });
  }, []);

  let addProduct = () => {
    identities.current["product_id"] += 1
    setProducts([
      {
        "id": identities.current["product_id"].toString(),
        "name": "",
        "price": "",
        "unit": "Pcs"
      },
      ...products
    ]);
  }
  

  let onInput = (e, index, key) => {
    e.preventDefault()
    let newArr = [...products]
    newArr[index][key] = e.target.value
    if (key === 'price') {
      newArr[index][key] = toMoney(newArr[index][key])
    }
    setProducts(newArr)
  }

  let saveProducts = () => {
    let data = {
      products,
      "identities": identities.current
    }
    data.products.sort((a, b) => {
      if (a.name < b.name)
        return -1
      else
        return 1
    })
    data.products = data.products.filter(product => product.name.trim() !== "")
    ipcRenderer.invoke('save-products', data).then(status => {

    });
  }

  let deleteProduct = (index) => {
    let tempArr = [...products]
    tempArr.splice(index, 1)
    setProducts(tempArr)
  }
  let productsDisplay = products.map((product, index) => (
    <ProductInput key={product.id} handleInput={onInput} product={product} index={index} deleteProduct={deleteProduct} />
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
          <tr>
            <td><input className="button is-info" type="button" value="Add" onClick={addProduct} /></td>
          </tr>
          {productsDisplay}
        </tbody>
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
