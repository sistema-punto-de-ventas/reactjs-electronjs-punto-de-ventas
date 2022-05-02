import React,{useEffect, useState} from "react";
import './listStateOrdenRestaurante.css';
import VentasRoutes from '../../routes/Ventas';



export default function  ListStateOrdenRestaurante() {
    
    const [listVentas, setListVentas] = useState([]);
    const [cantidad, setCantidad] = useState(0);
    useEffect(async() =>{

       var listV = await VentasRoutes.listStateOrdenRestaurante("espera-proceso");
       console.log(listV);
       if(listV.resp.status==='ok' && listV.resp.result.length>0){
           setListVentas(listV.resp?.result)
            setCantidad(listV.resp?.tolalResults)
       }
    },[])

    const options=async({e, data})=>{
        e.preventDefault();
        console.log(e.target.value, data);

        var resulUpdate =await  VentasRoutes.UpdateStateOrdenRestaurante(data._id, data.idNegocio, e.target.value);
        console.log(resulUpdate);
        var newList =[];
        await listVentas.forEach((item,index)=>{
            if(item._id===data._id){
                listVentas[index].stateOrdenRestaurante=e.target.value;
            }
           
        })
        setListVentas([...newList]);
        var newList2 =await listVentas.filter((item)=>{
            if(item.stateOrdenRestaurante==="espera"){
                return item;
            }
            if(item.stateOrdenRestaurante==="proceso"){
                return item;
            }
        })
        await setListVentas([...newList2]);
        await setCantidad(newList2.length);

    }

    const listProductsVentas= async(idVenta)=>{
    
        // const ListProducts =await VentasRoutes.listarProdcutosVentas(idVenta)
        // console.log(ListProducts)
    
        return (
            <div>
                <h1>{idVenta}</h1>
            </div>
        )
    }

    return (
        <div className="content-ventas">
            <div className="cantidad">
                <h3>Cantidad de ventas tickets: {cantidad}</h3>
            </div>
            <div className={`content-cards `}>
                {
                    listVentas.map((data,key)=>{
                        return <duv className={`card-ventas ${data?.stateOrdenRestaurante}`}>
                        <div className="card-header">
                            <h5>Número de tickets </h5>
                            <h4>{data.venta}</h4>
                        </div>
                        <div className="card-state-venta">
                            <div>
                                {data.stateOrdenRestaurante}
                            </div>
                            <div className="content-select">
                                <select onChange={(e)=>options({"e":e,"data":data})} className="styled-select">
                                    <option defaultValue={data.stateOrdenRestaurante}>{data.stateOrdenRestaurante}</option>
                                    <option value="espera" >En espera</option>
                                    <option value="proceso">En proceso</option>
                                    <option value="enviado">Enviado</option>
                                </select>
                            </div>
                        </div>
                        <div className="card-options">
                           
                            <div className='content-list-products'>
                                <div>Detalle:</div>
                                <div>
                                    <ol>
                                        {
                                            data?.products?.length>0?
                                                data.products.map((item,index)=>{
                                                    return(
                                                        <li key={index}>
                                                            {item.nameProduct}
                                                        </li>
                                                    );
                                                })
                                                :''
                                        }
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </duv>
                    })
                }
            </div>
        </div>
    )
}

