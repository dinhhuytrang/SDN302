import './Description.css';

const Description = (props) => {
    console.log(props.item.item);
    
    return ( 
        <div className="product__description__product">
            <div className="description__header__container">
                <div className="description__header__line"></div>
                <div className="description__header">Details</div>
            </div>
            <div className="description__detail__container">
                <div className="description__detail">
                <p>{props.item.item.description}</p>
                </div>
            </div>
            {/* <div className="description__specifics__container">
                <div className="description__specifics">
                <div className="description__header__line"></div>
                <div className="description__highlights__header">Highlights</div>
                    <ul>
                        {props.item.item.highlights.map((highlight) => <li>{highlight}</li>)}
                    </ul>
                </div>
            </div> */}
        </div>
     );
}
 
export default Description;