import axios from 'axios'
import Noty from 'noty'
import { initAdmin }  from './admin'
import moment from 'moment'
import { initStripe }  from './stripe'


//hamburger functions
const hamburger = document.getElementById("hamburger");
const navUL = document.getElementById('nav-ul');

hamburger.addEventListener('click', () => {
    navUL.classList.toggle('show');
});

//add to cart
//add to cart functions
let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
function updateCart(item){
    axios.post('/update-cart', item).then(res => {
        console.log(res);
        cartCounter.innerText  = res.data.totalQty;
        new Noty({
            text : 'Added to Cart',
            timeout: 1000,
            type: 'success',
            progressBar: false
        }).show();
    }).catch(err => {
        new Noty({
            text : 'Something Went Wrong',
            timeout: 1000,
            type: 'error',
            progressBar: false
        }).show();
    })
}


addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let item = JSON.parse(btn.dataset.item);
        updateCart(item);
    });

});


//Remove alert message after sometime

const alerMsg = document.querySelector('#success-alert')

if(alerMsg) {
    setTimeout(() => {
        alerMsg.remove()
    }, 2000)
}


initAdmin()

//Update the order 
let statuses = document.querySelectorAll('.status_timeline')
let time_status = document.querySelector('.time_status')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let updateTime = document.createElement('small')
let takeAwayTime = document.createElement('span')

function updateStatus(order) {
    takeAwayTime.innerText = 'Take Away Time:' + order.takeAwayTime
    time_status.appendChild(takeAwayTime)

    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true;
    statuses.forEach((status) =>{
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status) {
            stepCompleted = false
            updateTime.innerText = ' --- ' +moment(order.updatedAt).format('hh:mm A')
            status.appendChild(updateTime)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }
    })

}

updateStatus(order)

initStripe()


//Socket
let socket = io()

//Join
if(order){
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) =>{
    //copy the order object in the updatedOrder variable
    const updatedOrder = { ...order }

    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updatedOrder.takeAwayTime = data.takeAwayTime
    updateStatus(updatedOrder)
    new Noty({
        text : 'New Update on your order',
        timeout: 1000,
        type: 'success',
        progressBar: false
    }).show();
})
