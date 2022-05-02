import axios from 'axios';

class VentasRoutes {
    static async registerVentas (data){
        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.post(`/venta/create/${token.user.idNegocio}/${token.user.id}`, data, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true}
        }
    }
    static async getDatasNegocio (){
        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get(`/negocio/dataNegocio/${token.user.idNegocio}`, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true}
        }
    }
    static async dataCliente (idCliente){
        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get(`/cliente/dataCliente/${idCliente}`, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true}
        }
    }
    static async listVentasDiariosUser (){        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get(`/venta/listVentasUser/${token.user.idNegocio}/${token.user.id}`, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true}
        }
    }
    static async ventasDia ({fechaInicio,fechaFinal}){        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get(`/venta/listVentasRange/${token.user.idNegocio}/${fechaInicio}/${fechaFinal}`, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true}
        }
    }

    // parametros aceptados stateOrdenRestaurante:espera, prceso, enviado, todo
    static async listStateOrdenRestaurante(stateOrdenRestaurante="todo"){
        const token = await JSON.parse(localStorage.getItem('tokTC'));

        try{
            const resp = await axios.get(`/venta/list/states/stateOrdenRestaurante=${stateOrdenRestaurante}`,{
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false, resp:resp.data}
        }catch(error){
            console.error(error)
            return {error:true}
        }
    }

    //cambiar el estado stateOrdenRestaurante de la orden de venta
    static async UpdateStateOrdenRestaurante(idVenta, idNegocio,  stateOrdenRestaurante){
        console.log(idVenta, idNegocio,  stateOrdenRestaurante)

        const token = await JSON.parse(localStorage.getItem('tokTC'));

        try{
            const resp = await axios.post(`/venta/update/stateOrdenRestaurante`,{
                data:{
                    "idVenta":idVenta,
                    "idNegocio":idNegocio,
                    "stateOrdenRestaurante":stateOrdenRestaurante
                },
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false, resp:resp.data}
        }catch(error){
            console.error(error)
            return {error:true}
        }
    }

    static async listarProdcutosVentas(idVenta=''){
        console.log(idVenta)
        const token = await JSON.parse(localStorage.getItem('tokTC'));

        const dataListVentaP = await axios.get(`/venta/list/products/idVenta=${idVenta}`,{
            headers: {
                'authorization': token.t
            }
        });
        console.log(dataListVentaP.data)
        return {error:false, resp:dataListVentaP.data}

    }

    static async getNumeroTicket(){
        const token = await JSON.parse(localStorage.getItem('tokTC'));

        const dataListVentaP = await axios.get(`/venta/numero/ticket/idNegocio=${token?.user?.idNegocio}`,{
            headers: {
                'authorization': token.t
            }
        });
        console.log(dataListVentaP.data)
        return {error:false, resp:dataListVentaP.data}

    }
}

export default VentasRoutes;
