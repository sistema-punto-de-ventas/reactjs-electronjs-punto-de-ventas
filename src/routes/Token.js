import axios from 'axios';

class Token{
    //esta funcion verificara el token si esta en local storage 
    //tmb verificara si el token es valido o expiro desde la api
    static async getToken(){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        //tambien tiene que verificar si el token a expirado o no expiro mediante la api
        if(token ){
            try {
                const resp = await axios.get('/api/verifyToken/'+token.user.id, {
                    headers: {
                        'authorization': token.t
                    }
                });
                if(resp.data.state === 'active'){
                    return {token:true,state:true,error:false}
                }
                //aunque el token este bien pero su estado este inactivo entoncen no tine permiso para entrar al sistema
                return {token:true,state:false,error:false}

            } catch (error) {
                return{token:false,error:true}
            }            
        }else{
            return{token:false,error:false}
        }
    }
}

export default Token;