import supertest from "supertest";
import app from "../../app";
import Product from "../../models/product";

describe("/product/", () => {
  it("products exist", async () => {
    await Product.deleteMany({});
    await Product.create({ name: "product1", price: 100, image: "image1" });
    const response = await supertest(app).get("/product/");
    expect(response.body).toEqual({
      success: true,
      code: "success",
      message: "success",
      status: 200,
      data: {
        products: [
          {
            _id: expect.any(String),
            name: "product1",
            price: 100,
            image: "image1",
          },
        ],
      },
    });
  });
  it("products not exist", async () => {
    await Product.deleteMany({});
    const response = await supertest(app).get("/product/");
    expect(response.body).toEqual({
      success: true,
      code: "success",
      message: "success",
      status: 200,
      data: {
        products: [],
      },
    });
  });
});
