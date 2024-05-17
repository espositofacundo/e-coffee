'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export const updateOrderprocess = async (orderId: string, isOkforCook?: boolean) => {
    const session = await auth();
    if (session?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'No permitido'
        };
    }
    try {
        let updateData: any = {};
       
        if (isOkforCook !== undefined) {
            updateData.isOkforCook = isOkforCook;
            if (isOkforCook) {
                // Si isOkforCook es true, establece DisOkforCook en la fecha actual menos tres horas
                const currentDate = new Date();
                currentDate.setHours(currentDate.getHours()); // Restar tres horas
                updateData.DisOkforCook = currentDate;
            }
        }
        
        const order = await prisma.order.update({
            where: {
                id: orderId
            },
            data: updateData
        });

        revalidatePath('/admin/orders');

        return {
            ok: true
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo actualizar la orden'
        };
    }
};