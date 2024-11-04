const { WAIT_FOR_CONFIRM_ORDER, PREPARING_ORDER, SHIPPING, COMPLETED } = require('../constant/Constant');
const Order = require('../models/Oder.model');
const OrderItem = require('../models/OderItem.model');

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
            return res.status(500).json({message:"Cannot update more"})
        }
        await Order.findByIdAndUpdate(idOrder, { status: orderInfo.status }, { new: true })
        res.status(200).json({ message: "Update success" })
    } catch (error) {
        next()
    }
}
module.exports = {
    getAllOrderOfUser,
    getAllItemOrderOfUser,
    getOrderInfo,
    getItemOfOrder,
    changeStatus
};
