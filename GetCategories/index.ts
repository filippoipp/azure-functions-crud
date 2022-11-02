import { Context, HttpRequest } from "@azure/functions"
import { disconnect, startConnection } from "../infra/database";
import Category from "../shared/entities/category";
import handleError from "../shared/error/error";

export default async function (context: Context, req: HttpRequest) {
    try {
        await startConnection();

        const categories = await Category.find()

        if (!categories) {
            context.res = {
                status: 404
            };
            context.log.error('Categories not found.', context.invocationId);  
        }
    
        context.res = {
            status: 200,
            body: categories
        };         
    } catch (error) {
        context.log("Get categories failure.");
        return handleError(500, error, context);
    } finally {
        await disconnect();
    }
}