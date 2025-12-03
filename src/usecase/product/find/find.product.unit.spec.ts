import { v4 as uuid } from "uuid";
import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product(uuid(), "Product Name", 100);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit Test find product use case", () => {

    it("should find a product", async () => {
        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: product.id,
        };

        const output = {
            id: product.id,
            name: product.name,
            price: product.price,
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });

    it("should not find a product", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });
        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: "456",
        };

        expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("Product not found");
    });

});