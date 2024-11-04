import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from '../routes/Home';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ManageAccount from '../components/Account/ManageAccount/ManageAccount';
import MyAccount from '../components/Account/MyAccount/MyAccount';
import Shop from '../components/Shop/Shop';
import ItemView from '../routes/ItemView';
import CategoryView from '../routes/CategoryView';
import SearchView from '../routes/Search';
import CartItemsProvider from '../Context/CartItemsProvider';
import Login from '../components/Authentication/Login/Login';
import Register from '../components/Authentication/Register/Register';
import ResetPassword from '../components/Authentication/ResetPassword/ResetPassword';
import ChangePasswordScreen from '../components/Authentication/ChangePassword/ChangePassword';
import Wishlist from '../components/Wishlist';
import WishItemsProvider from '../Context/WishItemsProvider';
// import DrawerNav from '../components/Nav/DrawerNav/DrawerNav';
import Checkout from '../components/Checkout/Checkout';
import SearchProvider from '../Context/SearchProvider';
import Overview from '../adminPage/component/Overview';
import ListUser from '../adminPage/component/ListUser';
import Categories from '../adminPage/component/Categories';
import OrderAdmin from '../adminPage/component/OrderAdmin';
import AddProductPage from '../adminPage/Whitehouse/AddNewWhitehouse';
import ViewDetailWhiteHouse from '../adminPage/Whitehouse/ViewDetailWhiteHouse';
import NewProduct from '../adminPage/products/AddProduct';
import ListWareHouse from '../adminPage/Whitehouse/WareHouseList';
import UpdateWareHouse from '../adminPage/Whitehouse/UpdateWareHouse';
import PurchaseOrder from '../components/PurchaseOrder/PurchaseOrder';
import ProductAdmin from '../adminPage/component/ProductAdmin';
import UpdateProduct from '../adminPage/products/UpdateProduct';



function App() {

  return (
    <CartItemsProvider>
      <WishItemsProvider>
        <SearchProvider>
          <Router >
            <Header />
            <Routes>
              <Route index element={<Home />} />
              <Route path="/account">
                <Route path="me" element={<MyAccount />} />
                <Route path="manage" element={<ManageAccount />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="resetpassword" element={<ResetPassword />} />
                <Route path="changepw" element={<ChangePasswordScreen />} />
                <Route path="*" element={<Login />} />
              </Route>
              <Route path='purchaseOrder' element={<PurchaseOrder/>}/>
              <Route path="/shop" element={<Shop />} />
              <Route path="/category">
                <Route path=":id" element={<CategoryView />} />
              </Route>
              <Route path="/item">
                <Route path="/item/men">
                  <Route path=":id" element={<ItemView />} />
                </Route>
                <Route path="/item/women">
                  <Route path=":id" element={<ItemView />} />
                </Route>
                <Route path="/item/kids">
                  <Route path=":id" element={<ItemView />} />
                </Route>
                <Route path="/item/featured">
                  <Route path=":id" element={<ItemView />} />
                </Route>
              </Route>
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/search/*" element={<SearchView />} />
              <Route path="/checkout" element={<Checkout />} />

              <Route path="/admin" element={<Overview />} />

              <Route path="/admin/overview" element={<Overview />} />
              <Route path="/admin/accounts" element={<ListUser />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/products" element={<ProductAdmin />} />
              <Route path="/admin/products/:id" element={<UpdateProduct/>} />
              <Route path="/admin/orders" element={<OrderAdmin />} />
              <Route path="/admin/add-product" element={<NewProduct />} />
              <Route path="/admin/warehouse" element={<ListWareHouse />} />
              <Route path="/admin/warehouse/addnew" element={<AddProductPage />} />
              <Route path="/admin/warehouse/detail/:id" element={<ViewDetailWhiteHouse />} />
              <Route path="/admin/warehouse/update/:id" element={<UpdateWareHouse />} />
            </Routes>
            <Footer />
          </Router>

        </SearchProvider>
      </WishItemsProvider>
    </CartItemsProvider>
  );
}

export default App;