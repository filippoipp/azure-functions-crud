import { Context } from "@azure/functions";

export default async function handleError (status: number, message: string, context: Context) {
    context.res = {
      status: status,
      body: message
    };
}