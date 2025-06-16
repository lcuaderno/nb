import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductSchema } from '../models/product';
import { ZodError } from 'zod';

const productService = new ProductService();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.list();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, error: 'Internal Server Error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.get(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message, error: 'Not Found', statusCode: 404 });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message, error: 'Bad Request', statusCode: 400 });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message, error: 'Not Found', statusCode: 404 });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.delete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: (error as Error).message, error: 'Not Found', statusCode: 404 });
  }
}; 