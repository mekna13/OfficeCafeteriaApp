const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')

function initRoutes(app) {
    app.get('/', homeController().index);

    app.get('/cart', cartController().index);
    app.post('/update-cart', cartController().update);
    
    app.get('/login', authController().login);
    
<<<<<<< Updated upstream
    app.get('/register', authController().register);
=======
    app.get('/register', guest, authController().register);
    app.post('/register', upload, authController().postRegister)

    app.get('/profile', authController().profile);

    app.get('/profile/:id/edit', authController().profileEdit);
<<<<<<< HEAD
    app.post('/profile/:id/edit',upload, authController().profileEditUpdate);

=======
    app.put('/profile/:id/edit',upload, authController().profileEditUpdate);
    
>>>>>>> b02bbb6ed5ce26d5c477c1ad0e25021a1073c014
    app.post('/logout', authController().logout)

    app.get('/customer/orders', auth, orderController().index)
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders/:id', auth, orderController().show)

    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)

    app.get('/admin/menu', admin, menuController().index)
    app.post('/admin/menu', admin, menuUpload, menuController().postMenu)

>>>>>>> Stashed changes
}

module.exports = initRoutes 