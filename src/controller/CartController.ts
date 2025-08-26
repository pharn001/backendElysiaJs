import { CartInterface } from "../interfece/CartInterface";
import { PrismaClient } from "../../generated/prisma";

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
    },
    uploadfile: async ({ body }: {
        body: {
            file: File
        }
    }
    ) => {
        try {
            const file = body.file;
            if (!file) return { error: "No file uploaded" };
            const uploadDir = 'public/upload/slip/';
            await Bun.write(uploadDir + file.name, file);

        } catch (error) {
            return error
        }
    },
    order: async ({ body, set, request, jwt }: {
        body: {
            slipName: string
        },
        set: {
            status: number
        },
        request: any, jwt: any
    }) => {
        try {
            
            const token = request.headers.get("Authorization").replace("Bearer ", "")
            const payload = await jwt.verify(token)
            const memberI = payload.id
            const findeCarts = await prisma.cart.findMany({
                where: {
                    memberId: memberI
                }, select: {
                    qty: true,
                    book: true
                }
            })
            const member = await prisma.member.findUnique({
                where: { id: memberI }
            })
            if (!member) {
                set.status = 404;
                return { error: "Member not found" };
            }
            const order = await prisma.order.create({
                data: {
                    createAt: new Date(),
                    trackcode: "",
                    customerName: member.name ?? "",
                    customerPhone: member.phone ?? "",
                    customeraddress: member.address ?? "",
                    memberId: memberI,
                    slipImage: body.slipName
                }
            })
            for (let i = 0; i < findeCarts.length; i++) {
                const cart = findeCarts[i];

                await prisma.orderDetail.create({
                    data: {
                        price: cart.book.price,
                        qty: cart.qty,
                        BookId: cart.book.id,
                        orderId: order.id
                    }
                })
            }
            await prisma.cart.deleteMany({
                where:{memberId:memberI}
            })
            return { message: "success" }
        } catch (error) {
         
            set.status = 500;
            return error
        }
    }
}