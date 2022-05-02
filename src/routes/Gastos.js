import axios from 'axios';

class GastosRoutes{
    static async listTipoGastos(){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/gastos/listTipoGastos/'+token.user.idNegocio,{
                headers: {
                    'authorization': token.t
                }
            });            
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
             return {error:true, err:error?.response?.data}
        }
    }
    static async createTipoGastos(data){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.post('/gastos/createTipoGastos/'+token.user.idNegocio,data,{
                headers: {
                    'authorization': token.t
                }
            })
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
             return {error:true, err:error?.response?.data}
        }
    }
    static async updateTipoGastos (data, idTipoGasto){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.put('/gastos/updateTipoGastos/'+idTipoGasto,data,{
                headers: {
                    'authorization': token.t
                }
            })
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
             return {error:true, err:error?.response?.data}
        }
    }
    static async listGastosTipo(idTipoGastos){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/gastos/gastosTipos/'+idTipoGastos ,{
                headers: {
                    'authorization': token.t
                }
            });            
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
             return {error:true, err:error?.response?.data}
        }
    }
    /* gastos del usuario */
    static async createGastoUser (data){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.post('/userGastos/createUserGastos/'+token.user.id+'/'+token.user.idNegocio,data,{
                headers: {
                    'authorization': token.t
                }
            });            
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
             return {error:true, err:error?.response?.data}
        }
    }
    static async listGastosUser({fechaInicio,fechaFinal}){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get(`/userGastos/listUserGastos/${token.user.id}/${fechaInicio}/${fechaFinal}`,{
                headers: {
                    'authorization': token.t
                }
            });            
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
             return {error:true, err:error?.response?.data}
        }
    }
    //lista de gastos del negocio por rango
    static async listGastosNegocioRange({fechaInicio,fechaFinal}){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get(`/gastos/listGastosNegocioDia/${token.user.idNegocio}/${fechaInicio}/${fechaFinal}`,{
                headers: {
                    'authorization': token.t
                }
            });            
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
             return {error:true, err:error?.response?.data}
        }
    }
    static async reportedeGastosVentas({fechaInicio,fechaFinal, form = {}}){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.post(`/reportGastosVentas/report1/${token.user.idNegocio}/FechaInicio=${fechaInicio}/FechaFinal=${fechaFinal}`,form,{
                headers: {
                    'authorization': token.t
                }
            });            
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
             return {error:true, err:error?.response?.data}
        }
    }
    static async updateGastosUser(data, idGastoUser){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.put(`/userGastos/updateGastosUser/${idGastoUser}/${token.user.id}`,data,{
                headers: {
                    'authorization': token.t
                }
            })
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
             return {error:true, err:error?.response?.data}
        }
    }
}
export default GastosRoutes;