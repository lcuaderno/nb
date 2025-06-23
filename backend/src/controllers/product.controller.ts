import { Request, Response } from 'express';
import { ProductService, NotFoundError, ValidationError, DatabaseError } from '../services/product.service';
import { ProductSchema } from '../models/product';
import { ZodError } from 'zod';

const productService = new ProductService();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    let cursor: { createdAt: string } | undefined = undefined;
    if (req.query.cursorCreatedAt) {
      cursor = {
        createdAt: req.query.cursorCreatedAt as string,
      };
    }
    const result = await productService.list({ limit, cursor });
    res.json(result);
  } catch (error) {
    if (error instanceof DatabaseError) {
      res.status(503).json({ message: error.message, error: 'Internal Server Error' });
    } else {
      res.status(500).json({ message: (error as Error).message, error: 'Internal Server Error' });
    }
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.get(req.params.id);
    res.json(product);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message, error: 'Not Found', statusCode: 404 });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message, error: 'Bad Request', statusCode: 400 });
    } else if (error instanceof DatabaseError) {
      res.status(503).json({ message: error.message, error: 'Internal Server Error' });
    } else {
      res.status(500).json({ message: (error as Error).message, error: 'Internal Server Error' });
    }
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message, error: 'Bad Request', statusCode: 400 });
    } else if (error instanceof DatabaseError) {
      res.status(503).json({ message: error.message, error: 'Internal Server Error' });
    } else {
      res.status(500).json({ message: (error as Error).message, error: 'Internal Server Error' });
    }
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message, error: 'Not Found', statusCode: 404 });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message, error: 'Bad Request', statusCode: 400 });
    } else if (error instanceof DatabaseError) {
      res.status(503).json({ message: error.message, error: 'Internal Server Error' });
    } else {
      res.status(500).json({ message: (error as Error).message, error: 'Internal Server Error' });
    }
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.delete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message, error: 'Not Found', statusCode: 404 });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message, error: 'Bad Request', statusCode: 400 });
    } else if (error instanceof DatabaseError) {
      res.status(503).json({ message: error.message, error: 'Internal Server Error' });
    } else {
      res.status(500).json({ message: (error as Error).message, error: 'Internal Server Error' });
    }
  }
};

export const recoverProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.recover(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message, error: 'Not Found', statusCode: 404 });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message, error: 'Bad Request', statusCode: 400 });
    } else if (error instanceof DatabaseError) {
      res.status(503).json({ message: error.message, error: 'Internal Server Error' });
    } else {
      res.status(500).json({ message: (error as Error).message, error: 'Internal Server Error' });
    }
  }
}; 