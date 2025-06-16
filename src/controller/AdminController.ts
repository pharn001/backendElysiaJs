import { PrismaClient } from "../../generated/prisma";
import type {AdminInterface} from "../interfece/AdminInterface"
const prisma = new PrismaClient();

export const AdminController = {
    create: async ({ body } : {body:AdminInterface}) =>{
        try {
            const admin = await prisma.admin.create({
                data:body
            })
            return admin;
        } catch (error) {
            return error;
        }
    },
    signin : async ({body,jwt}:{
        body: {
            username: string;
            password: string;
        }
        jwt:any 
    })=>{
        try {
            const checkadmin = await prisma.admin.findFirst({
                where :{
                     username: body.username,
                    password: body.password,
                    satus:"active"
                },
                select: {
                    id:true,
                   name:true,
                }
            })
            if(!checkadmin) {
                return new Response("user not fould",{status:401})
            }

            const token = await jwt.sign(checkadmin)
            console.log(token)
            return {status: true,token}
        } catch (error) {
            return error
        }
    },
    info: async({request, jwt}:{
        request:{
            headers:any
        },
        jwt:any
    })=>{
        try {
            console.log(request.headers.get('Authorization'))
            const token = request.headers.get('Authorization').replace('Bearer ', '');
            const payload = await jwt.verify(token)
            const admin = await prisma.admin.findUnique({
                where:{
                    id: payload.id
                },
                select:{
                    name:true,
                    level:true,
                }
            })
            return admin;
        } catch (error) {
            return error;
            
        }
    }
}