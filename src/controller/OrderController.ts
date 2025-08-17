import { status } from "elysia";
import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const OrderController = {
    list: async ({ set }: { set: any }) => {
        try {
           const order = await prisma.order.findMany({
                orderBy:{createAt:'desc'},
                select: {                    
                    orderDetail: {
                        select: {
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
                    status:true,
                }
            })
            return order
        } catch (error) {
            set.status=500;
            return error;
        }
    }
}