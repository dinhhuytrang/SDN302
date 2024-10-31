import './ItemCard.css';
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartItemsContext } from "../../../Context/CartItemsContext";
import { IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { WishItemsContext } from '../../../Context/WishItemsContext';
import { BASE_URL } from '../../../constant/constant';

const ItemCard = (props) => {
    const [isHovered, setIsHovered] = useState(false)
    const cartItemsContext = useContext(CartItemsContext)
    const wishItemsContext = useContext(WishItemsContext)

    const handleAddToWishList = () => {
        wishItemsContext.addItem(props.item)
    }

    const handleAddToCart = async () => {
        cartItemsContext.addItem(props.item, 1)
        

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            console.error('User not found in local storage');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user, product: props.item._id, quantity: 1 })
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            const data = await response.json();
            console.log('Item added to cart successfully:', data);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    }

    return (
        <div className="product__card__card">
            <div className="product__card">
                <div className="product__image"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {isHovered ? <img src={props?.item.image[0]} alt="item" className="product__img" /> : <img src={props?.item.image[1]} alt="item" className="product__img" />}
                </div>
                <div className="product__card__detail">
                    <div className="product__name">
                        <Link to={`/item/${props.item.category.name}/${props.item._id}`}>
                            {props.item.name}
                        </Link>
                    </div>
                    {/* <div className="product__description">
                        <span>{props.item.description}</span>
                    </div> */}
                    <div className="product__price">
                        <span>${props.item.price}</span>
                    </div>
                    <div className="product__card__action">
                        <IconButton onClick={handleAddToWishList} sx={{ borderRadius: '20px', width: '40px', height: '40px', /* borderWidth: '3px', borderStyle: 'solid', borderColor: '#FFE26E' */ }}>
                            <FavoriteBorderIcon sx={{ width: '22px', height: '22px', color: 'black' }} />
                        </IconButton>
                        <IconButton onClick={handleAddToCart} sx={{ borderRadius: '20px', width: '40px', height: '40px' /*  borderWidth: '3px', borderStyle: 'solid', borderColor: '#FFE26E' */ }}>
                            <AddShoppingCartIcon sx={{ width: '22px', height: '22px', color: 'black' }} />
                        </IconButton >
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemCard;