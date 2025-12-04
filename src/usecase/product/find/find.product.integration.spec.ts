import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Test find product use case", () => {
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

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const findProductUseCase = new FindProductUseCase(productRepository);

    const createProductInput = {
      name: "Product 1",
      price: 100,
    };

    const persistedProduct = await createProductUseCase.execute(createProductInput);

    const input = {
      id: persistedProduct.id,
    };

    const result = await findProductUseCase.execute(input);

    expect(result).toEqual(persistedProduct);
  });
}); 