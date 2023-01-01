import React,{useState, useEffect}  from 'react';
import CategoriaProductosRoute from '../../routes/CategoriaProductos';
import {motion} from 'framer-motion';
import './searchProducts.css'

const  SearcProdcutsForClass=(props)=>{

    const [input, setInput] = useState('');
    const [order, setOrder] = useState('');
    const [listPcategorias, setListPcategorias] = useState([]);
    const [selecPCategoria, setSelecPCategoria] = useState('')
    const [numberPagina, setNumberPagina] = useState(1);

    const [selectPrecio, setSelectPrecio] = useState('');
    const [selectCantidad, setSeletCantidad] = useState('');
    const [selectCategoriaStyle, setSelectCategoriastyle] = useState('');
    const [orderCategory, setOrderCategory] = useState('');
    const [selectCodigoP, setSelectCodigoP] = useState('');

    const [pagination, setPagination] = useState([1,2,3,4,5,6,7,8,9,10]);

    const handleInput=({target})=>{

        setInput(target.value);
    }

    useEffect(async()=>{
        handleGetSearch();
    },[input, order, selecPCategoria, numberPagina, orderCategory])

    useEffect(async()=>{
        var dataResult = await CategoriaProductosRoute.getListPCategoras();
        console.log("%c ---lista de categorias---","color:red")
        console.log(dataResult);
        if(!dataResult.err){
            setListPcategorias(dataResult.resp.result);
        }
        else{
            console.log("%c error en la petidion de categorias","color:red");
        }
    },[])

    const handleSelectPrecio=({target})=>{
        if(!selecPCategoria){
            setOrder(target.value);
        }
        if(selecPCategoria){
            setOrderCategory(target.value);
        }
        
        setSelectPrecio('active-precio');
        setSeletCantidad('')
        setSelectCodigoP('');
        // setSelectCategoriastyle('');
    }
    const handleSelectCantidad=({target})=>{
        if(!selecPCategoria){
            setOrder(target.value);
        }
        if(selecPCategoria){
            setOrderCategory(target.value);
        }
        
        setSeletCantidad('active-cantidad')
        setSelectPrecio('');
        setSelectCodigoP('');
        // setSelectCategoriastyle('');
    }

    const handleSelectPCategoria=({target})=>{
        console.log("%c ok optcion selected :"+target.value,"color:green");
        setOrder('categoriaOnlyName');
        setSelecPCategoria(target.value);

        setSelectCategoriastyle('active-categoria');
        setSelectPrecio('');
        setSeletCantidad('');
        setSelectCodigoP('');
        setNumberPagina(1);
        if(target.value===''){
            setSelecPCategoria('');
            setOrder('');
        }

    }


    async function handleGetSearch(){
        console.log('realizando peticion de ', input);
        const data = await CategoriaProductosRoute.searchProductos(input, order, selecPCategoria, numberPagina, orderCategory );
        console.log(data?.err);
        if(data?.resp?.status==='ok'){
            var listProduct = await getSearProducts(data?.resp?.result);
            console.log(listProduct);
            props.update(listProduct);
            // setListProduct(listProduct);

        }
    }
    
   const inputDefault =()=>{
       console.log("%c input default","color:red");
       
       if(order!="codigoProducto")setOrder('');
       setSelecPCategoria('');
       setSelectCategoriastyle('');
       setSeletCantidad('');
       setSelectPrecio('')
       setPagination([1,2,3,4,5,6,7,8,9,10]);
       setNumberPagina(1);
   }

 
   const numberPagination=(e)=>{
       e.preventDefault();
       var itemChild=parseInt(e.target.innerText);

       console.log(e.target.innerText);
       setNumberPagina(e.target.innerText);
       console.log(document.querySelector('.pagination'));
    

   }

   const morePagination=async(e)=>{
       console.log("ddddd");
       var number =await  pagination.map(nun=>{
           return nun+10;
       })
       setPagination(number); 
   }

   const handleBtnCodigoP=async()=>{
        setSelectCodigoP(selectCodigoP==='active-codigo'?'':'active-codigo');
        await setOrder(order==='codigoProducto'?'':'codigoProducto');
        console.log('%c codigo p','color:green',order);

        setSelecPCategoria('');
        setSelectCategoriastyle('');
        setSeletCantidad('');
        setSelectPrecio('')
    }
   const lestPagination=async(e)=>{
        console.log("mmmmm");
        if(pagination[0]>1){
            var number =await  pagination.map(nun=>{
                return nun-10;
            })
            setPagination(number); 
        }
    }

    return(
        <>
            <div className='content-serch-component'>
                <div className='search-component'>
                    <div className='content-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='svg' fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className='input-content'>
                        <input onChange={handleInput} onFocus={inputDefault} name='input' value={input} type='text' placeholder='Buscar producto'/>
                    </div>
                    <motion.div whileTap={{scale:0.9}} className='content-btn-search'>
                        <button onClick={handleGetSearch} className='btn-search'>Buscar</button>
                    </motion.div>
                </div>
                <div className={`conten-select-codigo-producto`}>
                    <motion.div onClick={handleBtnCodigoP} whileHover={{scale:1.03}} whileTap={{scale:1}} className={`btn-codigo-producto ${selectCodigoP}`}>
                        Por codigo  
                    </motion.div>
                </div>
                <div className={`content-select-products ${selectPrecio} btn-border-circle`}>
                    <div className='btn-select'> 
                    por precio : 
                    <select onClick={handleSelectPrecio} className='select-option-propduct'>
                        <option  value="">Ninguno</option>
                        <option  value="desc">Descendente</option>
                        <option  value="asc">Ascendente</option>
                    </select>    
                    </div>
                    
                </div>
                <div className={`content-select-products ${selectCantidad} btn-border-circle`}>
                    <div className='btn-select'>
                    por cantidad : 
                    <select onClick={handleSelectCantidad} className='select-option-propduct'>
                        <option value="">Ninguno</option>
                        <option value="cantidadDesc">Descendente</option>
                        <option value="cantidadAsc">Ascendente</option>

                    </select>    
                    </div>
                    
                </div>
                <div className={`content-select-products ${selectCategoriaStyle} btn-border-circle`}>
                    <div className='btn-select'>
                    por categoria : 
                    <select onClick={handleSelectPCategoria} id='select-categoria' className={`select-option-propduct`}>
                        <option value="">Ninguno</option>
                        {
                            listPcategorias?
                            listPcategorias.map((data)=>{
                                return(
                                    <option key={data.id} value={data?.nombre}>{data?.nombre}</option>
                                )
                            })
                            :
                            <option value="">No hay categorias para mostrar</option>
                        }
                    </select>    
                    </div>
                    
                </div>
                <div className='paginanacion-content'>
                    <div className='pagination'>
                        <svg onClick={lestPagination} xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" style={{width:'20px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        {
                            pagination.map((data)=>{
                                return(
                                    <a onClick={numberPagination} href='link' key={data}  className="pagination-item" style={ numberPagina==data?{background:'rgb(22, 214, 166)'}:{}} >
                                        {data}
                                    </a>
                                )
                            })
                        }
                        <svg onClick={morePagination} xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" style={{width:'20px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </>
    );
}



const getSearProducts = async (arr)=>{

    var listProducts = [];
    if (arr) {
        listProducts = await arr.map((data) => {
            return {
                    id: data._id,
                    nombre: data.nameProduct,
                    codigoProducto: data.codigoProducto,
                    ingredientes: data.description,
                    quantity: data.unidadesDisponibles,
                    codigoProducto: data.codigoProducto?data.codigoProducto:'',
                    // img: Url.urlBackEnd + data.urlImages[0]?.img,
                    img: data.urlImages[0]?.img,
                    precioUnitario: data.precioUnitario,
                    precio: data.precioCosto,
                    idUser: data.idUser,
                    category: data.category,
                    subcategory: data.subcategory,
            }
        })


        return listProducts
    }




}

export default SearcProdcutsForClass;