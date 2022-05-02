import axios from 'axios';

class RoutesPrueva{
    static async listUser(){
        try {
            const resp = await axios.get('/listaUsers');            
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
            return {error:true}
        }
    }
    static async postUsers(data){
        try {
            const resp = await axios.post('/usuarios',data)
            return {error:false,resp:resp.data}
        } catch (error) {
            console.log(error);
            return {error:true}
        }
    }
}
export default RoutesPrueva;