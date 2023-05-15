import { getShoppingCart } from "../utilities/fakedb";

const cartProductsLoader = async() =>{
    
    // if cart data is in database , you have to use async await

    const storedCart = getShoppingCart();
    console.log(storedCart);
    const ids = Object.keys(storedCart);
    //const loadedProducts = await fetch(`http://localhost:5000/products?page=0&limit=1000`);
    const loadedProducts = await fetch(`http://localhost:5000/productsByIds`,{
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(ids)

    });
    const products = await loadedProducts.json();
    console.log('products by id', products)
    const savedCart = [];
    console.log(storedCart);

    for(const id in storedCart){
        const addedProduct = products.find(pd => pd._id === id);
        if( addedProduct){
            const quantity = storedCart[id];
            addedProduct.quantity=  quantity;
            savedCart.push(addedProduct);
        }
    }

    // if you need to send to two things
    // return [savedCart,product];
    //another options
    // return {product, savedCart}


    // console.log(products);
    // return products;
    return savedCart;
}

export default cartProductsLoader;