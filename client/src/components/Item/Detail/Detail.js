import { useContext, useState } from "react";
import "./Detail.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { CartItemsContext } from "../../../Context/CartItemsContext";
import { WishItemsContext } from "../../../Context/WishItemsContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Swal from 'sweetalert2';

const Detail = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [option, setOption] = useState(props.item.item.option[0]);
  const [stock, setStock] = useState(props.item.item.remain); // Thêm trạng thái stock

  const cartItems = useContext(CartItemsContext);
  const wishItems = useContext(WishItemsContext);

  const handleoptionChange = (event) => {
    setOption(event.target.value);
  };

  const maxQuantity = Math.min(stock,12); // Giới hạn tối đa là stock hoặc 5

  const handelQuantityIncrement = (event) => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Limit Exceeded',
        text: `In stock: ${stock}. You can only choose ${maxQuantity} items.`,
      });
    }
  };

  const handelQuantityDecrement = (event) => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handelAddToCart = () => {
    if (stock > 0) {
      cartItems.addItem(props.item, quantity, option);
      setStock(stock - quantity); // Cập nhật lại số lượng stock
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Out of Stock',
        text: 'This product is out of stock and cannot be added to the cart.',
      });
    }
  };

  const handelAddToWish = () => {
    wishItems.addItem(props.item);
  };

  return (
    <div className="product__detail__container">
      <div className="product__detail">
        <div className="product__main__detail">
          <div className="product__name__main">{props.item.item.name}</div>
          <div className="product__price__detail">${props.item.item.price}</div>
          <div
            className="product_remain"
            style={{ color: stock > 0 ? "green" : "red" }} // Dùng stock thay cho remain
          >
            {stock > 0 ? `In Stock: (${stock})` : "Out of Stock"}
          </div>
        </div>
        <form onSubmit={handelAddToCart} className="product__form">
          <div className="product__quantity__and__option">
            <div className="product__quantity">
              <IconButton onClick={handelQuantityIncrement}>
                <AddCircleIcon />
              </IconButton>
              <div type="text" name="quantity" className="quantity__input">
                {quantity}
              </div>

              <IconButton onClick={handelQuantityDecrement}>
                <RemoveCircleIcon fontoption="medium" />
              </IconButton>
            </div>

            <div className="product option">
              <Box sx={{ minWidth: 100 }}>
                <FormControl fullWidth option="small">
                  <InputLabel>option</InputLabel>
                  <Select
                    value={option}
                    label="option"
                    onChange={handleoptionChange}
                  >
                    {props.item.item.option.map((option) => (
                      <MenuItem value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
          <div className="collect__item__actions">
            <div className="add__cart__add__wish">
              <div className="add__cart">
                <Button
                  variant="outlined"
                  option="large"
                  sx={[
                    {
                      "&:hover": {
                        backgroundColor: "#FFE26E",
                        borderColor: "#FFE26E",
                        borderWidth: "3px",
                        color: "black",
                      },
                      minWidth: 200,
                      borderColor: "black",
                      backgroundColor: "black",
                      color: "#FFE26E",
                      borderWidth: "3px",
                    },
                  ]}
                  onClick={handelAddToCart}
                >
                  ADD TO BAG
                </Button>
              </div>
              <div className="add__wish">
                <IconButton
                  variant="outlined"
                  option="large"
                  sx={[
                    {
                      "&:hover": {
                        backgroundColor: "#FFE26E",
                        borderColor: "#FFE26E",
                        borderWidth: "3px",
                        color: "black",
                      },
                      borderColor: "black",
                      backgroundColor: "black",
                      color: "#FFE26E",
                      borderWidth: "3px",
                    },
                  ]}
                  onClick={handelAddToWish}
                >
                  <FavoriteBorderIcon sx={{ width: "22px", height: "22px" }} />
                </IconButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Detail;
