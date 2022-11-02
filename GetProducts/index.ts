import { Context, HttpRequest } from "@azure/functions"
import { disconnect, startConnection } from "../infra/database";
import Product from "../shared/entities/product";
import handleError from "../shared/error/error";

export default async function (context: Context, req: HttpRequest) {
    try {
        await startConnection();

        const products = await Product.find({ relations: ['category'] })

        if (!products) {
            context.res = {
                status: 404
            };
            context.log.error('Products not found.', context.invocationId);  
        }
    
        context.res = {
            status: 200,
            body: products
        };         
    } catch (error) {
        context.log("Get products failure.");
        return handleError(500, error, context);
    } finally {
        await disconnect();
    }
}