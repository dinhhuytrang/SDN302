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
const category = require('./models/Category.model')

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
const newProduct = [{
    name: "do choi",
    price: 2323,
    remain: 20,
    numberOfSale: 20

}]  
const categories = [
    { id: 1, name: "Men", image: "https://i0.wp.com/mylook.com.de/wp-content/uploads/2024/02/spring-2024-streetwear-fashion-trends-for-men.webp?fit=1024%2C1024&ssl=1" },
    { id: 2, name: "Women", image: "https://i.pinimg.com/736x/75/85/f0/7585f0454f86e6323bd18cdc46e080a2.jpg" },
    { id: 3, name: "Children", image: "https://img.freepik.com/free-photo/full-shot-kids-posing-together_23-2149853383.jpg" },
];
// Function to insert sample rate data into MongoDB
const insertSampleRateData = async () => {
    try {
        await Rate.insertMany(rateData); // Use Rate to insert data
        console.log("Sample rate data inserted successfully!");

        await Product.insertMany(newProduct)
        await category.insertMany(categories)
        
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
