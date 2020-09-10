const { app } = require("electron")
const Datastore = require("nedb-promises")

const db = {}
const userData = app.getPath("userData")

db.products = new Datastore({
  filename: `${userData}/data/products.db`,
  autoload: true,
  timestampData: true,
})
db.transactions = new Datastore({
  filename: `${userData}/data/transactions.db`,
  autoload: true,
  timestampData: true,
})

// db.products.remove({}, { multi: true })
// db.transactions.remove({}, { multi: true })

module.exports = db
