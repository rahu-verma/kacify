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
      name: "Thug",
      price: 25,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/Sc2902d3259014ded9afc848e74582f03O.jpg_640x640.jpg_.webp",
    },
    {
      id: "2",
      name: "Duck",
      price: 35,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/S08e8d8d7962043c0863b045ca092c11b2/Cute-Cartoon-Duck-Phone-Case-for-iPhone-15-14-13-12-11-Pro-Max-Mini-X.jpg_.webp",
    },
    {
      id: "3",
      name: "Marvel",
      price: 40,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/Sbcd33a57920c4606bf9ba892dfa23e91F/Marvel-Groot-Deadpool-Cover-Phone-Case-for-Apple-iPhone-15-Pro-Max-16-Pro-14-Pro.jpg_.webp",
    },
    {
      id: "4",
      name: "Box man",
      price: 30,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/S4b3d69f88a7d48bab37850f6cba0bf86F/Cartoon-Box-Man-Pattern-Plating-Phone-Case-for-iPhone-16-15-14-13-12-11-Pro.jpg_.webp",
    },
    {
      id: "5",
      name: "Monster pixel",
      price: 20,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/Sb852e68dbffb49fa8775fcfcf44c16dbo/Green-Pixel-Monster-Cartoon-Phone-Case-for-IPHONE-16-15PRO-MAX-14-13-12-11-PRO.jpg_.webp",
    },
    {
      id: "6",
      name: "Bear",
      price: 25,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/S6010c8742a0a43df86be8bed8a51918aI.jpg_640x640.jpg_.webp",
    },
    {
      id: "7",
      name: "Wolverine",
      price: 35,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/Sb4597df6040940608731ddfe440d129dD/Marvel-Deadpool-And-Wolverine-Clear-Matte-Phone-Case-for-Apple-iPhone-16-15-14-13-12.jpg_.webp",
    },
    {
      id: "8",
      name: "Spiderman",
      price: 40,
      image:
        "https://ae-pic-a1.aliexpress-media.com/kf/Sbef20b5fffd54cbea8261ee44953d9b4m.jpg_640x640.jpg_.webp",
    },
  ];

  return (
    <Container>
      {products.map((product) => (
        <Card key={product.id}>
          <ProductImage src={product.image} alt={product.name} />
          <ProductDetailsContainer>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>${product.price}</ProductPrice>
          </ProductDetailsContainer>
        </Card>
      ))}
    </Container>
  );
};

export default Products;

const Container = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ProductImage = styled.img`
  width: 320px;
  height: 300px;
  border-bottom: 1px solid #d1c0a6;
`;

const Card = styled.div`
  display: flex;
  width: 320px;
  box-shadow: 1px 2px 8px hsl(0deg 0% 0% / 0.25);
  border-radius: 15px;
  flex-direction: column;
  overflow: hidden;
`;

const ProductDetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProductName = styled.h3`
  text-transform: uppercase;
  font-size: 25px;
  padding: 0px 10px;
`;

const ProductPrice = styled.p`
  font-size: 30px;
  border-left: 1px solid #d1c0a6;
  padding: 10px 10px;
`;
