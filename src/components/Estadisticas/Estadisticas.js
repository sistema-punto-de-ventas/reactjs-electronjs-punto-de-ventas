import React, {useState, useEffect} from "react";
import EstadoFinancieroRoute from "../../routes/EstadoFinanciero";
import Redondear from "../../utils/redondeNumeros/redondeNumeros";
import { motion } from 'framer-motion'

import iconExcel from '../../assets/iconExcel.png'

import './estadisticas.css'

const Estadisticas = () => {

    const [dataCapital, setDataCapital] = useState([]);
    const [stateGetUrl, setStateGeturl] = useState('')
    

    useEffect(async() => {
        const dataRest =await EstadoFinancieroRoute.getCapitalInversion();
        if(dataRest.resp.status ==='ok'){
            console.log(dataRest)
        }

        setDataCapital(dataRest.resp.result);
        console.log(dataRest.resp.result);
        
    } , []);

    const handleClickBntDowload= async ()=>{
        
        const response = await EstadoFinancieroRoute.getDownloadListAllProductsXlsx();
        console.log(response);

        if(response.error==false){
            console.log(response.resp.linkFile)
            setStateGeturl(response.resp.linkFile)
        }
    }

    if(dataCapital.length===0){
        return(<div>Cargando datos...</div>)
    }
    else
    return (
        <>
            <div className="content-reporte">
                
                    <div className="content-estado-capital">
                    <h3>Reporte actual de capital de inversión y productos disponibles</h3>
                    {/* <ul type="tipo">
                        <li>Total cantidad de productos disponibles  : {dataCapital.totalProductosDisponibles} Productos</li>
                        <li>Total item cards registrados : {dataCapital?.totalIntems} Cards</li>
                        <li>Total Capital de inversión : {(dataCapital?.totalInversion)?.toLocaleString("es-BO", {style:"currency", currency:"BOB"})} </li>
                        <li>Total activos de productos disponibles : {(dataCapital.totalMontoProductosDisponibles).toLocaleString("es-BO", {style:"currency", currency:"BOB"})} </li>
                        <li>Total ganancias : {dataCapital.totalGanancias.toLocaleString("es-BO", {style:"currency", currency:"BOB"})} </li>
                        <li>Porcentaje de ganancias del 40% : {dataCapital.porcentaje.toLocaleString("es-BO", {style:"currency", currency:"BOB"})} </li>
                    </ul> */}
                    <table className="table-reporte-actual">
                        <tr><th>Total cantidad de productos disponibles : </th>
                            <td>{dataCapital.totalProductosDisponibles} Productos</td></tr>
                        <tr><th>Total item cards registrados : </th>
                            <td>{dataCapital?.totalIntems} Cards</td> </tr>
                        <tr><th>Total Capital de inversión : </th>
                            <td>{(dataCapital?.totalInversion)?.toLocaleString("es-BO", {style:"currency", currency:"BOB"})}</td></tr>
                        <tr><th>Total activos de productos disponibles : </th>
                            <td>{(dataCapital.totalMontoProductosDisponibles).toLocaleString("es-BO", {style:"currency", currency:"BOB"})}</td> </tr>
                        <tr><th>Total ganancias : </th>
                            <td>{dataCapital.totalGanancias.toLocaleString("es-BO", {style:"currency", currency:"BOB"})}</td> </tr>
                        <tr><th>Porcentaje de ganancias del 40% : </th>
                            <td>{dataCapital.porcentaje.toLocaleString("es-BO", {style:"currency", currency:"BOB"})}</td> </tr>
                    </table>
                </div>
                <div className="conten-btn-download-report">
                    <h5>Descargar toda la lista de productos</h5>
                    <motion.button  whileTap={{scale:0.99}} onClick={handleClickBntDowload} className="btn-download-reporte">Generar reporte</motion.button>
                    {   
                        stateGetUrl!=''?
                        <a href={ stateGetUrl } className="btn-download">
                            <img className="icon-imgExcel" src={iconExcel} />
                            <h6>Descargar</h6>
                        </a>
                        :''
                    }
                </div>
            </div>
        </>
    );
}

export default Estadisticas;