import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import ListProductUseCase from "./list.product.usecase";


describe("Test list product use case", () => {
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

  it("should list all products", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const listProductUseCase = new ListProductUseCase(productRepository);

    const product1Input = {
      name: "Product 1",
      price: 100,
    };

    const product2Input = {
      name: "Product 2",
      price: 200,
    };

    const persistedProduct1 = await createProductUseCase.execute(product1Input);
    const persistedProduct2 = await createProductUseCase.execute(product2Input);

    const result = await listProductUseCase.execute({});

    expect(result.products.length).toBe(2);
    expect(result.products).toContainEqual(persistedProduct1);
    expect(result.products).toContainEqual(persistedProduct2);
  });
});