import React from "react";
import { Card, Tabs } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import defaultCoverImage from "../../images/defaultCoverImage.png";
import ProductListItems from "./ProductListItems";
import Rating from "react-star-ratings";

const { TabPane } = Tabs;

const SingleProduct = ({ product }) => {
    const { title, images, description, _id } = product;

    return (
        <>
            <div className="col-md-7">
                {images && images.length ? (
                    <Carousel showArrows={true} autoPlay infiniteLoop>
                        {images &&
                            images.map((image) => (
                                <img src={image.url} key={image.public_id} />
                            ))}
                    </Carousel>
                ) : (
                    <Card
                        cover={
                            <img
                                src={defaultCoverImage}
                                className="mb-3 card-image"
                            />
                        }
                    ></Card>
                )}

                <Tabs type="card">
                    <TabPane tab="Description" key="1">
                        {description && description}
                    </TabPane>

                    <TabPane tab="More" key="2">
                        More
                    </TabPane>
                </Tabs>
            </div>

            <div className="col-md-5">
                <h2 className="bg-secondary text-light p-3">{title}</h2>
                <Card
                    actions={[
                        <>
                            <ShoppingCartOutlined
                                style={{ fontSize: "25px" }}
                                className="text-danger"
                            />
                            <br />
                            <p className="h6 small mt-1">Add to Cart</p>
                        </>,
                        <Link to="/">
                            <HeartOutlined
                                style={{ fontSize: "21px" }}
                                className="text-success"
                            />
                            <br />
                            <p className="h6 small mt-1">Add to WishList</p>
                        </Link>,
                    ]}
                >
                    <ProductListItems product={product} />
                    <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                            Rating
                            <span className="label label-default label-pill pull-xs-right">
                                <Rating
                                    name={_id}
                                    numberOfStars={5}
                                    rating={4}
                                    isSelectable={true}
                                    starRatedColor="red"
                                    // changeRating = {(givenRating, name)=>()}
                                />
                            </span>
                        </li>
                    </ul>
                </Card>
            </div>
        </>
    );
};

export default SingleProduct;
