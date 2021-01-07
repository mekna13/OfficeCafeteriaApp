import axios from 'axios'
import Noty from 'noty'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
function updateCart(item){
    axios.post('/update-cart', item).then(res => {
        console.log(res);
        cartCounter.innerText  = res.data.totalQty;
        new Noty({
            text : 'Added to Cart',
            timeout: 1000
        }).show();
    }).catch(err => {
        new Noty({
            text : 'Something Went Wrong',
            timeout: 1000
        }).show();
    })
}


addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let item = JSON.parse(btn.dataset.item);
        updateCart(item);
    });
});