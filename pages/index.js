import { useState, useEffect } from "react";

export default function POSApp() {
    const [code, setCode] = useState("");
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
        throw new Error("環境変数 NEXT_PUBLIC_API_URL が設定されていません");
    }

    console.log("環境変数 NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);


    const fetchProduct = async () => {
        try {
            const res = await fetch(`${API_URL}/product/${code}`, { method: "GET" });
            
            if (!res.ok) {
                if (res.status === 404) {
                throw new Error("商品が見つかりません");
            }
            throw new Error(`エラーが発生しました: ${res.status}`);
        }
            const data = await res.json(); 
            setProduct(data.product);
        } catch (error) {
            console.error("APIエラー:", error);
        alert("商品情報の取得に失敗しました。ネットワーク接続を確認してください。");
    }
};

    const addToCart = () => {
        if (product) {
            setCart((prevCart) => {
                const updatedCart = [...prevCart, { ...product, quantity: 1 }];
                setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
                return updatedCart;
            });
            setProduct(null);
            setCode("");
        }
    };

    const updateQuantity = (index, newQuantity) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            updatedCart[index].quantity = newQuantity;
            setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
            return updatedCart;
        });
    };

    const removeFromCart = (index) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((_, i) => i !== index);
            setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
            return updatedCart;
        });
    };

    const handlePurchase = async () => {
        try {
            const res = await fetch(`${API_URL}/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cart, total })  // カートの内容と合計金額を送信
            });

            if (!res.ok) {
                throw new Error(`エラーが発生しました: ${res.status}`);
            }

            const data = await res.json();
            alert(`購入完了: 取引ID: ${data.trd_id}, 合計金額: ${data.total_amt}円`);
            setCart([]);
            setTotal(0);
        } catch (error) {
            alert(error.message);
        }
    };
}
