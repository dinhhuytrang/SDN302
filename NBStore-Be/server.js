const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const cartRoutes = require('./routes/cartRoutes');
const Rate = require('./models/Rate.model');
const Product = require('./models/Products.model');
const sendEmail = require('./sendEmail/sendEmail');
const { SUBJECT_RESET_ACCOUNT, TEXT_RESET_ACCOUNT, HTML_RESET_ACCOUNT } = require('./constant/Constant');
const router = express.Router();
const User = require('./models/User.models');
const Category = require('./models/Category.model');
const productRoutes = require('./routes/productRoutes');
const { searchProducts, getTopSellingProducts } = require('./controllers/productController');
const Order = require('./models/Oder.model');
const { OrderRouter } = require('./routes/orderRoutes');
const OrderItem = require('./models/OderItem.model');
// const { CategoryRouter } = require('./routes/categryRoutes');
const { productWareHouseRouter } = require('./routes/ProductWarehouseRouter');
// const { OrderRouter } = require('./routes/orderRoutes');
const CategoryRouter = require('./routes/categoryRoutes');

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.options('*', cors());


app.use(express.json());
app.use(bodyParser.json());
// Sample data to insert
const order=[
    {
        user:new mongoose.Types.ObjectId('67164900364a5090c4e51b2f'),
        totalOrder:300000,
        status:"Pending",
        payMethod:"cod",
        orderCode:"DSGFGFB341",
        address:"Ha Noi",
        phone:"0912300920"
    },
    {
        user:new mongoose.Types.ObjectId('67164900364a5090c4e51b2f'),
        totalOrder:1220000,
        status:"Shipped",
        payMethod:"vnpay",
        orderCode:"LLSMDODNM2",
        address:"Ha Noi",
        phone:"0912300920"
    },
    {
        user:new mongoose.Types.ObjectId('67164900364a5090c4e51b2f'),
        totalOrder:231300,
        status:"Delivered",
        payMethod:"vnpay",
        orderCode:"DLSKD30291",
        address:"Ha Noi",
        phone:"0912300920"
    },
    {
        user:new mongoose.Types.ObjectId('67164900364a5090c4e51b2f'),
        totalOrder:2313500,
        status:"Pending",
        payMethod:"vnpay",
        orderCode:"DSFMMK2810",
        address:"Ha Noi",
        phone:"0912300920"
    }
]

const orderItem=[
    {
        order:new mongoose.Types.ObjectId('67165c92e277be5e7fe1e495'),
        product: new mongoose.Types.ObjectId('67163099c872ff2744f40677'),
        quantity:2
    },
    {
        order:new mongoose.Types.ObjectId('67165c92e277be5e7fe1e495'),
        product: new mongoose.Types.ObjectId('67163099c872ff2744f40678'),
        quantity:2
    },
    {
        order:new mongoose.Types.ObjectId('67165c92e277be5e7fe1e496'),
        product: new mongoose.Types.ObjectId('67163099c872ff2744f40677'),
        quantity:1
    },
    {
        order:new mongoose.Types.ObjectId('67165c92e277be5e7fe1e497'),
        product: new mongoose.Types.ObjectId('67163099c872ff2744f40677'),
        quantity:1
    },
    {
        order:new mongoose.Types.ObjectId('67165c92e277be5e7fe1e498'),
        product: new mongoose.Types.ObjectId('67163099c872ff2744f40677'),
        quantity:2
    },
]
const rateData = [
    {
        idProduct: new mongoose.Types.ObjectId('67050413a94726a643b8dd49'),
        idUser: new mongoose.Types.ObjectId('6704f7c7141519736358774c'),
        idOrderItem: new mongoose.Types.ObjectId('67050888fb7b98a85874f8aa'),
        star: 5,
        review: 'Excellent product!',
        dateReview: new Date() // Current date
    },
    {
        idProduct: new mongoose.Types.ObjectId('67050413a94726a643b8dd49'),
        idUser: new mongoose.Types.ObjectId('6704f7c7141519736358774d'),
        idOrderItem: new mongoose.Types.ObjectId('67050888fb7b98a85874f8ac'),
        star: 4,
        review: 'Very good, but could be improved.',
        dateReview: new Date() // Current date
    },
    {
        idProduct: new mongoose.Types.ObjectId('67050413a94726a643b8dd4d'),
        idUser: new mongoose.Types.ObjectId('6704f7c7141519736358774c'),
        idOrderItem: new mongoose.Types.ObjectId('67050888fb7b98a85874f8aa'),
        star: 3,
        review: 'Average product, met expectations.',
        dateReview: new Date() // Current date
    }
];


const newUser = [
    {
        username: "user1",
        password: "1234",
        name: "duy",
        email: "dduy2357@gmail.com",
    },
    {
        username: "user2",
        password: "1234",
        name: "trang",
        email: "qduy2357@gmail.com",
    }
]
const newWhiteHouse = [
    {
      product: new mongoose.Types.ObjectId('671393b30c8881ed7d3c5e7e'),
      status: 'In',
      quantity: 30,
      supplier: 'Supplier A',
      note: 'Initial stock'
    },
    {
      product: new mongoose.Types.ObjectId('671393b30c8881ed7d3c5e7f'),
      status: 'In',
      quantity: 45,
      supplier: 'Supplier B',
      note: 'Initial stock'
    },
    {
      product: new mongoose.Types.ObjectId('671393b30c8881ed7d3c5e80'),
      status: 'In',
      quantity: 30,
      supplier: 'Supplier C',
      note: 'Initial stock'
    },
    {
      product: new mongoose.Types.ObjectId('671393b30c8881ed7d3c5e81'),
      status: 'In',
      quantity: 24,
      supplier: 'Supplier D',
      note: 'Initial stock'
    },
    {
      product: new mongoose.Types.ObjectId('671393b30c8881ed7d3c5e86'),
      status: 'In',
      quantity: 30,
      supplier: 'Supplier E',
      note: 'Initial stock'
    },
    {
      product: new mongoose.Types.ObjectId('671393b30c8881ed7d3c5e87'),
      status: 'In',
      quantity: 30,
      supplier: 'Supplier F',
      note: 'Initial stock'
    },
    {
      product: new mongoose.Types.ObjectId('6713930b1073ede74abcabd3'),
      status: 'In',
      quantity: 50,
      supplier: 'Supplier G',
      note: 'Initial stock'
    },
    {
      product: new mongoose.Types.ObjectId('671393b30c8881ed7d3c5e88'),
      status: 'In',
      quantity: 40,
      supplier: 'Supplier H',
      note: 'Initial stock'
    },
    {
      product: new mongoose.Types.ObjectId('671393b30c8881ed7d3c5e89'),
      status: 'In',
      quantity: 35,
      supplier: 'Supplier I',
      note: 'Initial stock'
    },
    {
      product: new mongoose.Types.ObjectId('671393b30c8881ed7d3c5e8f'),
      status: 'In',
      quantity: 40,
      supplier: 'Supplier J',
      note: 'Initial stock'
    }
  ]
  
// Function to insert sample rate data into MongoDB
const insertSampleRateData = async () => {
    try {
        // await Rate.insertMany(rateData); // Use Rate to insert data
        console.log("Sample rate data inserted successfully!");

        // await Product.insertMany(newProduct)
        // await User.insertMany(newUser)
        // await Category.insertMany(newCategory)
        // await OrderItem.insertMany(orderItem)
    } catch (error) {
        console.error("Error inserting sample rate data:", error);
    }
}; 

// Connect to MongoDB and insert sample data
connectDB()
    .then(() => {
        insertSampleRateData(); // Call the function to insert sample data
    })
    .catch(error => {
        console.error("Database connection error:", error);
    });

// Use user routes
app.use('/api/products', productRoutes.ProductRouter);
app.use('/api/warehouse',productWareHouseRouter)
app.use('/api/users', userRoutes);

app.use('/api/products', searchProducts);
app.use('/api/products', getTopSellingProducts);
app.use('/api/orders',OrderRouter);

app.use('/api/categories', CategoryRouter)
app.use('/api/sendemail', router.post('/', async (req, res, next) => {
    try {
        // Wait for the email to be sent
        const info = await sendEmail('dduy2357@gmail.com', SUBJECT_RESET_ACCOUNT, TEXT_RESET_ACCOUNT, HTML_RESET_ACCOUNT);

        // Log the response and send a success message back to Postman
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        // Log the error and send an error response back to Postman
        console.log('Error sending email: ' + error);
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
}));
app.use('/api/cart', cartRoutes)

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
