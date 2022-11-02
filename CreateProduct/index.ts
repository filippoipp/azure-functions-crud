import { Context, HttpRequest } from "@azure/functions"
import { disconnect, startConnection } from "../infra/database";
import Category from "../shared/entities/category";
import Product from "../shared/entities/product";
import handleError from "../shared/error/error";

export default async function (context: Context, req: HttpRequest) {
    try {
        await startConnection();

        const newProduct = req.body;

        if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
            context.log.error('Invalid input.', context.invocationId);
            return context.res = {
                status: 400,
                body: 'Invalid input.'
            };
        }

        const category = await Category.findOneBy({ id: newProduct.categoryId })

        if (!category) {
            context.log.error('Category not found.', context.invocationId);
            return context.res = {
                status: 404,
                body: 'Category not found.'
            }; 
        }
    
        const product = new Product();
        product.name = newProduct.name;
        product.price = newProduct.price;
        product.categoryId = newProduct.categoryId;
        await product.save();
    
        context.res = {
            status: 201,
            body: product
        };         
    } catch (error) {
        context.log("Creating product failure.");
        return handleError(500, error, context);
    } finally {
        await disconnect()
    }
}