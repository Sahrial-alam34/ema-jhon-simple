import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'
import { Link, useLoaderData } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [cart, setCart] = useState([])
    const { totalProducts } = useLoaderData();

    //const itemsPerPage = 10; //TODO make is dynamic

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // const pageNumbers = [];
    // for(let i = 1; i<= totalPages; i++){
    //     pageNumbers.push(i);
    // }

    const pageNumbers = [...Array(totalPages).keys()]


    //console.log(totalProducts);

    /**
     * For Pagination
     * Done:  1. Determine the total number of items:
     * TODO(temporary): 2. Decide on the number of items per page;
     * Done: 3. Calculate the total number of pages
     * 4. 
     */


    // useEffect(() => {
    //     fetch('http://localhost:5000/products')
    //         .then(res => res.json())
    //         .then(data => setProducts(data))
    // }, [])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:5000/products?page=${currentPage}&limit=${itemsPerPage}`);
            const data = await response.json();
            setProducts(data);
        }
        fetchData()
    }, [currentPage, itemsPerPage])


    useEffect(() => {
        // console.log('products',products);
        const storedCart = getShoppingCart();
        // console.log(storedCart);
        const ids = Object.keys(storedCart);

        fetch(`http://localhost:5000/productsByIds`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(ids)

        })
            .then(res => res.json())
            .then(cartProducts => {
                //console.log('only products in the shopping', cartProducts)
                const savedCart = [];

                // step 1 : get id
                for (const id in storedCart) {
                    //console.log(id);
                    // step2: get the product by using id
                    const addedProduct = cartProducts.find(product => product._id === id)
                    //console.log('added product',addedProduct);
                    if (addedProduct) {
                        // step 3: get quantity of product
                        const quantity = storedCart[id];
                        //console.log('quantity',quantity);
                        addedProduct.quantity = quantity;

                        // step 4:  add the added product to the saved cart
                        savedCart.push(addedProduct);

                    }
                    //console.log('added product',addedProduct);


                }
                // step 5:  set the cart
                setCart(savedCart);
            })


        // const savedCart = [];

        // // step 1 : get id
        // for (const id in storedCart) {
        //     //console.log(id);
        //     // step2: get the product by using id
        //     const addedProduct = products.find(product => product._id === id)
        //     //console.log('added product',addedProduct);
        //     if (addedProduct) {
        //         // step 3: get quantity of product
        //         const quantity = storedCart[id];
        //         //console.log('quantity',quantity);
        //         addedProduct.quantity = quantity;

        //         // step 4:  add the added product to the saved cart
        //         savedCart.push(addedProduct);

        //     }
        //     //console.log('added product',addedProduct);


        // }
        // // step 5:  set the cart
        // setCart(savedCart);
    // }, [products])
    }, [])

    const handleAddToCart = (product) => {
        // cart.push(product); not possible , immutable
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart , then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id)
            newCart = [...remaining, exists];

        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const options = [5, 10, 20]
    const handleSelectChange = event => {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(0);
    }
    return (
        <>
            <div className='shop-container'>
                <div className="products-container">
                    {
                        products.map(product => <Product
                            key={product._id}
                            product={product}
                            handleAddToCart={handleAddToCart}
                        ></Product>)
                    }
                </div>
                <div className="cart-container">
                    <Cart
                        cart={cart}
                        handleClearCart={handleClearCart}
                    >
                        {/* <div>From Shop</div> */}
                        <Link className='proceed-link' to="/orders">
                            <button className='btn-proceed'>Review Order  <FontAwesomeIcon icon={faArrowRight} /></button>

                        </Link>
                    </Cart>
                </div>

            </div>

            {/* pagination */}
            <div className='pagination'>
                {/* <p>Current Page: {currentPage} and Items per page: {itemsPerPage} </p> */}
                {
                    pageNumbers.map(number => <button
                        key={number}
                        className={currentPage === number ? "selected" : ''}
                        onClick={() => setCurrentPage(number)}
                    >{number + 1}
                    </button>)
                }

                <select value={itemsPerPage} onChange={handleSelectChange}>
                    {
                        options.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))
                    }
                </select>
            </div>
        </>
    );
};

export default Shop;