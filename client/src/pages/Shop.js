import React, { useState, useEffect } from "react";
import { getProductByCount, fetchProductsByFilter } from "../functions/product";
import { useSelector, useDispatch } from "react-redux";
import UserProductCard from "../components/cards/UserProductCard";
import { Menu, Slider, Checkbox, Radio } from "antd";
import { getAllCategories } from "../functions/category";
import { getAllSubCategories } from "../functions/sub-category";
import Star from "../components/forms/Star";
import { changeConfirmLocale } from "antd/lib/modal/locale";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);
    const [okay, setOkay] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [star, setStar] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [brands, setBrands] = useState([
        "ACI Limited",
        "ACME Laboratories Ltd.",
        "Al-Madina Pharmaceuticals Ltd.",
        "Beximco Pharmaceuticals Ltd.",
        "Bengal drugs Ltd.",
        "BioRx",
        "Globe Pharmaceuticals Ltd.",
        "Ibn Sina Pharmaceuticals Ltd.",
        "Square Pharmaceuticals Ltd.",
    ]);
    const [brand, setBrand] = useState("");
    const [shipping, setShipping] = useState("");

    let dispatch = useDispatch();
    let { search } = useSelector((state) => ({ ...state }));
    const { text } = search;

    useEffect(() => {
        loadAllProducts();

        //fetch categories
        getAllCategories().then((res) => setCategories(res.data));

        //fetch sub-categories
        getAllSubCategories().then((res) => setSubCategories(res.data));
    }, []);

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg).then((res) => {
            setProducts(res.data);
        });
    };

    // load products by Default on Laod
    const loadAllProducts = () => {
        setLoading(true);
        getProductByCount(12)
            .then((res) => {
                //console.log(res.data)
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                // console.log(err);
                setLoading(false);
            });
    };

    // load products on user Search input
    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({ query: text });
            if (!text) {
                loadAllProducts();
            }
        }, 300);
        return () => clearTimeout(delayed);
    }, [text]);

    // load products on Price Range
    useEffect(() => {
        fetchProducts({ price });
    }, [okay]);

    const handlePriceSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setCategoryIds([]);
        setStar("");
        setSubCategory("");
        setBrand("");
        setShipping("");

        setPrice(value);
        setTimeout(() => {
            setOkay(!okay);
        }, 300);
    };

    // Load products base on Category
    // showing categories ina a list of checkbox
    const showCategories = () =>
        categories.map((cat) => (
            <div key={cat._id}>
                <Checkbox
                    onChange={handleCheckCategory}
                    className="pb-2 pl-4 pr-4"
                    value={cat._id}
                    name="category"
                    checked={categoryIds.includes(cat._id)}
                >
                    {cat.name}
                    <br />
                </Checkbox>
            </div>
        ));

    // Handle ccheck for Categories
    const handleCheckCategory = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setStar("");
        setSubCategory("");
        setBrand("");
        setShipping("");

        // console.log(e.target.value);
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked);

        //removes duplicate ids from states
        //if not found returns -1 else returns index
        if (foundInTheState === -1) {
            let justChecked = e.target.value;
            inTheState.push(justChecked);
        } else {
            // pull out the item
            inTheState.splice(foundInTheState, 1);
        }

        setCategoryIds(inTheState);
        fetchProducts({ category: inTheState });
    };

    //show products by Star Ratings
    const showStars = () => (
        <div className="pr-4 pl-4 pb-2">
            <Star starClick={handleStarClick} numberOfStars={5} />
            <Star starClick={handleStarClick} numberOfStars={4} />
            <Star starClick={handleStarClick} numberOfStars={3} />
            <Star starClick={handleStarClick} numberOfStars={2} />
            <Star starClick={handleStarClick} numberOfStars={1} />
        </div>
    );

    const handleStarClick = (num) => {
        // console.log(num);
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setSubCategory("");
        setBrand("");
        setShipping("");

        setStar(num);
        fetchProducts({ stars: num });
    };

    //show products by Sub Categories
    const showSubCategories = () =>
        subCategories.map((sub) => (
            <div
                key={sub._id}
                onClick={() => handleSubCategory(sub)}
                className="p-1 m-1 badge bg-secondary"
                style={{ cursor: "pointer" }}
            >
                {sub.name}
            </div>
        ));

    const handleSubCategory = (sub) => {
        // console.log("SUB ", sub);
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar("");
        setBrand("");
        setShipping("");

        setSubCategory(sub);
        fetchProducts({ subCategory: sub });
    };

    //show products based on Brands
    const showBrands = () =>
        brands.map((brnd) => (
            <>
                <Radio
                    key={brnd}
                    value={brnd}
                    name={brnd}
                    checked={brnd === brand}
                    onChange={handleBrand}
                    className="pb-1 pl-4 pr-4"
                >
                    {brnd}
                </Radio>

                <br />
            </>
        ));

    const handleBrand = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar("");
        setSubCategory("");
        setShipping("");

        setBrand(e.target.value);
        fetchProducts({ brand: e.target.value });
    };

    //show products based on shipping
    const showShipping = () => (
        <>
            <Checkbox
                onChange={handleCheckShipping}
                className="pb-2 pl-4 pr-4"
                value="Yes"
                checked={shipping === "Yes"}
            >
                Yes
            </Checkbox>

            <br />

            <Checkbox
                onChange={handleCheckShipping}
                className="pb-2 pl-4 pr-8"
                value="No"
                checked={shipping === "No"}
            >
                No
            </Checkbox>
        </>
    );

    const handleCheckShipping = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar("");
        setSubCategory("");
        setBrand("");

        setShipping(e.target.value);
        fetchProducts({ shipping: e.target.value });
    };

    return (
        <div className="container.fluid">
            <div className="row w-100">
                <div className="col-md-3">
                    <h4 className="text-center pt-2 pb-2 mt-3 mb-3 jumbotron">
                        Search
                    </h4>
                    <Menu
                        defaultOpenKeys={["1", "2", "3", "4", "5", "6"]}
                        mode="inline"
                    >
                        {/* Price */}
                        <Menu.SubMenu
                            key="1"
                            title={
                                <span className="h6 small">Price Range</span>
                            }
                        >
                            <div>
                                <Slider
                                    tipFormatter={(val) => `৳${val}`}
                                    range
                                    value={price}
                                    onChange={handlePriceSlider}
                                    max="3000"
                                    style={{
                                        marginLeft: "30px",
                                        marginRight: "30px",
                                    }}
                                />
                            </div>
                        </Menu.SubMenu>

                        {/* Categories */}
                        <Menu.SubMenu
                            key="2"
                            title={<span className="h6 small">Categories</span>}
                        >
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "22px",
                                }}
                            >
                                {showCategories()}
                            </div>
                        </Menu.SubMenu>

                        {/* Star Rating */}
                        <Menu.SubMenu
                            key="3"
                            title={<span className="h6 small">Rating</span>}
                        >
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "22px",
                                }}
                            >
                                {showStars()}
                            </div>
                        </Menu.SubMenu>

                        {/* Sub-Categories */}
                        <Menu.SubMenu
                            key="4"
                            title={
                                <span className="h6 small">Sub Categories</span>
                            }
                        >
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "22px",
                                }}
                            >
                                {showSubCategories()}
                            </div>
                        </Menu.SubMenu>

                        {/* Brands */}
                        <Menu.SubMenu
                            key="5"
                            title={<span className="h6 small">Brands</span>}
                        >
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "22px",
                                }}
                            >
                                {showBrands()}
                            </div>
                        </Menu.SubMenu>

                        {/* Shipping */}
                        <Menu.SubMenu
                            key="6"
                            title={<span className="h6 small">Shipping</span>}
                        >
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "22px",
                                }}
                            >
                                {showShipping()}
                            </div>
                        </Menu.SubMenu>
                    </Menu>
                </div>
                <div className="col-md-9">
                    {loading ? (
                        <h4 className="ml-auto text-primary">Loading.....</h4>
                    ) : (
                        <h3 className="text-light text-center pt-2 pb-3 mt-3 mb-3 jumbotron bg-secondary">
                            Products
                        </h3>
                    )}
                    {products.length < 1 && (
                        <p className="text-center">No Products Found!</p>
                    )}
                    <div className="row">
                        {products.map((pr) => (
                            <div key={pr._id} className="col-md-4 mb-2">
                                <UserProductCard product={pr} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
