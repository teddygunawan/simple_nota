import React, { useState, useEffect, useRef } from "react"
import Select from "react-select"
import { useSelector, useDispatch } from "react-redux"
import { Prompt } from "react-router-dom"
import { toMoney, toNumber } from "../utils/helpers"
import { printing, finishPrinting } from "../store/actions"
import "./Nota.scss"
import NotaProductTable from "../components/NotaProductTable"
import NotaCustomerInput from "../components/NotaCustomerInput"
import NotaFooter from "../components/NotaFooter"
import NotaHeader from "../components/NotaHeader"

const { ipcRenderer } = window.require("electron")

function Nota() {
  /* store constants */
  const isPrinting = useSelector((state) => state.isPrinting)
  const dispatch = useDispatch()

  const [productCart, setProductCart] = useState(
    JSON.parse(sessionStorage.getItem("product_cart")) || [],
  )
  const [products, setProducts] = useState([])
  const [productSelect, setProductSelect] = useState(null)
  const [isDisplaying, setIsDisplaying] = useState({ rekening: true })
  const [grandTotal, setGrandTotal] = useState("")
  const [customer, setCustomer] = useState(
    JSON.parse(sessionStorage.getItem("current_customer")) || {
      name: "",
      phone: "",
      address: "",
    },
  )
  const addedProductId = useRef(JSON.parse(sessionStorage.getItem("added_product_id")) || [])

  /* Initialize product list and key shortcuts */
  useEffect(() => {
    ipcRenderer.invoke("get-products").then((productsResponse) => {
      if (productsResponse) {
        setProducts(productsResponse)
      }
    })

    const printOnKeyup = (e) => {
      /* CTRL + s */
      if (e.ctrlKey && e.which === 83) {
        ipcRenderer.send("print-to-pdf")
      }
    }

    window.addEventListener("keyup", printOnKeyup)
    return () => {
      window.removeEventListener("keyup", printOnKeyup)
    }
  }, [])

  /* Update the select whenever user add an item into the cart */
  useEffect(() => {
    setProductSelect(products.filter((product) => !addedProductId.current.includes(product._id)))
  }, [productCart, products])

  /* Update grand total on product input */
  useEffect(() => {
    const total = productCart.reduce(
      (accumulator, product) => accumulator + toNumber(product.quantity) * toNumber(product.price),
      0,
    )
    setGrandTotal(toMoney(total))
  }, [productCart])

  const handleProductInput = (e, index) => {
    const tempArr = [...productCart]
    tempArr[index].quantity = e.target.value
    tempArr[index].total = e.target.value * toNumber(tempArr[index].price)
    tempArr[index].total = toMoney(tempArr[index].total)
    setProductCart(tempArr)
  }

  const handleCustomerInput = (e) => {
    const tempArr = { ...customer }
    tempArr[e.target.name] = e.target.value
    setCustomer(tempArr)
  }

  const onProductSelect = (selectedProduct) => {
    const newProduct = { ...selectedProduct, quantity: 0, total: 0 }
    setProductCart([...productCart, newProduct])
    addedProductId.current.push(selectedProduct._id)
  }

  const deleteProduct = (id) => {
    const productIndex = productCart.findIndex((product) => product._id === id)
    const tempArr = [...productCart]
    tempArr.splice(productIndex, 1)
    addedProductId.current.splice(addedProductId.current.indexOf(id))
    setProductCart(tempArr)
  }

  // const onIsDisplayChecked = (e, key) => {
  //   setIsDisplaying({
  //     ...isDisplaying,
  //     [key]: e.target.value,
  //   })
  // }

  const print = () => {
    dispatch(printing())
    ipcRenderer.invoke("print-to-pdf", document.body.innerHTML).then(
      setTimeout(() => {
        dispatch(finishPrinting())
      }, 3000),
    )
  }

  const reset = () => {
    sessionStorage.removeItem("product_cart")
    sessionStorage.removeItem("current_customer")
    sessionStorage.removeItem("added_product_id")

    setProductCart([])
    setCustomer({
      name: "",
      phone: "",
      address: "",
    })
  }

  const completeTransaction = () => {
    const data = {
      customer,
      products: productCart,
    }
    ipcRenderer.invoke("save-transaction", data)
    print()
    reset()
  }

  return (
    <div className="mb-5">
      <NotaHeader />
      <div className="columns mt-2 py-3 border-top">
        <NotaCustomerInput customer={customer} onChange={handleCustomerInput} onDeleteClick />
      </div>
      <hr />
      {!isPrinting && (
        <Select
          value=""
          onChange={onProductSelect}
          options={productSelect}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option._id}
        />
      )}
      <br />
      <NotaProductTable
        handleProductInput={handleProductInput}
        deleteProduct={deleteProduct}
        productCart={productCart}
        grandTotal={grandTotal}
      />

      {!isPrinting && (
        <div className="has-text-right">
          <button type="button" className="button is-success" onClick={completeTransaction}>
            <i className="fas fa-print" />
            Print
          </button>
        </div>
      )}

      <NotaFooter isDisplaying={isDisplaying} />
      {/* Save product cart before moving page */}
      <Prompt
        message={() => {
          sessionStorage.setItem("product_cart", JSON.stringify(productCart))
          sessionStorage.setItem("current_customer", JSON.stringify(customer))
          sessionStorage.setItem("added_product_id", JSON.stringify(addedProductId.current))
          return true
        }}
      />
    </div>
  )
}

export default Nota
