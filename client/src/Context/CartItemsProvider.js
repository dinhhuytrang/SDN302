import { useEffect, useState } from "react";
import { CartItemsContext } from "./CartItemsContext";
import { BASE_URL } from '../constant/constant';

const CartItemsProvider = (props) => {

    const [cartItems, setCartItems] = useState([])
    const [totalAmountOfItems, setTotalAmountOfItems] = useState(0)

    const addToCartHandler = (item, quantity) => {
        const { _id, name, price, image, category } = item;
        removeFromCartHandler(item)
        setCartItems((prevItems) => [...prevItems, { _id, name, price, image, category, quantity: quantity }])
    }

    const removeFromCartHandler = (item) => {
        setCartItems(cartItems.filter((prevItem) => prevItem._id !== item._id))
    }


    const quantityHandler = (itemId, action) => {
        if (action === 'INC') {
            setCartItems(cartItems.map((item) => {
                if (item.id === itemId) {
                    item.quantity += 1
                }
                return item
            }))
        }
        else {
            setCartItems(cartItems.map((item) => {
                if (item.id === itemId) {
                    item.quantity -= 1
                }
                return item
            }))
        }
    }

    useEffect( () => {
        const fetchCartItems = async () => {
            try {
                // Get userId from localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.id) {
                    return;
                }
                const userId = user.id;
    
                // Fetch the cart items for the specific user
                const response = await fetch(`${BASE_URL}/api/cart?userId=${userId}`, { method: 'GET' });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
    
                const data = await response.json();
    
                // Map cart items to extract only product details and quantity
                const formattedCartItems = data.cartItems.map((item) => ({
                    _id: item.product._id,
                    category: item.product.category,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image,
                    quantity: item.quantity, // Quantity from the cart
                }));
    
                // Set the formatted cart items and total order price
                setCartItems(formattedCartItems);
                setTotalAmountOfItems(data.totalOrderPrice);
    
            } catch (error) {
                console.error('Error fetching cart items:', error.message);
            }
        };
        fetchCartItems();
    }, [cartItems])


    const cartItemCtx = {
        items: cartItems,
        totalAmount: totalAmountOfItems,
        addItem: addToCartHandler,
        removeItem: removeFromCartHandler,
        quantity: quantityHandler
    }

    return (
        <CartItemsContext.Provider value={cartItemCtx}>
            {props.children}
        </CartItemsContext.Provider>
    );
}

export default CartItemsProvider;