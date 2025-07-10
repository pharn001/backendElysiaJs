import { request } from "http";
import { PrismaClient } from "../../generated/prisma";
import type { AdminInterface } from "../interfece/AdminInterface"
const prisma = new PrismaClient();

const GetAdmintoken = async (request: any, jwt: any) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        throw new Error('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = await jwt.verify(token);
    return payload.id;
}
export const AdminController = {
    create: async ({ body }: { body: AdminInterface }) => {
        try {
            const admin = await prisma.admin.create({
                data: body
            })
            return admin;
        } catch (error) {
            return error;
        }
    },
    signin: async ({ body, jwt }: {
        body: {
            username: string;
            password: string;
        }
        jwt: any
    }) => {
        try {
            const checkadmin = await prisma.admin.findFirst({
                where: {
                    username: body.username,
                    password: body.password,
                    satus: "active"
                },
                select: {
                    id: true,
                    name: true,
                }
            })
            if (!checkadmin) {
                return new Response("user not fould", { status: 401 })
            }

            const token = await jwt.sign(checkadmin)
            console.log(token)
            return { status: true, token }
        } catch (error) {
            return error
        }
    },
    info: async ({ request, jwt }: {
        request: {
            headers: any
        },
        jwt: any
    }) => {
        try {
            const adminid = await GetAdmintoken(request, jwt)
            const admin = await prisma.admin.findUnique({
                where: {
                    id: adminid
                },
                select: {
                    name: true,
                    level: true,
                    username: true
                }
            })
            return admin;
        } catch (error) {
            return error;

        }
    },
    update: async ({ body, jwt, request }:
        {
            body: AdminInterface,
            jwt: any,
            request: any
        }
    ) => {
        try {
            console.log(request.headers.get('Authorization'))
            const adminid = await GetAdmintoken(request, jwt)
            const oldAdmin = await prisma.admin.findUnique({
                where: {
                    id: adminid
                }
            })

            if (!oldAdmin) {
                return new Response("Admin not found", { status: 404 });
            }
            // update the admin
            await prisma.admin.update({
                data: {
                    name: body.name,
                    username: body.username,
                    password: body.password ?? oldAdmin?.password
                }
                , where: {
                    id: adminid
                }
            })
            return { message: "Admin updated successfully" };
        } catch (error) {
            return error;
        }
    },
    list: async () => {
        try {
            const admin = await prisma.admin.findMany({
                select: {
                    id: true,
                    name: true,
                    username: true,
                    level: true
                },
                orderBy: {
                    name: 'asc'
                },where:{
                    satus: "active"
                }
            })
            return admin;
        } catch (error) {
            return error;

        }
    },
    updateData: async ({ body,params }:
        {
            body: AdminInterface,
            params: {
                id:string
            }
        }
    ) => {
        try {
             const admin = await prisma.admin.findUnique({
                where: {
                    id: params.id
                }
             })
            await prisma.admin.update({
                data: {
                    name: body.name,
                    username: body.username,
                    password: body.password ?? admin?.password,
                    level: body.level,
                },
                where: {
                    id: params.id
                }
            })
             
        } catch (error) {
            return error;

        }
    },
    remove:async({params}:{
        params: {
            id:string
        }
    })=>{
        try {
            await prisma.admin.update({
                data: {
                    satus: "inactive"
                },
                where: {
                    id: params.id
                }
            })
            return { message: "Admin deleted successfully" };
        } catch (error) {
            return error;
        }
    }

}