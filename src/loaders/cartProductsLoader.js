import { getShoppingCart } from "../utilities/fakedb";

const cartProductsLoader = async() =>{
    const loadedProducts = await fetch('products.json');
    const products = await loadedProducts.json();

    // if cart data is in database , you have to use async await

    const storedCart = getShoppingCart();
    const savedCart = [];
    console.log(storedCart);

    for(const id in storedCart){
        const addedProduct = products.find(pd => pd.id === id);
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