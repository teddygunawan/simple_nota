import React, { useState, useEffect, useRef } from 'react';
import './Nota.scss';
const ipcRenderer = window.require('electron').ipcRenderer;

function Nota(props) {
  let [productCart, setProductCart] = useState([])
  let [products, setProducts] = useState([])
  let addedProductId = useRef([])
  let selectedProduct = useRef({ "name": "", "id": "" })
  let [productSelect, setproductSelect] = useState(null)
  useEffect(() => {
    ipcRenderer.invoke('get-products').then(data => {
      setProducts(data.products)
    });

    window.addEventListener("keyup", function(e) { 
      if (e.ctrlKey &&  e.which === 83) {
        ipcRenderer.send('print-to-pdf')
      }
  });
  }, []);

  useEffect(() => {
    setproductSelect(products.map((product, index) => {
      if (!addedProductId.current.includes(product.id)) {
        return <option key={product.id} value={product.id}>{product.name}</option>
      }
    }))
  }, [productCart, products]);

  let addProduct = () => {
    if (selectedProduct.current.id !== "") {
      setProductCart([
        ...productCart,
        selectedProduct.current
      ])
      addedProductId.current.push(selectedProduct.current.id)
      selectedProduct.current = { name: "", id: "" }

    }
  }

  let onProductSelect = (e) => {
    selectedProduct.current = products.find(product => product.id === e.target.value)
  }

  let handleChange = (e, index) => {
    let tempArr = [...productCart]
    tempArr[index]["quantity"] = e.target.value
    tempArr[index]["total"] = e.target.value * tempArr[index]["price"]
    setProductCart(tempArr)
  }

  let print = () => {
    ipcRenderer.send('print-to-pdf')
  }

  let productInputs = productCart.map((product, index) =>
    (
      <tr key={product.id}>
        <td>{product.name}</td>
        <td>{product.price}</td>
        <td><input className="input" type="text" onChange={e => handleChange(e, index)} /></td>
        <td>Kg</td>
        <td>{product.total}</td>
      </tr>
    )
  )

  return (
    <div>
      <img alt="brand" className="image is-128x128" src="/brand.png" />
      <div className="columns mt-1">
        <div className="column">
          Tanggal: {new Date().toISOString().slice(0, 10)} <br />
          Nama: Teddy Gunawan<br />
          Alamat: Jalan Cempaka Bawah No.6B<br />
          No HP: 0895704416769
        </div>
      </div>
      <table className="table is-fullwidth is-bordered">
        <thead>
          <tr>
            <th>Item</th>
            <th>Harga per Kg</th>
            <th>Jumlah</th>
            <th>Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {productInputs}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <div className="columns">
                <div className="column">
                  <div className="control is-expanded">
                    <div className="select is-fullwidth has-full">
                      <select value={selectedProduct.id} onChange={onProductSelect}>
                        <option value=""></option>
                        {productSelect}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <input className="button is-info" type="button" value="Add" onClick={addProduct} />
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Nota;
