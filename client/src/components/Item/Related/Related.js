import { useState, useEffect } from 'react';
import axios from 'axios'; 
import RelatedCard from '../../Card/RelatedCard/RelatedCard';
import './Related.css';
import { BASE_URL } from '../../../constant/constant';
const Related = (props) => {
    // console.log(props.product);

    const [menItems, setMenItems] = useState([]);
    const [womenItems, setWomenItems] = useState([]);
    const [kidsItems, setKidsItems] = useState([]);

    useEffect(() => {
        if (props.product._id) {  // Ensure props.id exists before making the request
            axios.get(`${BASE_URL}/api/products/${props.product._id}/recommendations`)
                .then(res => {
                    // console.log(res.data.data);
                    
                    // Filter by category and set state
                    setMenItems(res.data.data.filter((item) => item.category.name === "men"));
                    setKidsItems(res.data.data.filter((item) => item.category.name === "kids"));
                    setWomenItems(res.data.data.filter((item) => item.category.name === "women"));
                })
                .catch(err => console.log(err));
        }
    }, [props.product._id]);  // Fetch data when the product id changes
    
    return ( 
        <div className="related__products">
            <div className="related__header__container">
                <div className="related__header">
                    <h2>Recommended Products</h2>
                </div>
                <div className="related__header__line"></div>
            </div>
            <div className="related__card__container">
                <div className="related__product__card">
                    { menItems && props.product.category.name === "men" && menItems.map((item) => <RelatedCard key={item._id} item={item} />)}
                    { womenItems && props.product.category.name === "women" && womenItems.map((item) => <RelatedCard key={item._id} item={item} />)}
                    { kidsItems && props.product.category.name === "kids" && kidsItems.map((item) => <RelatedCard key={item._id} item={item} />)}
                </div>
            </div>
        </div>
    );
}

export default Related;
