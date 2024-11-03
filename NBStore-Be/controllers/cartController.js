const Cart = require('../models/Cart.model');
const Product = require('../models/Products.model');
const User = require('../models/User.models');

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  const { user, product, quantity } = req.body;
  const userId = user.id; // Lấy user từ request (giả định là user đã được xác thực)

  try {
    // Tìm sản phẩm theo id
    const productFound = await Product.findById(product);

    // Kiểm tra nếu sản phẩm không tồn tại hoặc số lượng yêu cầu vượt quá số lượng còn lại
    if (!productFound) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (quantity > productFound.remain) {
      return res.status(400).json({ message: 'Not enough products in stock' });
    }

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người dùng chưa
    let cartItem = await Cart.findOne({ user: userId, product: product });

    if (cartItem) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, cộng thêm số lượng
      cartItem.quantity += quantity;

      // Kiểm tra lại số lượng có còn đủ không sau khi cập nhật
      if (cartItem.quantity > product.remain) {
        return res.status(400).json({ message: 'Not enough products in stock' });
      }
    } else {
      // Nếu chưa có trong giỏ hàng, tạo mới
      cartItem = new Cart({
        user: userId,
        product,
        quantity
      });
    }

    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItem = async (req, res) => {
  const { product, user, quantity } = req.body;

  try {
    if (!product || !user || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID, User ID, and quantity are required' });
    }

    const productFounded = await Product.findById(product);

    // Kiểm tra nếu số lượng mới lớn hơn số lượng tồn kho
    if (quantity > productFounded.remain) {
      return res.status(400).json({ message: 'Not enough products in stock' });
    }

    const updatedItem = await Cart.findOneAndUpdate(
      { product: product, user: user }, // Search criteria
      { quantity: quantity }, // Update operation
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    return res.status(200).json({ message: 'Cart item updated successfully', item: updatedItem });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeCartItem = async (req, res) => {
  const { cartItemId } = req.params;

  try {
    // Validate input
    if (!cartItemId) {
      return res.status(400).json({ message: 'Cart item ID is required' });
    }

    // Find and remove the cart item by cartItemId
    const deletedItem = await Cart.findByIdAndDelete(cartItemId);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    return res.status(200).json({ message: 'Cart item removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing cart item', error: error.message });
  }
};

// Lấy giỏ hàng của người dùng
const getAll = async (req, res) => {
  const userId = req.query.userId;

    try {
        // Fetch cart items for the specific user and populate product details
        const cartItems = await Cart.find({ user: userId }).populate('product');

        // Update cart items to use the latest product prices
        const updatedCartItems = cartItems.map(item => ({
            ...item._doc,
            product: {
                ...item.product._doc,
                price: item.product.price // Use updated price from Product
            }
        }));

        // Calculate the total order price
        const totalOrderPrice = updatedCartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

        res.status(200).json({ cartItems: updatedCartItems, totalOrderPrice });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
};

const getCart = async (req, res) => {
  const { user, product } = req.query;

  try {

    if (!user || !product) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
    }

    // Find the cart item by userId and productId
    const cartItem = await Cart.findOne({ user: user, product: product });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    return res.status(200).json({ message: 'Cart item retrieved successfully', item: cartItem });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving cart item', error: error.message });
  }
}

module.exports = {
  addToCart,
  updateCartItem,
  removeCartItem,
  getAll,
  getCart,
};
