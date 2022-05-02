import axios from 'axios'; 

class GaleriaRoutes {
    static async create(data){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.post('/galery/create/'+token.user.idNegocio+'/'+token.user.id,data,{
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
    static async list(){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/galery/listAll/'+token.user.idNegocio,{
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
    static async update(data,idGalery){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.put('/galery/update/'+idGalery,data,{
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
    static async deleteIMG(idGalery){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.delete('/galery/delete/'+idGalery,{
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

export default GaleriaRoutes;