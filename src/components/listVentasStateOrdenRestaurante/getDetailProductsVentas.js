import axios from 'axios';
import React, { useState, useEffect } from 'react';
import VentasRoutes from "../../routes/Ventas"
import './getDetailProductsVentas.css';

const GetDetailProductsVentas=({listProducts})=> {

    const [listVentas, setListVentas] = useState({});
    const [cantidadProducts, setCantidadProducts] = useState(0);

    useEffect(async()=>{
        // const data =  await VentasRoutes.listarProdcutosVentas(id_venta);

        // console.log(data.resp)
        // if(data.resp.status==="ok"){
        //     console.log('ongreso')
        //     console.log(data.resp)
        //     setListVentas(data.resp.result);
        //     await setCantidadProducts(data.resp.totalResultsProducts);
        //     // console.log(data);
        // }
        setListVentas(listProducts);
        await setCantidadProducts(listProducts.length);
    },[])

    return(
        <div className='content-list-products'>
          <div>Detalle: </div>
          <div>
              <ol>
                  {
                      listVentas?.products?.length>0?
                        listVentas.products.map((item,index)=>{
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
    );

}

export default GetDetailProductsVentas;