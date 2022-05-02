import axios from 'axios';

class Lisence{
    //se tiene que mandar el id del cliente para poder verificar si el sistema es full que seria sin que expire la lisencia
    static async getLisence(){
        const data = {
            phone:'85562',
            lisence:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjIzZGQiLCJjbGllbnRlIjoiTWFyaWEgTHVpemEgQXJhbmNpYmlhIiwidGVsZWZvbm8iOiI4NTU2MiIsImluaXQiOiJOb3ZlbWJlciAyOCwgMjAyMSAxMjowMCBBTSIsImVuZCI6Ik5vdmVtYmVyIDI5LCAyMDIxIDEyOjAwIEFNIiwiZXhwaXJhIjoxNjM4MTU4NDQ0LCJ0aW1lTGlmZSI6ODY0MDB9.pIUdwOVVJQKDOHG87aZmlLBfNpkYvmHLLj81qIQIvlE'
        }
        try {
            const resp = await axios.post('/cliente/verify/licence',data);            
            if(resp.data.status === 'ok'){
                return {lisence:true,error:false};
            }
            return {lisence:false,error:false};
        } catch (error) {
            console.error(error);
            return{error:true,message:'No se puedo madar los datos'}
        }
    }
}

export default Lisence;