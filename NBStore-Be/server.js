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
const User = require('./models/User.models');
const Category = require('./models/Category.model');
const productRoutes = require('./routes/productRoutes');
const { searchProducts } = require('./controllers/productController');
const Order = require('./models/Oder.model');
const { OrderRouter } = require('./routes/orderRoutes');
const OrderItem = require('./models/OderItem.model');


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

const newCategory = [
    {
        name: "men",
        image: "https://i.pinimg.com/736x/d4/24/58/d4245806458d4177c8f0ef15d2733522.jpg"
    },
    {
        name: "women",
        image: "https://i.pinimg.com/736x/9d/04/6f/9d046fea7c898e80afc80f20bb5a26d3.jpg"
    },
    {
        name: "kids",
        image: "https://i.pinimg.com/736x/80/eb/06/80eb06b4e48fadbee71c7d71246caf41.jpg"
    }
];

const newProduct = [
    {
        name: "CANIFA sweatshirt set",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134258-7ras8-m188fxl9fk3e65", "https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lxmd4nqtgel556@resize_w450_nl.webp"],
        price: 165,
        remain: 30,
        numberOfSale: 15,
        description: "Products are designed, manufactured and exclusively distributed by CANIFA - a Vietnamese fashion brand trusted by many customers since 2001. With a system of more than 100 stores and distributors nationwide.",
        option: [
            "Lightblue-Size S", "Lightblue-Size M", "Lightblue-Size L",
            "Purple-Size S", "Purple-Size M", "Purple-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb450')

    },
    {
        name: "Cool Feel Short Sleeve Set",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lx0nrm8lsvdl09.webp", "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lx0r0r60u5zv21.webp"],
        price: 350,
        remain: 45,
        numberOfSale: 20,
        description: "Cool Feel clothes, super thin, smooth, cool, summer home wear for babies, Unifriend Korea",
        option: [
            "White-blue-Size S", "White-blue-Size M", "White-blue-Size L",
            "White-green-Size S", "White-green-Size M", "White-green-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb450')
    },

    {
        name: "Vest gile",
        image: ["https://down-vn.img.susercontent.com/file/sg-11134201-7rdyx-m0v1p9d675dwd0.webp", "https://down-vn.img.susercontent.com/file/sg-11134201-7rdvt-m0v1p9zx8g78a1.webp"],
        price: 300,
        remain: 30,
        numberOfSale: 20,
        description: "Set of boy's vest, short-sleeved black shirt, vest and bow tie, size 1 to 7T BERNIE 0724B26",
        option: [
            "Size S", "Size M", "Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb450')
    },

    {
        name: "AIRCOOL baby short sleeve clothes set",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ls9l8v3qrsuc16.webp", "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ls9l8v3qdr4pe0.webp"],
        price: 270,
        remain: 24,
        numberOfSale: 15,
        description: "AIRCOOL cotton short-sleeved baby clothes set, cool and stretchy",
        option: [
            "White-Size S", "White-Size M", "White-Size L",
            "Black-Size S", "Black-Size M", "Black-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb450')
    },

    {
        name: "CANIFA baby pajamas",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lwpirn2sgqyo1a.webp", "https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lwpirn50di5bba.webp"],
        price: 320,
        remain: 30,
        numberOfSale: 15,
        description: "CANIFA baby pajamas set, cool and stretchy",
        option: [
            "White-Size S", "White-Size M", "White-Size L",
            "Blue-Size S", "Blue-Size M", "Blue-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb450')
    },

    {
        name: "BEAR LEADER Jacket Set",
        image: ["https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-llizecj568x8dc.webp", "https://down-vn.img.susercontent.com/file/sg-11134201-22110-5lkhk6pdfyjv39.webp"],
        price: 350,
        remain: 30,
        numberOfSale: 15,
        description: "BEAR LEADER Cotton Jacket and Short Skirt Set",
        option: [
            "White-Size S", "White-Size M", "White-Size L",
            "Blue-Size S", "Blue-Size M", "Blue-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb450')
    },

    //Women
    {
        name: "Lovito T-Shirt",
        image: ["https://down-vn.img.susercontent.com/file/sg-11134201-7rdvq-lz9ygvuz3zaa20.webp", "https://down-vn.img.susercontent.com/file/sg-11134201-7rdvq-lz9ygvuz3zaa20.webp"],
        price: 150,
        remain: 50,
        numberOfSale: 30,
        description: "Lovito T-shirt with embroidered solid color fabric stitching casual style for women LNE37180",
        option: [           
            "Size S", "Size M", "Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44f')
    },

    {
        name: "Lovito T-Shirt",
        image: ["https://down-vn.img.susercontent.com/file/sg-11134201-7rd3p-lv8l65qr26hi1f.webp", "https://down-vn.img.susercontent.com/file/sg-11134201-7rd5q-lv8l68ukik7r3f.webp"],
        price: 150,
        remain: 50,
        numberOfSale: 37,
        description: "Lovito Women's Casual Solid Color Zipper T-Shirt LNA27136",
        option: [           
            "Black-Size S", "Black-Size M", "Black-Size L",
            "Brown-Size S", "Brown-Size M", "Brown-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44f')
    },

    {
        name: "TOLI Women's T-shirt",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxdqfua81byxd7.webp", "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz9z8j48o6z1ac.webp"],
        price: 200,
        remain: 40,
        numberOfSale: 30,
        description: "Lovito Women's Casual Solid Color Zipper T-Shirt LNA27136",
        option: [           
            "Yellow-Size S", "Yellow-Size M", "Yellow-Size L",
            "White-Size S", "White-Size M", "White-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44f')
    },

    {
        name: "TOLI Women's T-shirt",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxdqfua81byxd7.webp", "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz9z8j48o6z1ac.webp"],
        price: 200,
        remain: 45,
        numberOfSale: 30,
        description: "TOLI women's T-shirt with round neck and short sleeves, light fit, 4-way stretch cotton fabric, printed with FRANCE M02",
        option: [           
            "Yellow-Size S", "Yellow-Size M", "Yellow-Size L",
            "White-Size S", "White-Size M", "White-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44f')
    },

    {
        name: "Croptop shirt",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lfaim68ogqc7a2.webp", "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lf9xz7bj5d93cb.webp"],
        price: 250,
        remain: 20,
        numberOfSale: 10,
        description: "Croptop shirt, Layered ruffled silk shirt, can be worn in 2 styles",
        option: [           
            "Pink-Size S", "Pink-Size M", "Pink-Size L",
            "White-Size S", "White-Size M", "White-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44f')
    },

    {
        name: "JINZAO cardigan sweater",
        image: ["https://down-vn.img.susercontent.com/file/sg-11134201-7rdvf-lzoh0dzu8ap4ca.webp", "https://down-vn.img.susercontent.com/file/sg-11134201-7rdyu-lzoh0nkq7kzq96.webp"],
        price: 399,
        remain: 34,
        numberOfSale: 12,
        description: "JINZAO cardigan sweater cardigan jacket Casual Korean Style Vintage Fashion",
        option: [           
            "Pink-Size S", "Pink-Size M", "Pink-Size L",
            "White-Size S", "White-Size M", "White-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44f')
    },

    // Men
    {
        name: "Hawaiian Shirt",
        image: ["https://down-vn.img.susercontent.com/file/sg-11134201-7qvdo-ljxmx1us5fr9c5.webp", "https://down-vn.img.susercontent.com/file/sg-11134201-7qves-ljxmx3etwt6c68.webp"],
        price: 270,
        remain: 35,
        numberOfSale: 10,
        description: "Men's Fashionable Hawaiian Style Loose Long Sleeve Shirt",
        option: [           
            "Brown-Size S", "Brown-Size M", "Brown-Size L",
            "White-Size S", "White-Size M", "White-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44e')
    },

    {
        name: "SCafé Men's Polo Shirt",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134201-7qukw-li6s3gn2bmc215.webp", "https://down-vn.img.susercontent.com/file/vn-11134201-7qukw-li6s3h5dm7m430.webp"],
        price: 300,
        remain: 40,
        numberOfSale: 20,
        description: "Coolmate men's SCafé polo shirt with effective deodorization",
        option: [           
            "Brown-Size S", "Brown-Size M", "Brown-Size L"          
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44e')
    },

    {
        name: "Short Sleeve Shirt",
        image: ["https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lprlsl96mom065.webp", "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lprlsl96phqw31.webp"],
        price: 150,
        remain: 20,
        numberOfSale: 7,
        description: "Men's Fashion Printed Short Sleeve Shirt",
        option: [           
            "Blue-Size S", "Blue-Size M", "Blue-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44e')
    },

    {
        name: "HERUS V2 knitted polo shirt",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0jpdxwcdjvxaf.webp", "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-luyqo594yalhd9.webp"],
        price: 150,
        remain: 19,
        numberOfSale: 7,
        description: "HERUS V2 premium knitted polo shirt, classic Korean style",
        option: [           
            "Blue-Size S", "Blue-Size M", "Blue-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44e')
    },

    {
        name: "JULIDO Men's Sportswear",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwdcz4q80gd5ce.webp", "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwbz0g17tgbded.webp"],
        price: 199,
        remain: 23,
        numberOfSale: 7,
        description: "JULIDO men's sports set short sleeve shirt loose fitting shorts",
        option: [           
            "Black-Size S", "Black-Size M", "Black-Size L",
            "White-Size S", "White-Size M", "White-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44e')
    },

    {
        name: "Local Brand T-Shirt",
        image: ["https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-m093l7k9cfe53f.webp", "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1dw3xixqkig84.webp"],
        price: 299,
        remain: 35,
        numberOfSale: 14,
        description: "Local Brand T-Shirt VIBESTU Logo With Boxy Collar, Loose Form",
        option: [           
            "Yellow-Size S", "Yellow-Size M", "Yellow-Size L",
            "White-Size S", "White-Size M", "White-Size L"
        ],
        category: new mongoose.Types.ObjectId('67162f2cb676e54ecd5eb44e')
    }
]
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
// Function to insert sample rate data into MongoDB
const insertSampleRateData = async () => {
    try {
        // await Rate.insertMany(rateData); // Use Rate to insert data
        console.log("Sample rate data inserted successfully!");

        // await Order.insertMany(order)
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
app.use('/api/users', userRoutes);
app.use('/api/products', searchProducts);
app.use('/api/orders',OrderRouter)
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
