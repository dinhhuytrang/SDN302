import { Link } from 'react-router-dom';
import './CategoryCard.css';
import { Button } from '@mui/material';

const CategoryCard = ({ data }) => { // Nhận props data
    console.log(data);
    
    return ( 
        <div className="category__card__card">
            <div className="category__image"> 
               <img src={data.image} alt={data.name} className="product__img"/> 
            </div>
            <div className="category__card__detail">
                <div className="category__name">
                    <span>{data.name}</span> {/* Hiện tên danh mục */}
                </div>
                <div className="category__card__action">
                    <Link to={data.url}>
                        <Button variant='outlined' sx={[{'&:hover': { backgroundColor: 'none', borderColor: '#FFE26E', color: '#FFE26E'}, borderRadius: '20px', borderColor: '#FFE26E', backgroundColor: "#FFE26E", color: "#000", fontWeight: '700'}]}>SHOP NOW</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
 
export default CategoryCard;
