import React, { useState, useEffect, useRef } from 'react';
import './Nota.scss';
import Select from 'react-select';
const ipcRenderer = window.require('electron').ipcRenderer;

function Nota(props) {
  let [productCart, setProductCart] = useState([])
  let [products, setProducts] = useState([])
  let [selectedProduct, setSelectedProduct] = useState("")
  let [productSelect, setproductSelect] = useState(null)
  let productCartInputs
  let addedProductId = useRef([])
  let isPrinting = useRef(false)
  useEffect(() => {
    ipcRenderer.invoke('get-products').then(data => {
      setProducts(data.products)
    });

    window.addEventListener("keyup", printOnKeyup);
    return () => {
      window.removeEventListener('keyup', printOnKeyup);
    }
  }, []);

  useEffect(() => {
    setproductSelect(products.filter((product, index) =>
      !addedProductId.current.includes(product.id)
    ))
  }, [productCart, products]);

  let printOnKeyup = (e) => {
    if (e.ctrlKey && e.which === 83) {
      ipcRenderer.send('print-to-pdf')
    }
  }

  let addProduct = () => {
    selectedProduct.priceDisplay = selectedProduct.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
    if (selectedProduct.id !== "") {
      setProductCart([
        ...productCart,
        selectedProduct
      ])
      addedProductId.current.push(selectedProduct.id)
      setSelectedProduct("")
    }
  }

  let handleInputChange = (e, index) => {
    let tempArr = [...productCart]
    tempArr[index]["quantity"] = e.target.value
    tempArr[index]["total"] = e.target.value * tempArr[index]["price"]
    setProductCart(tempArr)
  }

  let onProductSelect = (selectedOption) => {
    setSelectedProduct(selectedOption)
  }

  let print = () => {
    isPrinting.current = true
    // ipcRenderer.send('print-to-pdf')
  }

  let productCartInputs = productCart.map((product, index) =>
    (
      <tr key={product.id}>
        <td>{product.name}</td>
        <td>{product.unit}</td>
        <td>{product.priceDisplay}</td>
        <td>
          {isPrinting ? product.quantity : <input className="input" type="text" onChange={e => handleInputChange(e, index)} /> }
          
        </td>
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
      <table className="table is-fullwidth is-bordered is-narrow">
        <thead>
          <tr>
            <th>Item</th>
            <th className="column-small">Unit</th>
            <th className="column-small">Harga</th>
            <th className="column-small">Jumlah</th>
            <th className="column-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {productCartInputs}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <div className="columns">
                <div className="column">
                  <Select
                    value={selectedProduct}
                    onChange={onProductSelect}
                    options={productSelect}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id} />
                </div>
                <div className="column">
                  <input className="button is-info" type="button" value="Add" onClick={addProduct} />
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <input type="button" onClick={print} value="print" className="button is-success" />
    </div>
  );
}

export default Nota;
