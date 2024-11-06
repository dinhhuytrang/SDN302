import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Landing from "../components/Landing/Landing";
import FeaturedItems from "../components/Featured/Items/FetauredItems";
import FeaturedCategories from "../components/Featured/Categories/FeaturedCategories";
import { TabTitle } from "../utils/General";



const Home = () => {
    const [ featuredItems, setFeaturedItems ] = useState()
    TabTitle("Home - NBStore");

    useEffect(() => {
        // Lấy sản phẩm nổi bật
         axios.get("http://localhost:9999/api/products/features")
         
            .then(res => setFeaturedItems(res.data.data))
            
            .catch(err => console.log(err));



        window.scrollTo(0, 0);
        
    }, []);
   

    return (
        <Fragment>
            <Landing />
            <FeaturedCategories />
            <FeaturedItems items={featuredItems} />
        </Fragment>
    );
}

export default Home;