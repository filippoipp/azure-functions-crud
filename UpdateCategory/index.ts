import { Context, HttpRequest } from "@azure/functions"
import { disconnect, startConnection } from "../infra/database";
import Category from "../shared/entities/category";
import handleError from "../shared/error/error";

export default async function (context: Context, req: HttpRequest) {
    try {
        await startConnection();

        const categoryId = req.params.id;
        const updatedCategory = req.body;

        if (!categoryId || !updatedCategory.name) {
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

        category.name = updatedCategory.name;
        await category.save()
    
        context.res = {
            status: 200,
            body: category
        };         
    } catch (error) {
        context.log("Update category failure.");
        return handleError(500, error, context);
    } finally {
        await disconnect();
    }
}