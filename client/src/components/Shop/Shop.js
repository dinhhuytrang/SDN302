import { useEffect, useState } from 'react';
import { TabTitle } from '../../utils/General';
import axios from "axios";
import ShopCategory from './Container/ShopCategory';
import './Shop.css';
import ReactLoading from 'react-loading';

const Shop = () => {
    TabTitle("Shop - SHEMA")
    const [ menItems, setMenItems ] = useState()
    const [ womenItems, setWomenItems ] = useState()
    const [ kidsItems, setKidsItems ] = useState()
    const [ loading , setLoading ] = useState(true) 

    useEffect(() => {
        axios.get("http://localhost:9999/api/products")
            .then(res => {
                console.log(res.data)
                 setMenItems(res.data.data.filter((item) => item.category.name === "men")) // So sánh với category.name
                
                 setKidsItems(res.data.data.filter((item) => item.category.name === "kids" ))
                 setWomenItems(res.data.data.filter((item) => item.category.name === "women"))
                setLoading(false)
            })
            .catch(err => console.log(err))
        window.scrollTo(0, 0)
    
    }, [])

    return ( 
        <div className="shop__contianer">
            {loading && <ReactLoading type="balls" color='#FFE26E'  height={100} width={100} className='container h-100 w-10 justify-self-center align-self-center m-auto'/>}
            {menItems && <ShopCategory name="Men" key="men" items={menItems}/>}
            {womenItems && <ShopCategory name="Women" key="women" items={womenItems}/>}
            {kidsItems && <ShopCategory name="Kids" key="kids" items={kidsItems}/>}
        </div>
     );
}
 
export default Shop;
