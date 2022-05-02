import axios from 'axios';

class CategoriaProductosRoute{
    static async list (){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/pcategoria/getlist/idNegocio='+token.user.idNegocio,{
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
    static async addCategoria (data){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        
        try {
            const resp = await axios.post(`/pcategoria/add/idNegocio=${token.user.idNegocio}/idUser=${token.user.id}`,data,{
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
    static async updateCategoria (data, idPcategoria){
        const token = await JSON.parse(localStorage.getItem('tokTC'));        
        try {
            const resp = await axios.put(`/pcategoria/update/idPcategoria=${idPcategoria}`,data,{
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
    /* subcategoria */
    static async addSubcategori (data, idPcategoria){
        const token = await JSON.parse(localStorage.getItem('tokTC'));        
        try {
            const resp = await axios.post(`/psubcategoria/add/idPcategoria=${idPcategoria}/idUser=${token.user.id}`,data,{
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
    static async updateSubcategori (data, idPSubCategoria){
        const token = await JSON.parse(localStorage.getItem('tokTC'));        
        try {
            const resp = await axios.put(`/psubcategoria/update/idPsubcategoria=${idPSubCategoria}`,data,{
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
    //list productos segun us categoria del estado financiero
    static async getPorductosCategori (categoria){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/financiero/getPorductosCategori/'+token.user.idNegocio+'/'+categoria,{
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

    static async searchProductos (nameProduct, order='', selecPCategoria='', numberPage=1, orderCategory=''){
        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        nameProduct = !nameProduct?'':nameProduct; 
        try {
            const resp = await axios({
                method: 'POST',
                url:`/products/search/idNegocio=${token?.user?.idNegocio}/nameSearch=${nameProduct}`,
                headers: {
                    'authorization': token.t
                },
                data:{
                    order:order,
                    namePCategoria:selecPCategoria,
                    pagination:numberPage,
                    orderCategory:orderCategory

                }
            });
            console.log(resp.data);
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error);
             return {error:true, err:error?.response?.data}
        }
    }

    static async getListPCategoras(){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/pcategoria/getlist/idNegocio='+token.user.idNegocio,{
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

export default CategoriaProductosRoute;