const Order = require('../../../models/order')
const moment = require('moment')
const { response } = require('express')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

function orderController () {
    return {
        store(req, res) {

            const { stripeToken, paymentType } = req.body

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items
            });
            order.save().then(result =>{

                Order.populate(result, { path : 'customerId' }, (err, placedOrder) =>{
                    // req.flash('success', 'Order placed successfully')
                    
                    //Stripe Payment
                    if(paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Order: ${placedOrder._id}`
                        }).then(() =>{
                            placedOrder.paymentType = paymentType;
                            placedOrder.paymentStatus = true;
                            placedOrder.save().then((ord) =>{
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart   
                                return res.json({message: 'Payment Successful. Order placed successfully'})
                            }).catch(err =>{
                                console.log(err)
                            })
                        }).catch(err =>{
                            delete req.session.cart   
                            return res.json({message: 'Order Placed but Payment Failed. You can pay at delivery.'})
                        })
                    }else{
                        delete req.session.cart 
                        return res.json({message: 'Order placed successfully'})
                    }
                    
                    // return res.redirect('/customer/orders')
                    
                })
            }).catch(err =>{
                req.flash('error', 'Something Went Wrong')
                return response.status(500).json({message: 'Something went wrong'})
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