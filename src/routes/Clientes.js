import axios from 'axios';

class CLienteRoutes{
    static async list (){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/cliente/list/'+token.user.idNegocio,{
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error);
             return {error:true, err:error?.response?.data}
        }
    }
    static async create (data){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.post('/cliente/create/'+token.user.id+'/'+token.user.idNegocio,data,{
                headers: {
                    'authorization': token.t
                }
            });       
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error);
             return {error:true, err:error?.response?.data}
        }
    }
    static async update (data,idCliente){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.put('/cliente/update/'+idCliente,data,{
                headers: {
                    'authorization': token.t
                }
            });            
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error);
             return {error:true, err:error?.response?.data}
        }
    }
    static async buscarCliente (data){
        // console.log('post clients:.....');
        // console.table(data)
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        let buscador = {
            buscador:data
        }

        // console.table(buscador)
        try {
            const resp = await axios.post('/cliente/buscar',buscador,{
                headers: {
                    'authorization': token.t
                }
            });            
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error);
             return {error:true, err:error?.response?.data}
        }
    }
}

export default CLienteRoutes;