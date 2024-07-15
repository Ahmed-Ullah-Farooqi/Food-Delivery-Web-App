
'use client'
import { useState, useEffect } from "react"
import CustomerHeader from "../_components/CustomerHeader"
import Footer from "../_components/Footer"
import { DELIVERY_CHARGES, TAX } from "../lib/constant"
import { useRouter } from "next/navigation"

const Page = () => {
    const [cartStorage, setCartStorage] = useState([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Check if we are in the browser
        if (typeof window !== 'undefined') {
            // Retrieve cart data from local storage
            const cartData = JSON.parse(localStorage.getItem('cart')) || [];
            if (cartData.length > 0) {
                setCartStorage(cartData);
                // Calculate total price
                const calculatedTotal = cartData.reduce((acc, item) => acc + item.price, 0);
                setTotal(calculatedTotal);
            }
        }
    }, []);

    useEffect(() => {
        console.log(total);
    }, [total]);

    const orderNow = () => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                router.push('/order');
            } else {
                router.push('/user-auth?order=true');
            }
        }
    }

    const removeFromCart = (id) => {
        if (typeof window !== 'undefined') {
            // Remove item from cartStorage
            const updatedCart = cartStorage.filter(item => item._id !== id);
            setCartStorage(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            // Recalculate total
            const updatedTotal = updatedCart.reduce((acc, item) => acc + item.price, 0);
            setTotal(updatedTotal);
        }
    }

    return (
        <div>
            <CustomerHeader />
            <div className="food-list-wrapper">
                {
                    cartStorage.length > 0 ? cartStorage.map((item) => (
                        <div key={item._id} className="list-item">
                            <div className="list-item-block-1"><img style={{ width: 100 }} src={item.img_path} alt={item.name} /></div>
                            <div className="list-item-block-2">
                                <div>{item.name}</div>
                                <div className="description">{item.description}</div>
                                <button onClick={() => removeFromCart(item._id)} >Remove From Cart</button>
                            </div>
                            <div className="list-item-block-3">Price: {item.price}</div>
                        </div>
                    )) : <h1>No Food Items for this Restaurant</h1>
                }
            </div>
            <div className="total-wrapper">
                <div className="block-1">
                    <div className="row">
                        <span>Food Charges : </span>
                        <span>{total}</span>
                    </div>
                    <div className="row">
                        <span>Tax : </span>
                        <span>{(total * TAX / 100).toFixed(2)}</span>
                    </div>
                    <div className="row">
                        <span>Delivery Charges  : </span>
                        <span>{DELIVERY_CHARGES}</span>
                    </div>
                    <div className="row">
                        <span>Total Amount : </span>
                        <span>{(total + DELIVERY_CHARGES + (total * TAX / 100)).toFixed(2)}</span>
                    </div>
                </div>
                <div className="block-2">
                    <button onClick={orderNow} >Order Now</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Page
