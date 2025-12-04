import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";


describe("Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const createProductInput = {
      name: "Product 1",
      price: 100,
    };

    const persistedProduct = await createProductUseCase.execute(createProductInput);

    const updateProductInput = {
      id: persistedProduct.id,
      name: "Updated Product",
      price: 150,
    };

    const result = await updateProductUseCase.execute(updateProductInput);

    expect(result).toEqual({
      id: persistedProduct.id,
      name: "Updated Product",
      price: 150,
    });

    const updatedProduct = await productRepository.find(persistedProduct.id);

    expect(updatedProduct.name).toBe("Updated Product");
    expect(updatedProduct.price).toBe(150);
  });
});