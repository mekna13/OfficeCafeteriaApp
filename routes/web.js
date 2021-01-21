//Controllers
const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const menuController = require('../app/http/controllers/admin/menuController')


//Middlewares
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')
const upload = require('../app/http/middlewares/upload')
const menuUpload = require('../app/http/middlewares/menuUpload')

function initRoutes(app) {
    app.get('/', homeController().index);

    app.get('/cart', cartController().index);
    app.post('/update-cart', cartController().update);
    
    app.get('/login', guest, authController().login);
    app.post('/login', authController().postLogin);
    
    app.get('/register', guest, authController().register);
    app.post('/register', upload, authController().postRegister)

    app.get('/profile', authController().profile);

    app.get('/profile/:id/edit', authController().profileEdit);
    app.put('/profile/:id/edit',upload, authController().profileEditUpdate);
    
    app.post('/logout', authController().logout)

    app.get('/customer/orders', auth, orderController().index)
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders/:id', auth, orderController().show)

    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)

    app.get('/admin/menu', admin, menuController().index)
    app.post('/admin/menu', admin, menuUpload, menuController().postMenu)

}

module.exports = initRoutes 