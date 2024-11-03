import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchContext } from '../../Context/SearchContext';
import './index.css'
import axios from 'axios';
import Category from '../Category/Category';


const Search = () => {
    const search = useContext(SearchContext);
    const [searchParam, setSearchParam] = useSearchParams();
    const [products, setProducts] = useState([]); 

    const searchQuery = search.searchQuery;

    useEffect(() => {
        // Gọi API tìm kiếm sản phẩm từ backend
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/api/products/search?query=${searchQuery}`);
                setProducts(response.data); 
                
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        if (searchQuery) {
            fetchProducts();
        }
    }, [searchQuery]);

    return (
        <div className="search__container">
            {/* <div className="search__container__header">
                <h1>Search results for "{searchQuery}"</h1>
            </div> */}

            {/* Hiển thị danh sách sản phẩm với Category component */}
            <div className="category__card__container">
                <Category 
                    name={`Search results for "${searchQuery}"`} 
                    items={products}                   
                    category={null} 
                />
            </div>
        </div>
    );
};
 
export default Search;