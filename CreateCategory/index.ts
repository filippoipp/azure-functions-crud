import { Context, HttpRequest } from "@azure/functions"
import { disconnect, startConnection } from "../infra/database";
import Category from "../shared/entities/category";
import handleError from "../shared/error/error";

export default async function (context: Context, req: HttpRequest) {
    try {
        await startConnection();

        const newCategory = req.body;

        if (!newCategory.name) {
            context.log.error('Invalid input.', context.invocationId);
            return context.res = {
                status: 400,
                body: 'Invalid input.'
            };
        }
    
        const category = new Category()
        category.name = newCategory.name
        await category.save();
    
        context.res = {
            status: 201,
            body: category
        };         
    } catch (error) {
        context.log("Creating category failure.");
        return handleError(500, error, context);
    } finally {
        await disconnect()
    }
}