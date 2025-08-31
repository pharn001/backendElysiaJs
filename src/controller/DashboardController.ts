import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const DashboardController = {
    list: async ({ set }: { set: { status: number } }) => {
        try {
            //tatal order
            const countOrder = await prisma.order.count();
            const orders = await prisma.order.findMany({
                where:{
                    status:{
                        not:"CANCEL"
                    }
                }
            })
            //total income
            let sumIncome = 0;
            for(let i=0;i<orders.length;i++){
                const orderDetail = await prisma.orderDetail.findMany({
                    where:{
                        orderId:orders[i].id
                    }
                })
                for (let j=0;j<orderDetail.length;j++){
                    const orderDetailItem = orderDetail[j];
                    const price =orderDetailItem.price;
                    const qty = orderDetailItem.qty;
                    const amount = price * qty;
                    sumIncome += amount;

                }
            }
            // tatal member
            const countMember = await prisma.member.count();
            return {
                countOrder: countOrder,
                sumIncome: sumIncome,
                countMember: countMember
            }
        }catch (error) {
            set.status = 500
            return { error: error }
        }
    }

}