import { CartInterface } from "../interfece/CartInterface";
import { PrismaClient } from "../../generated/prisma";
import { status } from "elysia";
import { Param } from "../../generated/prisma/runtime/library";
const prisma = new PrismaClient();

export const CartController = {
    add: async ({ body }: {
        body: CartInterface
    }) => {
        const cart = await prisma.cart.findFirst({
            where: {
                bookId: body.bookId,
                memberId: body.memberId,

            }
        });
        let qty = 1;
        if (cart !== null) {

            await prisma.cart.update({
                where: {
                    id: cart.id
                },
                data: {
                    qty: cart.qty + 1
                }
            })
        } else {
            await prisma.cart.create({
                data: {
                    bookId: body.bookId,
                    memberId: body.memberId,
                    qty: 1
                }
            })
        }

        return cart;
    },
    list: async ({ params }: { params: { memberId: string } }) => {
        try {
            const carts = await prisma.cart.findMany({
                where: {
                    memberId: params.memberId
                },
                select: {
                    id: true,
                    qty: true,
                    book: true,
                }
            })
            return carts;
        } catch (error) {
            return { error: error }

        }
    },
    delete: async ({ params }: {
        params: { id: string }
    }) => {
        try {
            await prisma.cart.delete({
                where: {
                    id: params.id
                }
            })
            return { "message": "success" }
        } catch (err) {
            return { "error": err }
        }
    },
    upQty: async ({ params }: {
        params: {
            id: string
        }
    }) => {
        try {
            const cart = await prisma.cart.findUnique({
                where: {
                    id: params.id
                }
            })
            if (cart) {
                const newqty = cart.qty + 1;
                return await prisma.cart.update({
                    data: {
                        qty: newqty
                    },
                    where: {
                        id: params.id
                    }
                })
            }
        } catch (error) {
            return { "error": error }
        }
    },
    downQty: async ({ params, set }: {
        params: {
            id: string
        }, set: {
            status: number
        }
    }) => {
        try {
            const cart = await prisma.cart.findUnique({
                where: {
                    id: params.id
                }
            })
            if (cart) {
                if (cart.qty - 1 < 1) {
                    set.status = 400;
                    return { "message": "qty <1" }
                }
                const newqty = cart.qty - 1;
                return await prisma.cart.update({
                    data: {
                        qty: newqty
                    },
                    where: {
                        id: params.id
                    }
                })
            }
        } catch (error) {
            set.status = 500;
            return { "error": error }
        }
    },
    cartconfrim: async ({ body, jwt, request, set }: {
        body: {
            name: string,
            address: string,
            phone: string
        }, jwt: any, request: any, set: {
            status: number
        }
    }) => {
        try {
            const token = request.headers.get("Authorization").replace("Bearer ", "");    
           
            const payload = await jwt.verify(token);
            
             // Check if payload exists and has required fields
            if (!payload) {
                set.status = 401;
                return { error: "Invalid token" };
            }
               
            await prisma.member.update({
                data: {
                    name: body.name,
                    address: body.address,
                    phone: body.phone
                }, where: {
                    id: payload.id
                }
            })
            return { message: "successFully!" }
        } catch (error) {
            set.status = 500;
         console.log(error)
            return error;
        }
    }
}