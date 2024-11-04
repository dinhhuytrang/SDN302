import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ReactLoading from 'react-loading';
import Item from '../components/Item/Item';
import { BASE_URL } from '../../src/constant/constant';
import Header from '../components/Header/Header';
const ProductView = (props) => {
    const param = useParams()
    const [item, setItem] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0)
        axios.get(`${BASE_URL}/api/products/${param.id}`)
            .then(res => {
                // console.log(res.data.data);

                setItem(res.data.data)

                setLoading(false)
            })
            .catch(err => console.log(err))

    }, [param.id])

    return (
        <div>
            <Header />
            <div className="d-flex min-vh-100 w-100 justify-content-center align-items-center m-auto">
                {loading && <ReactLoading type="balls" color='#FFE26E' height={100} width={100} className='m-auto' />}
                {item && <Item item={item} />}
            </div>
        </div>
    );
}

export default ProductView;