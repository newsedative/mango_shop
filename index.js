let express = require(`express`);
let app = express();
let port = 3000;

app.listen(port, function(){
    console.log(`http://localhost:${port}`)
});

//Раздача статики
app.use(express.static(`public`));

//Настройка handlebars
let hbs = require(`hbs`);
app.set('views', 'views');
app.set('view engine', 'hbs');

// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/mango_shop')

let schema = new mongoose.Schema({
    type: String,
    title: String,
    image: String,
    price: Number,
    description: String,
    bonus: Number,
    isMine: Boolean
});
let Card = mongoose.model('card', schema)

//POST-запросы
app.use(express.urlencoded({extended: true}));

app.get('/', async function(req, res) {
    let data = await Card.find().limit(8);
    res.render('index', {
        array: data
    })
});

app.get('/product', async function(req, res) {
    let id = req.query.id;
    let data = await Card.findOne({_id: id});
    res.render('product', data)
});

app.get('/cooperation', function(req, res) {
    res.render('cooperation')
});

app.get('/profile', async function(req, res) {
    let data = await Card.find({isMine: true});
    res.render('profile', {
        array: data
    })
});

app.get('/collections', async function(req, res) {
    let data = await Card.find();
    res.render('collections', {
        array: data
    })
});


app.post('/create', async function(req, res) {
    let card = new Card ({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        type: req.body.category,
        bonus: req.body.bonus,
        image: req.body.image,
        isMine: true
    });
    
    await card.save();

    res.redirect(`/profile`)
});

app.get('/remove', async function(req, res) {
    let id = req.query.id;

    await Card.deleteOne({_id: id});
    
    res.redirect('/profile')
});

app.get(`/search`, async function (req, res) {
    let title = req.query.title;
    let type = req.query.category;
    let sort = Number(req.query.sort);

    let search = {};
    let sorting = {};

    if (title) {
        search.title = title;
    }
    if (type) {
        search.type = type;
    }
    if (sort) {
        sorting.price = sort;
    }

    let data = await Card.find(search).sort(sorting).limit(5);

    res.render('collections', {array: data});   
});


app.post('/sendmes', function (req, res) {

})
