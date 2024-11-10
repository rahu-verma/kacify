import styled from "styled-components";

const Products = () => {
  const products: {
    id: string;
    name: string;
    price: number;
    image: string;
  }[] = [
    {
      id: "1",
      name: "iPhone 15 Thug White Case",
      price: 25,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/Sc2902d3259014ded9afc848e74582f03O.jpg_640x640.jpg_.webp",
    },
    {
      id: "2",
      name: "iPhone 15 Thug Black Case",
      price: 30,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/S20d637b6e8274df6b19db5fea45a6fcbL.jpg_640x640.jpg_.webp",
    },
    {
      id: "3",
      name: "iPhone 15 Duck Clouds Case",
      price: 35,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/S08e8d8d7962043c0863b045ca092c11b2/Cute-Cartoon-Duck-Phone-Case-for-iPhone-15-14-13-12-11-Pro-Max-Mini-X.jpg_.webp",
    },
    {
      id: "4",
      name: "iPhone 15 Duck Sleeping Case",
      price: 40,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/S6669f9ae397040d380003ba0a30b43755.jpg_640x640.jpg_.webp",
    }
  ];

  return (
    <Container>
      {products.map((product) => (
        <Card key={product.id}>
          <ProductImage src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </Card>
      ))}
    </Container>
  );
};

export default Products;

const Container = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ProductImage = styled.img`
  width: 320px;
  height: 300px;
`;

const Card = styled.div<{ height: number; width: number }>`
  display: flex;
  width: 320px;
  height: 400px;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  flex-direction: column;
`;
