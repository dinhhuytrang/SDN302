const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const Rate = require('./models/Rate.model'); 
const Product = require('./models/Products.model');
const sendEmail = require('./sendEmail/sendEmail');
const { SUBJECT_RESET_ACCOUNT, TEXT_RESET_ACCOUNT, HTML_RESET_ACCOUNT } = require('./constant/Constant');
const router = express.Router();
const User = require('./models/User.models')
const category = require('./models/Category.model');
const ProductRoute = require('./routes/ProductRouter');

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
const rateData = [
    {
        idProduct: new mongoose.Types.ObjectId('67050413a94726a643b8dd49'),
        idUser: new mongoose.Types.ObjectId('6704f7c7141519736358774c'),
        idOrderItem: new mongoose.Types.ObjectId('67050888fb7b98a85874f8aa'),
        star: 5,
        review: 'Excellent product!',
        dateReview: new Date() 
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

// const categories = [
//     {  name: "Men", image: "https://i0.wp.com/mylook.com.de/wp-content/uploads/2024/02/spring-2024-streetwear-fashion-trends-for-men.webp?fit=1024%2C1024&ssl=1" },
//     {  name: "Women", image: "https://i.pinimg.com/736x/75/85/f0/7585f0454f86e6323bd18cdc46e080a2.jpg" },
//     {  name: "Children", image: "https://img.freepik.com/free-photo/full-shot-kids-posing-together_23-2149853383.jpg" },
// ];

// const  newProduct = [
//     {
//       "name": "Single-Breasted Wool Pont Neuf Jacket",
//       "image": [
//         "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-single-breasted-wool-pont-neuf-jacket--HSFJ8EJWO651_PM2_Front%20view.png?wid=1090&hei=1090",
//         "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-single-breasted-wool-pont-neuf-jacket--HSFJ8EJWO651_PM1_Side%20view.png?wid=1090&hei=1090",
//         "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-single-breasted-wool-pont-neuf-jacket--HSFJ8EJWO651_PM1_Back%20view.png?wid=1090&hei=1090"
//       ],
//       "price": 3400000,
//       "remain": 10,
//       "numberOfSale": 5,
//       "category": "670e29ff0f3f380a21eecc7b",
//       "description": "This sleek single-breasted Pont Neuf jacket is distinguished with a fine wool Damier Heritage jacquard.",
//       "option": ["M", "SM", "L", "XL", "XXL"],
//       "rate": []
//     },
//     {
//       "name": "Wool Cigarette Pants",
//       "image": [
//         "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-wool-cigarette-pants--HSFP8WJWO651_PM2_Front%20view.png?wid=1090&hei=1090",
//         "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-wool-cigarette-pants--HSFP8WJWO651_PM1_Side%20view.png?wid=1090&hei=1090",
//         "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-wool-cigarette-pants--HSFP8WJWO651_PM1_Back%20view.png?wid=1090&hei=1090"
//       ],
//       "price": 130000,
//       "remain": 10,
//       "numberOfSale": 5,
//       "category": "670e29ff0f3f380a21eecc7b",
//       "description": "These elegantly tailored navy blue Pont Neuf cigarette pants stand out with a fine wool Damier Heritage jacquard.",
//       "option": ["M", "SM", "L", "XL", "XXL"],
//       "rate": []
//     },
//     {
//       "name": "Ribbed Hood Double Face Cape",
//       "image": [
//         "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-ribbed-hood-double-face-cape%20--FSCO19QWE904_PM2_Front%20view.png?wid=1090&hei=1090",
//         "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-ribbed-hood-double-face-cape%20--FSCO19QWE904_PM1_Side%20view.png?wid=1090&hei=1090",
//         "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-ribbed-hood-double-face-cape%20--FSCO19QWE904_PM1_Back%20view.png?wid=1090&hei=1090"
//       ],
//       "price": 535000,
//       "remain": 10,
//       "numberOfSale": 5,
//       "category": "670e29ff0f3f380a21eecc7c",
//       "description": "This cape is crafted from cozy double-face wool-silk, which is signed on the inside with a graphic Monogram jacquard for a subtle signature accent.",
//       "option": ["M", "SM", "L", "XL", "XXL"],
//       "rate": []
//     }
//   ];
  
const newUser=[
    {
        username:"user1",
        password:"1234",
        name:"duy",
        email:"dduy2357@gmail.com",
    },
    {
        username:"user2",
        password:"1234",
        name:"trang",
        email:"qduy2357@gmail.com",
    }
]

// Function to insert sample rate data into MongoDB
const insertSampleRateData = async () => {
    try {
        await Rate.insertMany(rateData); // Use Rate to insert data
        console.log("Sample rate data inserted successfully!");

        // await Product.insertMany(newProduct)

        // await category.insertMany(categories)
        
        // await User.insertMany(newUser)

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
app.use('/api/products',ProductRoute)
app.use('/api/users', userRoutes);
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


// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
