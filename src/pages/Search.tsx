import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import ProductCard from "../components/productCard";
import {
  useCategoriesQuery,
  useSearchProductQuery,
} from "../redux/api/productApi";
import { addToCart } from "../redux/reducer/cartReducer";
import { CustomError } from "../types/api-types";
import { CartItem } from "../types/types";

const Search = () => {
  const dispatch = useDispatch();
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");
  console.log(categoriesResponse);

  if (isError) toast.error((error as CustomError).data.message);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  console.log(searchedData);

  const addtoCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };
  const isNextPage = true;
  const isPevPage = true;
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={100} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>

            <option value="desc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select value={100} onChange={(e) => setCategory(e.target.value)}>
            <option value="">ALL</option>

            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i.toUpperCase()}>
                  {i}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder=" Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="search-product-list">
          {searchedData?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addtoCartHandler}
              photo={i.photo}
            />
          ))}
        </div>
        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {4}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
