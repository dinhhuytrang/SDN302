const Cart = require('../models/Cart.model');
const Products = require('../models/Products.model');
const User = require('../models/User.models');

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Lấy user từ request (giả định là user đã được xác thực)

  try {
    // Tìm sản phẩm theo id
    const product = await Products.findById(productId);

    // Kiểm tra nếu sản phẩm không tồn tại hoặc số lượng yêu cầu vượt quá số lượng còn lại
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (quantity > product.remain) {
      return res.status(400).json({ message: 'Not enough products in stock' });
    }

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người dùng chưa
    let cartItem = await Cart.findOne({ user: userId, product: productId });

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
        product: productId,
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
  const { cartItemId, quantity } = req.body;

  try {
    const cartItem = await Cart.findById(cartItemId).populate('product');

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const product = await Products.findById(cartItem.product._id);

    // Kiểm tra nếu số lượng mới lớn hơn số lượng tồn kho
    if (quantity > product.remain) {
      return res.status(400).json({ message: 'Not enough products in stock' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeCartItem = async (req, res) => {
  const { cartItemId } = req.params;

  try {
    const cartItem = await Cart.findByIdAndDelete(cartItemId);
    
    if (cartItem) {
      res.status(200).json({ message: 'Cart item removed' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing cart item', error });
  }
};

// Lấy giỏ hàng của người dùng
const getCart = async (req, res) => {
  const userId = req.user._id; // Lấy user từ request

  try {
    // Lấy các sản phẩm trong giỏ hàng và cập nhật giá mới nhất từ bảng product
    const cartItems = await Cart.find({ user: userId }).populate('product');

    // Cập nhật lại giá sản phẩm theo giá mới nhất từ Product model
    const updatedCartItems = cartItems.map(item => {
      return {
        ...item._doc,
        product: {
          ...item.product._doc,
          price: item.product.price // Lấy giá cập nhật từ Product
        }
      };
    });

    // Tính tổng giá trị đơn hàng
    const totalOrderPrice = updatedCartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    res.status(200).json({ cartItems: updatedCartItems, totalOrderPrice });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

module.exports = {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart
};
