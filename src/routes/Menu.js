import axios from 'axios';

class MenuRoutes {
    static async createMenu(data){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.post(`/products/add/${token.user.idNegocio}/${token.user.id}`, data, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data}
        }
    }
    static async listMenu(){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/products/get/list/'+token.user.idNegocio, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data}
        }
    }
    static async uploadImagen(data,idMenu){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        const newData = new FormData();    
        newData.append('image',data);
        try {
            const resp = await axios.post('/image/product/'+idMenu, newData, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data}
        }
    }
    static async updateData(data,idMenu){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.put('/products/update/'+idMenu, data, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data}
        }
    }

    static async deleteProduct(ipProduct, state){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.delete('/products/delete', {
                data:{
                    ipProduct,
                    state
                },
                headers: {
                    'authorization': token.t
                }
            });
            console.log(resp.data)
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data}
        }
    }
}

export default MenuRoutes;