import axios from "axios";
import IpServerF from "../config/config";
import Url from './Url';
// import IpServerF from "../config/config";
class Network{
    static async  getIpServer(){
        
        const ipServer = await axios.get('/api/v0.1/get/ip/server');
        console.log(ipServer.data);
        if(ipServer.data.Status==="ok"){
            // IpServerF(ipServer?.data?.Result[0]?.ipServerFood)
            var ipServerFood = new IpServerF(ipServer?.data?.Result[0]?.ipServerFood);
            Url.urlBackEnd = ipServerFood.getIpServerF();
            console.log(ipServerFood.getIpServerF());
        }
      }
}

export default Network;