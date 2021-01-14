const Menu = require('../../../models/menu')

function menuController() {
    return {
        index(req, res) {
            return res.render('admin/menu')
        }, 
        async postMenu(req, res, next) {
            const name = req.body.name
            const price = req.body.price
            const itemImage = req.file.filename

            if(!name || !price || !itemImage) {
                req.flash('error','All fields are required');
                req.flash('name',name)
                req.flash('price',price)
                return res.redirect('/admin/menu');
            }

            const newItem = await new Menu({
                name,
                price,
                itemImage
            })

            newItem.save().then((newItem) => {
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something Went Wrong')
                return res.redirect('/admin/menu')
            })
            
        }
    }
}

module.exports = menuController