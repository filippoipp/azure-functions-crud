import { Context, HttpRequest } from "@azure/functions"
import { disconnect, startConnection } from "../infra/database";
import Category from "../shared/entities/category";
import Product from "../shared/entities/product";
import handleError from "../shared/error/error";

export default async function (context: Context, req: HttpRequest) {
    try {
        await startConnection();

        const categoryId = req.params.id;

        if (!categoryId) { 
            context.log.error('Invalid input.', context.invocationId);
            return context.res = {
                status: 400,
                body: 'Invalid input.'
            };
        }
    
        const category = await Category.findOneBy({ id: categoryId })

        if (!category) {
            
            context.log.error('Category not found.', context.invocationId);  
            return context.res = {
                status: 404,
                body: 'Category not found.'
            };
        }


        const products = await Product.findBy({ categoryId })

        if (products.length) { 
            context.log.error('This category has products.', context.invocationId);  
            return context.res = {
                status: 400,
                body: 'This category has products.'
            };
        }

        await category.remove();
    
        context.res = {
            status: 204,
            body: null
        };         
    } catch (error) {
        context.log("Deleting category failure.");
        return handleError(500, error, context);
    } finally {
        await disconnect()
    }
}