import { Context, HttpRequest } from "@azure/functions"
import { disconnect, startConnection } from "../infra/database";
import Product from "../shared/entities/product";
import Category from "../shared/entities/category";
import handleError from "../shared/error/error";

export default async function (context: Context, req: HttpRequest) {
    try {
        await startConnection();

        const productId = req.params.id;
        const updatedProduct = req.body;

        if (!productId || !updatedProduct.name || !updatedProduct.price || !updatedProduct.categoryId) {
            context.log.error('Invalid input.', context.invocationId);
            return context.res = {
                status: 400,
                body: 'Invalid input.'
            };
        }


        const product = await Product.findOneBy({ id: productId })

        if (!product) {
            context.log.error('Product not found.', context.invocationId);
            return context.res = {
                status: 404,
                body: 'Product not found.'
            }; 
        }
    
        const category = await Category.findOneBy({ id: updatedProduct.categoryId })

        if (!category) {
            context.log.error('Category not found.', context.invocationId);
            return context.res = {
                status: 404,
                body: 'Category not found.'
            }; 
        }
        
        if (updatedProduct.name) product.name = updatedProduct.name;
        if (updatedProduct.price) product.price = updatedProduct.price;
        if (updatedProduct.categoryId) product.categoryId = updatedProduct.categoryId;
        await product.save()
    
        context.res = {
            status: 200,
            body: product
        };         
    } catch (error) {
        context.log("Update product failure.");
        return handleError(500, error, context);
    } finally {
        await disconnect();
    }
}