import express, { Request, Response } from "express";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import ProductPresenter from "../presenters/product.presenter";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);
    try {
        const id = req.body.id;
        const name = req.body.name;
        const price = req.body.price;

        const output = await usecase.execute({ id, name, price });
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }

});

productRoute.get("/", async (req: Request, res: Response) => {
  const usecase = new ListProductUseCase(new ProductRepository());
  const output = await usecase.execute({});

  res.format({
    json: async () => res.send(output),
    xml: async () => res.send(ProductPresenter.listXML(output)),
  });
});