import { status } from "elysia";
import { PrismaClient } from "../../generated/prisma";
import { send } from "process";
const prisma = new PrismaClient();

export const OrderController = {
    list: async ({ set }: { set: any }) => {
        try {
           const order = await prisma.order.findMany({
                orderBy:{createAt:'desc'},
                select: {                    
                    orderDetail: {
                        select: {
                            id:true,
                            price: true,
                            qty: true,
                            Book: {
                                select: {
                                    isdn: true,
                                    name: true
                                }
                            }
                        }
                    },
                    Member:true,
                    createAt:true,
                    id:true,
                    customeraddress:true,
                    customerName:true,
                    customerPhone:true,
                    status:true,slipImage:true,trackcode:true,express:true,remark:true
                }
            })
            return order
        } catch (error) {
            set.status=500;
            return error;
        }
    },
    cancel:async({ set, params }: { set: any, params: { id: string } }) => {
        try {
            const order = await prisma.order.update({
                where: { id: params.id },
                data: { status: 'CANCEL' }
            })
            return order;
        } catch (error) {
            set.status = 500;
            return error;
        }
    },
    paid:async({ set, params }: { set: any, params: { id: string } }) => {
        try {
            const order = await prisma.order.update({
                where: { id: params.id },
                data: { status: 'PAID' }
            })
            return order;
        } catch (error) {
            set.status = 500;
            return error;
        }
    },
    send:async({ set, body }: { set: any, body: { id:string,traceCode:string,express:string,remark:string} }) => {
        try {
            const order = await prisma.order.update({
                where: { id: body.id },
                data: { status: 'SEND', trackcode: body.traceCode, express: body.express, remark: body.remark }
            })
        } catch (error) {
            set.status = 500;
            return error;
        }
    }
}