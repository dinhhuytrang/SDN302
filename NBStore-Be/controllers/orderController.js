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

module.exports = {
    getAllOrderOfUser,
    getAllItemOrderOfUser
};
