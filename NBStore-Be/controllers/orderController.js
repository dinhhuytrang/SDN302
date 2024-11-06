const { WAIT_FOR_CONFIRM_ORDER, PREPARING_ORDER, SHIPPING, COMPLETED } = require('../constant/Constant');
const Order = require('../models/Oder.model');
const OrderItem = require('../models/OderItem.model');

const generateOrderCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

const getAllOrderOfUser = async (req, res, next) => {
    try {
        const id = req.query.idUser
        if (!id) {
            res.status(400).json({ message: "not get idUser" })
        }
        const orders = await Order.find({ user: id }).populate("user").exec()
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }
        res.status(200).json({ orders })
    } catch (error) {
        next(error)
    }
}
const adminGetAllOrder = async (req, res, next) => {
    try {

        const orders = await Order.find().populate("user").exec()
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json(orders)
    } catch (error) {
        next(error)
    }
}

const getAllItemOrderOfUser = async (req, res, next) => {
    try {
        const id = req.query.idUser;
        if (!id) {
            return res.status(400).json({ message: "idUser is required" });
        }

        // Find all orders by user id
        const orders = await Order.find({ user: id }).populate("user").exec();

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        // Fetch all order items for each order
        const orderItems = await Promise.all(
            orders.map(async (order) => {
                // Find the items related to each order and populate the "order" and "product"
                return await OrderItem.find({ order: order._id }).populate("order product").exec();
            })
        );

        // Flatten the array of arrays (in case multiple orders return multiple arrays)
        const flattenedOrderItems = orderItems.flat();

        if (flattenedOrderItems.length === 0) {
            return res.status(404).json({ message: "No order items found" });
        }

        res.status(200).json({ orderItems: flattenedOrderItems });
    } catch (error) {
        next(error);
    }
};

const getOrderInfo = async (req, res, next) => {
    try {
        const idOrder = req.params.idOrder
        const order = await Order.findById(idOrder).populate("user").exec()
        res.status(200).json(order)
    } catch (error) {
        next()
    }
}

const getItemOfOrder = async (req, res, next) => {
    try {
        const idOrder = req.params.idOrder
        const orderItem = await OrderItem.find({ order: idOrder }).populate(["order", "product"]).exec()
        res.status(200).json(orderItem)
    } catch (error) {
        next()
    }
}

const changeStatus = async (req, res, next) => {
    try {
        const idOrder = req.query.idOrder;
        const orderInfo = await Order.findById(idOrder).populate("user").exec()
        if (orderInfo.status === WAIT_FOR_CONFIRM_ORDER) {
            orderInfo.status = PREPARING_ORDER
        } else if (orderInfo.status === PREPARING_ORDER) {
            orderInfo.status = SHIPPING
        } else if (orderInfo.status === SHIPPING) {
            orderInfo.status = COMPLETED
        } else {
            return res.status(500).json({ message: "Cannot update more" })
        }
        await Order.findByIdAndUpdate(idOrder, { status: orderInfo.status }, { new: true })
        res.status(200).json({ message: "Update success" })
    } catch (error) {
        next()
    }
}

const getAllOrderItem = async (req, res, next) => {
    try {
        const orderItem = await OrderItem.find().populate(["order", "product"]).exec()
        res.status(200).json(orderItem)
    } catch (error) {
        next()
    }
}

const createOrder = async (req, res) => {
    try {
        // Tạo mã đơn hàng ngẫu nhiên
        let orderCode = generateOrderCode();
        
        // Kiểm tra mã đơn hàng đã tồn tại trong cơ sở dữ liệu chưa
        while (await Order.exists({ orderCode })) {
            orderCode = generateOrderCode();  // Nếu trùng, tạo mã mới
        }

        const orderDetails = req.body;  // Lấy dữ liệu đơn hàng từ frontend
        orderDetails.orderCode = orderCode;  // Gán mã đơn hàng vào dữ liệu

        // Tạo đơn hàng mới từ dữ liệu
        const newOrder = new Order(orderDetails);

        // Lưu đơn hàng vào cơ sở dữ liệu
        await newOrder.save();

        // Tạo các OrderItem từ danh sách sản phẩm trong đơn hàng
        const orderItems = orderDetails.items && orderDetails.items.map(item => {
            return new OrderItem({
                order: newOrder._id,  // Gán ID đơn hàng
                product: item.productId,  // ID sản phẩm
                quantity: item.quantity,  // Số lượng sản phẩm
                price: item.price,  // Giá sản phẩm
            });
        });
        
        // Kiểm tra nếu không có sản phẩm trong đơn hàng
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Không có sản phẩm trong đơn hàng.' });
        }
        

        // Lưu các OrderItem vào cơ sở dữ liệu
        await OrderItem.insertMany(orderItems);

        // Trả về phản hồi thành công
        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Có lỗi khi tạo đơn hàng.' });
    }
};


module.exports = {
    getAllOrderOfUser,
    getAllItemOrderOfUser,
    getOrderInfo,
    getItemOfOrder,
    changeStatus,
    adminGetAllOrder,
    getAllOrderItem,
    createOrder
};
