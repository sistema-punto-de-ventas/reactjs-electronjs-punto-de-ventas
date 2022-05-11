import React, {useState, useEffect} from "react";
import EstadoFinancieroRoute from "../../routes/EstadoFinanciero";

const Estadisticas = () => {

    const [dataCapital, setDataCapital] = useState([]);

    useEffect(async() => {
        const dataRest =await EstadoFinancieroRoute.getCapitalInversion();
        if(dataRest.resp.status ==='ok'){
            console.log(dataRest)
        }
        setDataCapital(dataRest.resp.result);
    } , []);

    return (
        <div>
            <div>
                
                <h3>Reporte actual de capital de inversión y productos disponibles</h3>
                    <div className="content-estado-capital">
                    <ul type="tipo">
                        <li>Total cantidad de productos disponibles  : {dataCapital.totalProductosDisponibles} Productos</li>
                        <li>Total item cards registrados : {dataCapital?.totalIntems} Cards</li>
                        <li>Total Capital de inversión Bs.: {dataCapital?.totalInversion} </li>
                        <li>Total activos de productos disponibles Bs.: {dataCapital?.totalMontoProductosDisponibles} </li>
                        <li>Total ganancias Bs.: {dataCapital?.totalGanancias} </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Estadisticas;