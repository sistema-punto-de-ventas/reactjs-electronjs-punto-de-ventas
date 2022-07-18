// configuracion de maths
const {create, all} = require('mathjs')
const config={};
const math = create(all, config);

class Redondear{
    static async redondearMonto(monto){
        
        try{
            let precioRedondeado = await math.round(monto,2);
            return precioRedondeado;
        }
        catch(error){
            console.log(`error al redondear el monto en la funcion redondearPrecio ${monto}`);
            return monto;
        }
    }

    static  redondearMontoYConvertirAString(monto){
        try{
            // let precioredondeado =  math.format(math.evaluate(monto),{notation:'fixed', precision:2});
            let precioredondeado =  math.round(monto,2);
        
            return precioredondeado;
        }catch(e){
            console.log("Error en redondear un numero");
            return monto;
        }

    }
}

export default Redondear;