import axios from 'axios';

class SalasMesas {
    static async createSala(data){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.post('/salas/create/'+token.user.id+'/'+token.user.idNegocio, data, {
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
    static async listSalas(){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/salas/list/'+token.user.idNegocio, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data }
        }
    }
    /////mesas
    static async createMesa(data,idSala){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.post('/mesas/create/'+idSala, data, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data }
        }
    }
    static async listMesa(idSala){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/mesas/list/'+idSala, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data }
        }
    }
}

export default SalasMesas;