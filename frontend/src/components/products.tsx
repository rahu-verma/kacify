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
      name: "Deadpool",
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
    <div className="flex flex-wrap gap-5 justify-between ">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col w-80 shadow-md rounded-lg overflow-hidden border-[0.5px] border-primary-light cursor-pointer hover:opacity-50"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-80 h-72 border-b-[0.5px] border-primary-light"
          />
          <div className="flex justify-between items-center p-2">
            <h3 className="uppercase text-2xl font-bold">{product.name}</h3>
            <p className="text-2xl font-bold border-l-[0.5px] border-primary-light pl-3">
              ${product.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;