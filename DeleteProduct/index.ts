import { Context, HttpRequest } from "@azure/functions"
import { disconnect, startConnection } from "../infra/database";
import Product from "../shared/entities/product";
import handleError from "../shared/error/error";

export default async function (context: Context, req: HttpRequest) {
    try {
        await startConnection();

        const productId = req.params.id;

        if (!productId) { 
            context.log.error('Invalid input.', context.invocationId);
            return context.res = {
                status: 400,
                body: 'Invalid input.'
            };
        }
    
        const product = await Product.findOneBy({ id: productId })

        if (!product) {
            context.res = {
                status: 404
            };
            context.log.error('Product not found.', context.invocationId);  
        }

        await product.remove();
    
        context.res = {
            status: 204,
            body: null
        };         
    } catch (error) {
        context.log("Deleting product failure.");
        return handleError(500, error, context);
    } finally {
        await disconnect()
    }
}