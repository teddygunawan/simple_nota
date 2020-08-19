
const Store = require('electron-store');
module.exports = function () {
    const store = new Store()
    if (!store.get('products')) {
        store.set('products', [{
            "id": "0",
            "name": "",
            "price": "",
            "unit": "Pcs"
        }])
    }
    if (!store.get('identities')) {

        store.set('identities', {
            "product_id": 0
        })
    }
}