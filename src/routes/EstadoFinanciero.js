import axios from 'axios';

class EstadoFinancieroRoute {    
    static async getEstadoFinanciero(form){        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        //console.log(pv, ' ===-=-======================pv')
        try {
            const resp = await axios.post(
                `/financiero/listProductDetalle/${token.user.idNegocio}`,form, {
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
    static async getVentasEstadoFinanciero (pg){
        const token = await JSON.parse(localStorage.getItem('tokTC'));        
        try {
            const resp = await axios.get(
                `/financiero/listVentasEF/${token.user.idNegocio}/${token.user.id}/${pg.isUser}/pn=${pg.numPagina}/pz=${pg.tamanioPagina}/bs=${pg.buscador}`, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
        }

    }
    static async getGastosEstadoFinanciero (pg){
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get(
                `/financiero/listGastosEF/${token.user.idNegocio}/${token.user.id}/${pg.isUser}/pn=${pg.numPagina}/pz=${pg.tamanioPagina}/bs=${pg.buscador}`, {
                headers: {
                    'authorization': token.t
                }
            });
            return {error:false,resp:resp.data}
        } catch (error) {
            console.error(error)
        }

    }
    static async cierreCaja(data) {        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.put(`/financiero/cierreCaja/${token.user.idNegocio}/${token.user.id}`,data, {
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
    static async updateMOntoInicial(data) {        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.put(`/financiero/updateMontoIncial/${token.user.idNegocio}/${token.user.id}`,data, {
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
    static async listEstadoFinanciero(){        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get(`/financiero/list/${token.user.idNegocio}`, {
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

    static async getCapitalInversion(){        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get(`/financiero/capitalinvrsion/${token.user.idNegocio}`, {
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

    static async getDownloadListAllProductsXlsx(){        
        const token = await JSON.parse(localStorage.getItem('tokTC'));
        try {
            const resp = await axios.get(`reports/list/all/prodcuts/${token.user.idNegocio}`, {
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
}

export default EstadoFinancieroRoute;
