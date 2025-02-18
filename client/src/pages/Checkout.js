import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getUserCart,
    emptyCart,
    saveAddress,
    applyCoupon,
    createCashOrderForUser,
} from "../functions/user";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = ({ history }) => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState("Enter Shipping Address Here");
    const [addressSaveStatus, setAddressSaveStatus] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [disountError, setDisountError] = useState("");

    const dispatch = useDispatch();
    const { user, COD } = useSelector((state) => ({ ...state }));
    const couponTrueOrFalse = useSelector((state) => state.coupon);

    useEffect(() => {
        getUserCart(user.token).then((res) => {
            // console.log("User cart res", JSON.stringify(res.data, null, 4));
            setProducts(res.data.products);
            setTotal(res.data.cartTotal);
        });
    }, []);

    const saveAddressToDb = () => {
        saveAddress(user.token, address).then((res) => {
            if (res.data.ok) {
                setAddressSaveStatus(true);
                toast.success(`Shopping Address Saved Successfully!"`);
            }
        });
    };

    const clearCart = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
        }
        dispatch({
            type: "ADD_TO_CART",
            payload: [],
        });
        emptyCart(user.token).then((res) => {
            setProducts([]);
            setTotal(0);
            setTotalAfterDiscount(0);
            setCoupon("");
            toast.success(`Cart is cleared. Continue Shopping!"`);
        });
    };

    const showAddress = () => (
        <>
            <ReactQuill
                theme="snow"
                value={address}
                onChange={setAddress}
                className="mx-2"
                onFocus={() => setAddress("")}
            />
            <div className="d-grid gap-2 col-4 mx-auto">
                <button
                    className="btn btn-outline-primary mt-3"
                    onClick={saveAddressToDb}
                >
                    Confirm Address
                </button>
            </div>
        </>
    );

    const showProductSummury = () => {
        return products.map((p, i) => (
            <div key={i}>
                <p>
                    {p.product.title} x {p.count} = ৳{" "}
                    {p.product.price * p.count}
                </p>
            </div>
        ));
    };

    const applyDiscountCoupon = () => {
        // console.log("send coupon to backend", coupon);
        //appy coupon
        applyCoupon(user.token, coupon).then((res) => {
            // console.log("RES ON COUPON APPLIED", res.data);
            if (res.data) {
                setTotalAfterDiscount(res.data);

                //update reddux coupon applied true/false
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: true,
                });
            }
            if (res.data.err) {
                setDisountError(res.data.err);

                //update reddux coupon applied true/false
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false,
                });
            }
        });
    };

    const showApplyCoupon = () => (
        <>
            <input
                onChange={(e) => {
                    setCoupon(e.target.value);
                    setDisountError("");
                }}
                value={coupon}
                type="text"
                className="form-control text-center w-50 mx-auto"
                placeholder="Coupon Code"
            />
            <div className="d-grid gap-2 col-4 mx-auto">
                <button
                    onClick={applyDiscountCoupon}
                    className="btn btn-outline-primary mt-3 mx-auto w-50"
                >
                    Apply
                </button>
            </div>
        </>
    );

    const createCashOrder = () => {
        createCashOrderForUser(user.token, COD, couponTrueOrFalse).then(
            (res) => {
                // console.log("USER CASH PRDER CREATED RES", res);
                // empty cart from redux, local storage, reset coupon, COD, redirect
                if (res.data.ok) {
                    // empty local storage
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("cart");
                    }

                    // empty redux cart
                    dispatch({
                        type: "ADD_TO_CART",
                        payload: [],
                    });

                    // empty redux coupon
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: false,
                    });

                    // empty redux COD
                    dispatch({
                        type: "COD",
                        payload: false,
                    });

                    // empty cart from backend
                    emptyCart(user.token);

                    // redirect
                    setTimeout(() => {
                        history.push("/user/history");
                    }, 1000);
                }
            }
        );
    };

    return (
        <div className="row w-100">
            <div className="col-md-8">
                <h4 className="text-light text-center pt-3 pb-3 mb-0 jumbotron bg-secondary">
                    Shipping Address
                </h4>
                <br />
                <br />
                {showAddress()}
                <hr />
                <h4 className="text-light text-center pt-3 pb-3 mb-0 mt-3 jumbotron bg-secondary">
                    Have Coupon?
                </h4>
                <br />
                {showApplyCoupon()}
                {disountError && (
                    <p className="bg-danger text-light text-center w-25 mx-auto p-2 mt-3">
                        {disountError}
                    </p>
                )}
            </div>

            <div className="col-md-4">
                <h4 className="pt-3 jumbotron">Order Summary</h4>
                <hr />
                <p>
                    <strong>Products ({products.length})</strong>
                </p>
                {showProductSummury()}
                <hr />
                <div className="row">
                    <div className="col-md-6">
                        <div className="d-flex flex-row mt-2 mb-2">
                            <b>Total Amount:&nbsp;</b>
                            <b className="h6">৳&nbsp;</b>
                            {total}
                        </div>
                        {totalAfterDiscount > 0 && (
                            <div>
                                <div className="mb-1">
                                    <b className="text-light bg-primary p-1">
                                        Discount Applied!
                                    </b>
                                </div>
                                <b>Total Payable: </b>
                                <b className="text-primary mt-1 h5">
                                    <b className="h6">৳&nbsp;</b>
                                    {totalAfterDiscount}
                                </b>
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 my-auto">
                        {COD ? (
                            <button
                                className="btn btn-outline-primary w-75 my-auto"
                                disabled={
                                    !addressSaveStatus || !products.length
                                }
                                onClick={createCashOrder}
                            >
                                Place Order
                            </button>
                        ) : (
                            <button
                                className="btn btn-outline-primary w-75 my-auto"
                                disabled={
                                    !addressSaveStatus || !products.length
                                }
                                onClick={() => history.push("/payment")}
                            >
                                Place Order
                            </button>
                        )}
                    </div>
                </div>
                <hr />
                <div className="mx-auto row">
                    <button
                        disabled={!products.length}
                        onClick={clearCart}
                        className="btn btn-outline-danger w-75 m-auto"
                    >
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Checkout;
