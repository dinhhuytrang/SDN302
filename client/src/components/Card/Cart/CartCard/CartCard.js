import { useContext } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './CartCard.css';
import { CartItemsContext } from '../../../../Context/CartItemsContext';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { BASE_URL } from '../../../../constant/constant';

const CartCard = (props) => {
    let cartItems = useContext(CartItemsContext)
    // console.log(cartItems)
    console.log(props)

    const handelQuantityIncrement = async (event) => {
        cartItems.quantity(props.item.id, 'INC');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            console.error('User not found in local storage');
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/cart/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: props.item._id, user: user.id, quantity: props.item.quantity })
            });

            if (!response.ok) {
                throw new Error('Failed to update cart item');
            }

            const data = await response.json();
            console.log('Cart item updated successfully:', data);
        } catch (error) {
            console.error('Error updating cart item:', error.message);
        }
    };

    const handelQuantityDecrement = async (event) => {
        if (props.item.quantity > 1) {
            cartItems.quantity(props.item.id, 'DEC');

        }
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            console.error('User not found in local storage');
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/cart/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: props.item._id, user: user.id, quantity: props.item.quantity })
            });

            if (!response.ok) {
                throw new Error('Failed to update cart item');
            }

            const data = await response.json();
            console.log('Cart item updated successfully:', data);
        } catch (error) {
            console.error('Error updating cart item:', error.message);
        }
    };

    const handelRemoveItem = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            console.error('User not found in local storage');
            return;
        }
        const getCartResponse = await fetch(`${BASE_URL}/api/cart/item?user=${user.id}&product=${props.item._id}`);

        if (!getCartResponse.ok) {
            throw new Error('Cart item not found or failed to retrieve');
        }

        const cartData = await getCartResponse.json();

        try {
            const response = await fetch(`${BASE_URL}/api/cart/remove/${cartData.item._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            const data = await response.json();
            console.log('Cart item removed successfully:', data);

            // Optional: Update the cart state to reflect the item removal
            cartItems.removeItem(props.item);

        } catch (error) {
            console.error('Error removing item from cart:', error.message);
        }
    }

    return (
        <div className='cart__item__card'>
            <div className="cart__item__detail">
                <div className="cart__item__image">
                    <img src={`${props.item.image[0]}`} alt="item" className="item__image" />
                </div>
                <div className="cart__item__name">{props.item.name}</div>
            </div>
            <div className="cart__item__quantity">
                <IconButton onClick={handelQuantityIncrement}>
                    <AddCircleIcon />
                </IconButton>
                <div type="text" name="quantity" className="quantity__input">{props.item.quantity}</div>
                <IconButton onClick={handelQuantityDecrement}>
                    <RemoveCircleIcon fontSize='medium' />
                </IconButton>
            </div>
            <div className="cart__item__price">${props.item.price}</div>
            <div className="remove__item__icon">
                <IconButton>
                    <HighlightOffIcon onClick={handelRemoveItem} />
                </IconButton>
            </div>
        </div>
    );
}

export default CartCard;