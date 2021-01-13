const Order = require('../../../models/order')
const moment = require('moment')

function orderController () {
    return {
        store(req, res) {
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items
            });
            order.save().then(result =>{

                Order.populate(result, { path : 'customerId' }, (err, placedOrder) =>{
                    req.flash('success', 'Order placed successfully')
                    delete req.session.cart

                    //Emit event
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder)
                    
                    return res.redirect('/customer/orders')
                })
            }).catch(err =>{
                req.flash('error', 'Something Went Wrong')
                return res.redirect('/cart')
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } })
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req,res){
            const order = await Order.findById(req.params.id)

            //Check if user is authorised
            //i.e., check if the fetched id is similar to the current user's id
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order: order })
            }

            return res.redirect('/')
        }
    }
}

module.exports = orderController