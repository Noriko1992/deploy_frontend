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
      // 本番環境のAPI URLを直接記述
      const res = await fetch(`https://tech0-gen8-step4-pos-app-54.azurewebsites.net/product/${code}`);
      const data = await res.json();

      if (res.ok) {
        setProduct({ name: data.name, price: data.price });
      } else {
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
