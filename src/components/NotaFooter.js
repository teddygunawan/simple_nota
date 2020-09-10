import React from "react"

function NotaFooter(props) {
  const { isDisplaying } = props
  return (
    <div>
      {isDisplaying.rekening ? (
        <p className="has-text-danger">
          Harap melakukan pembayaran ke
          <br />
          BCA 4840084286.
          <br />
          An: Liong Christine Tinche
          <br />
          Agar barang bisa segera disiapkan. Terima kasih.
        </p>
      ) : null}
      <fieldset>
        <legend>Notes</legend>
        Pada suatu hari
      </fieldset>
      {/* <textarea class="textarea" placeholder="e.g. Hello world"></textarea> */}
    </div>
  )
}

export default NotaFooter
