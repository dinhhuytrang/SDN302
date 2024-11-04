import { useParams } from "react-router-dom";
import Search from "../components/Search";
import Header from "../components/Header/Header";

const SearchView = () => {
    const param = useParams()
    console.log(param.query)
    return (
        <div>
            <Header />
            <Search />
        </div>
    );
}

export default SearchView;