import axios from 'axios';

/* async function header(){
    const token = await JSON.parse(localStorage.getItem('tokTC'));
    return {
        headers: {
            'authorization': token.t
        }
    }
} */

class LoginRutes{
    
    //registrar usuarios
    static async singUp(data){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.post('/user/signup/'+token.user.idNegocio, data,{
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
    //login de usuarios
    static async sigIn(data){
        try {
            const resp = await axios.post('/user/signin',data);            
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error);
            return {error:true, err:error?.response?.data}
        }
    }
    //lista de usuarios
    static async listUsers(){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/user/list/state=all/'+token.user.idNegocio,{
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return{error:true}
        }
    }
    //actulizar usuarios
    static async updateUser(data,idUser){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.put('/user/updateUser/'+idUser, data,{
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
    //lista de roles del usuario
    static async userListRole(idUser){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/user/roleList/'+idUser,{
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return{error:true}
        }
    }
    //add role al usario
    static async addRoleUser(data,idUser){
        //const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.put('/user/add/newrole/'+idUser, data);
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data}
        }
    } 
    //eliminar el rol de un usuario
    static async removeRole(data){
        //const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.put('user/remove/role', data);
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data}
        }
    }
    //actualizar el estado de un usuario
    static async updateStateUser(idUser){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.patch('user/update/state/'+idUser,{
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

    //sacar user con role de caja que estan activos y administradores
    static async getUserCajaActivo(){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/user/getlistUserActivos/'+token.user.idNegocio,{
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
    // muestra los datos del negocio y el rol del usuario
    static async getDataNegocioUser(){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/user/getDataNegocioUser/'+token.user.id+'/'+token.user.idNegocio,{
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
    // verificamos si existe usuario registrados
    static async userLength(){
        //const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get('/user/verifyUserLength');
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
            return {error:true, err:error?.response?.data}
        } 
    }
}


export default LoginRutes;