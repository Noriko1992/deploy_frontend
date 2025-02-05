import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setProduct(null);
  
    try {
      const res = await fetch(`http://localhost:8000/product/${code}`);
      const data = await res.json();
  
      if (res.ok) {
        // APIが200 OKなら商品情報をセット
        setProduct({ name: data.name, price: data.price });
      } else {
        // APIが404 Not Foundならエラーメッセージを表示
        setError('商品が見つかりませんでした');
      }
    } catch (err) {
      console.error('エラー:', err);
      setError('APIとの通信に失敗しました');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>POSシステム</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="商品コードを入力"
          required
        />
        <button type="submit">コードを読み込む</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {product && (
        <div>
          <h2>商品情報</h2>
          <p>商品名: {product.name}</p>
          <p>単価: ¥{product.price}</p>
        </div>
      )}
    </div>
  );
}