import React, { useState, useEffect, useRef } from "react"
import { Prompt } from "react-router-dom"
import { toMoney } from "../utils/helpers"
import ProductInput from "../components/ProductInput"

const { ipcRenderer } = window.require("electron")

function Product() {
  const [products, setProducts] = useState([])
  const changesExist = useRef(false)
  const newId = useRef(0)

  /* Initialize products and identities hook and attach enter listener */
  useEffect(() => {
    ipcRenderer.invoke("get-products").then((productsResponse) => {
      if (productsResponse) {
        setProducts(productsResponse)
      }
    })
  }, [])

  const addProduct = () => {
    setProducts([
      {
        _id: newId.current,
        name: "",
        price: "",
        unit: "Pcs",
        new: true,
      },
      ...products,
    ])
    newId.current += 1
  }

  const handleInput = (e, index, key) => {
    e.preventDefault()
    changesExist.current = true

    const newArr = [...products]
    newArr[index][key] = e.target.value
    newArr[index].changed = true
    if (key === "price") {
      newArr[index][key] = toMoney(newArr[index][key])
    }
    setProducts(newArr)
  }

  const saveProducts = () => {
    const newProducts = []
    const changedProducts = []
    const deletedProducts = []
    products.forEach((product) => {
      if (product.new) {
        newProducts.push({
          name: product.name,
          price: product.price,
          unit: product.unit,
        })
      } else if (product.deleted) {
        deletedProducts.push({ _id: product._id })
      } else if (product.changed) {
        changedProducts.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit,
        })
      }
    })

    const data = {
      newProducts,
      changedProducts,
      deletedProducts,
    }
    changesExist.current = false
    ipcRenderer.invoke("save-products", data).then(() => {})
  }

  const deleteProduct = (index) => {
    const tempArr = [...products]
    tempArr[index].deleted = true
    setProducts(tempArr)
  }

  const productsInput = products.map((product, index) => {
    if (!product.deleted) {
      return (
        <ProductInput
          key={product._id}
          onChange={handleInput}
          product={product}
          index={index}
          deleteProduct={deleteProduct}
        />
      )
    }
    return null
  })
  return (
    <div>
      <Prompt
        when={changesExist.current}
        message={() => "Ada perubahan yang belum tersimpan, buang perubahan yang anda lakukan?"}
      />
      <table className="table is-fullwidth is-bordered is-striped">
        <thead className="has-background-beige">
          <tr>
            <th>Item</th>
            <th>Unit</th>
            <th>Harga Pokok</th>
            <th>Harga per Unit</th>
            <th>Option</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                className="button is-info"
                type="button"
                value="Tambah Produk"
                onClick={addProduct}
              />
            </td>
          </tr>
          {productsInput}
        </tbody>
      </table>
      <div className="columns">
        <div className="column has-text-right">
          <input
            className="button is-success"
            type="button"
            value="Simpan Perubahan"
            onClick={saveProducts}
          />
        </div>
      </div>
    </div>
  )
}
export default Product
