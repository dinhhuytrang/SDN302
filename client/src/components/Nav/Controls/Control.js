import './Control.css'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Badge from '@mui/material/Badge';
import { Link } from 'react-router-dom';
import Cart from '../../Card/Cart/Cart';
import { useContext, useState, useEffect } from 'react';
import { WishItemsContext } from '../../../Context/WishItemsContext';

const Control = () => {
    const wishItems = useContext(WishItemsContext)
    const [user, setUser] = useState();

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')))
    }, [user])

    return (
        <div className="control__bar__container">
            <div className="controls__container">
                <div className="control">
                    {user ?
                        (<Link to="/account/me">
                            <PersonOutlineIcon color="black" size="large" sx={{ width: '35px' }} />
                        </Link>) :
                        (<Link to="/account/login">
                            <PersonOutlineIcon color="black" size="large" sx={{ width: '35px' }} />
                        </Link>)
                    }
                </div>
                <div className="control">
                    <Link to="/wishlist">
                        <Badge badgeContent={wishItems.items.length} color="error">
                            <FavoriteBorderIcon color="black" sx={{ width: '35px' }} />
                        </Badge>
                    </Link>
                </div>
                <div className="control">
                    <Cart />
                </div>

            </div>
        </div>
    );
}

export default Control;