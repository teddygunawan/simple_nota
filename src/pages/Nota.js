import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import productCartInput from '../components/ProductCartInput'
import { toMoney, toNumber } from '../utils/helpers'
import './Nota.scss';
import brand from "../assets/brand.png";
import ProductCartInput from '../components/ProductCartInput';
const ipcRenderer = window.require('electron').ipcRenderer;

function Nota(props) {
  let [productCart, setProductCart] = useState([])
  let [products, setProducts] = useState([])
  let [productSelect, setproductSelect] = useState(null)
  let [isPrinting, setIsPrinting] = useState(false)
  let [isShowing, setIsShowing] = useState({ "rekening": true })
  let [customer, setCustomer] = useState({
    "name": "",
    "phone": "",
    "address": ""
  })
  let [grandTotal, setGrandTotal] = useState("")
  let addedProductId = useRef([])
  useEffect(() => {
    ipcRenderer.invoke('get-products').then(data => {
      if (data.products)
        setProducts(data.products)
    });

    let printOnKeyup = (e) => {
      /* CTRL + s */
      if (e.ctrlKey && e.which === 83) {
        ipcRenderer.send('print-to-pdf')
      }
    }

    window.addEventListener("keyup", printOnKeyup);
    return () => {
      window.removeEventListener('keyup', printOnKeyup);
    }
  }, [])

  useEffect(() => {
    setproductSelect(products.filter((product, index) =>
      !addedProductId.current.includes(product.id)
    ))

  }, [productCart, products])

  useEffect(() => {
    let total = productCart.reduce(
      (accumulator, product) =>
        accumulator + (toNumber(product.quantity) * toNumber(product.price))
      , 0)
    setGrandTotal(toMoney(total))
  }, [productCart])

  let onProductInput = (e, index) => {
    let tempArr = [...productCart]
    tempArr[index]["quantity"] = e.target.value
    tempArr[index]["total"] = e.target.value * toNumber(tempArr[index]["price"])
    tempArr[index]["total"] = toMoney(tempArr[index]["total"])
    setProductCart(tempArr)
  }

  let onCustomerInput = (e) => {
    let tempArr = { ...customer }
    tempArr[e.target.name] = e.target.value
    setCustomer(tempArr)
  }

  let onProductSelect = (selectedProduct) => {
    selectedProduct = {
      ...selectedProduct,
      "quantity": 0,
      "total": 0
    }
    setProductCart([
      ...productCart,
      selectedProduct
    ])
    addedProductId.current.push(selectedProduct.id)
  }

  let deleteProduct = (id) => {
    let productIndex = productCart.findIndex(product => product.id === id)
    let tempArr = [...productCart]
    tempArr.splice(productIndex, 1)
    addedProductId.current.splice(addedProductId.current.indexOf(id))
    setProductCart(tempArr)
  }

  let print = () => {
    setIsPrinting(true)
    ipcRenderer.invoke('print-to-pdf').then(() => setIsPrinting(false))
  }

  let productCartInputs = productCart.map((product, index) =>
    (
      <ProductCartInput key={product.id} product={product} isPrinting={isPrinting} index={index} handleInput={onProductInput} deleteProduct={deleteProduct} />
    )
  )

  return (
    <div className="mb-5">
      <div className="columns">
        <div className="column">
          <img alt="brand" className="image is-128x128" src={brand} />
        </div>
        <div className="column has-text-right">
          <label class="checkbox">
            <input type="checkbox" onChange={e => setIsShowing(e.target.value)} />
             Rekening
          </label>
        </div>
      </div>
      <div className="columns mt-2 py-3 border-top">
        <div className={"column" + (isPrinting ? "" : " is-one-quarter")}>
          Tanggal: {new Date().toISOString().slice(0, 10)} <br />
          Nama:
          {isPrinting
            ? customer.name
            : <input type="text" className="input" name="name" value={customer.name} onChange={onCustomerInput} />} <br />
          Alamat:
          {isPrinting
            ? customer.address
            : <input type="text" className="input" name="address" value={customer.address} onChange={onCustomerInput} />} <br />
          No HP:
          {isPrinting
            ? customer.phone
            : <input type="text" className="input" name="phone" value={customer.phone} onChange={onCustomerInput} />}
        </div>
      </div><hr />

      {isPrinting ? "" :
        <div className="columns">
          <div className="column">
            <Select
              value=""
              onChange={onProductSelect}
              options={productSelect}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id} />
          </div>
        </div>
      }
      <table className="table is-fullwidth is-bordered is-narrow mb-5">
        <thead>
          <tr>
            {isPrinting ? null : <th className="column-minimum">Option</th>}
            <th className="column-big">Item</th>
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
          {productCart.length > 0
            ?
            <tr>
              <td className="has-text-right has-background-gray" colspan="5">Grand Total</td>
              <td>{grandTotal}</td>
            </tr>
            :
            null}
        </tfoot>
      </table>
      <div class="has-text-right">
        {
          isPrinting
            ? null
            :
            <button type="button" className="button is-success" onClick={print}>
              <i class="fas fa-print"></i> Print
            </button>
        }
      </div>

      {isShowing.rekening ?
        <p className="has-text-danger">
          Harap melakukan pembayaran ke <br />
          BCA 4840084286. <br />
          An: Liong Christine Tinche <br />
          Agar barang bisa segera disiapkan. Terima kasih.

      </p> : null}
      <fieldset>
        <legend>Notes</legend>
        Pada suatu hari
      </fieldset>
      {/* <textarea class="textarea" placeholder="e.g. Hello world"></textarea> */}

    </div>

  );
}

export default Nota;
