import axios from 'axios';

class NegociosRoute {
    static async createUserAdmin(data){        
        try {
            const resp = await axios.post('/user/registerAdmin', data, );
            console.log(resp, 'esto es la respuesta del user add')
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true}
        }
    }
    static async createNegosio(data){        
        try {
            const resp = await axios.post('/negocio/create', data, );
            console.log(resp,' esto es la respuesta de negocio create')
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true}
        }
    }
    static async validateDatasUser(data){        
        try {
            const resp = await axios.post('/user/validateDatasUser', data, );
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true}
        }
    }
    
}

export default NegociosRoute;