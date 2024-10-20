import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ReactLoading from 'react-loading';
import Category from '../components/Category/Category';

const CategoryView = () => {
    const param = useParams()
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Category IDs for men, women, kids (replace with your real ObjectId values)
    const MEN_CATEGORY_ID = '6713930b1073ede74abcabd2';
    const WOMEN_CATEGORY_ID = '6713930b1073ede74abcabd3';
    const KIDS_CATEGORY_ID = '6713930b1073ede74abcabd4';

    useEffect(() => {
        axios.get("http://localhost:9999/api/products")
            .then(res => {
                const data = res.data.data; // accessing 'data' array from API response
                
                // Filter products by category based on URL parameter
                if (param.id === 'men') {
                    setProducts(data.filter(item => item.category._id === MEN_CATEGORY_ID));
                } else if (param.id === 'women') {
                    setProducts(data.filter(item => item.category._id === WOMEN_CATEGORY_ID));
                } else if (param.id === 'kids') {
                    setProducts(data.filter(item => item.category._id === KIDS_CATEGORY_ID));
                }
                
                setLoading(false);
            })
            .catch(err => console.log(err));
        
        window.scrollTo(0, 0);
    }, [param.id]);

    return (
        <div className='d-flex min-vh-100 w-100 justify-content-center align-items-center m-auto'>
            {loading && <ReactLoading type="balls" color='#FFE26E' height={100} width={100} className='m-auto' />}
            
            {/* Render category-specific products */}
            {products && param.id === 'men' && <Category name="Men's Fashion" items={products} category="men" />}
            {products && param.id === 'women' && <Category name="Women's Fashion" items={products} category="women" />}
            {products && param.id === 'kids' && <Category name="Kids Fashion" items={products} category="kids" />}
        </div>
    );
}
 
export default CategoryView;