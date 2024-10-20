import ItemCarousel from './Carousel/ItemCarousel';
import Description from './Description/Description';
import Detail from './Detail/Detail';
import './Item.css';
import Related from './Related/Related';

const Item = (props) => {
    // console.log(props.item);
    
    return ( 
        <div className="item__container">
            <div className="detail__and__carousel__container">
                <ItemCarousel item={props}/>
                <Detail item={props}/>
            </div>
            <div className="item__description__container">
                <Description item={props}/>
            </div>
            <div className="related__items__container">
                <Related product={props.item}/>
            </div>
        </div>
     );
}
 
export default Item;