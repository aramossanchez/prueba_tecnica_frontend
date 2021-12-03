import React, { useEffect, useState } from "react";
import axios from 'axios';
import './Orders.scss';

const Orders = () =>{

    //HOOK PARA GUARDAR ORDERS DE BASE DE DATOS
    const [orders, setOrders] = useState([]);
    
    //HOOK PARA GUARDAR ORDERS PAGINADOS
    const [pagina, setPagina] = useState([]);
    
    //HOOK PARA GUARDAR POSICION DE ARRAY DE TODOS LOS ORDERS
    const [posicion, setPosicion] = useState(0);

    useEffect(()=>{
        traerOrders();
    },[])
    
    useEffect(()=>{
        if (orders[0]?.id) {
            paginarOrders(posicion);            
        }
    },[orders])

    //OBTENER TODOS LOS ORDERS
    const traerOrders = async() =>{

        try {

            let res = await axios.get("http://localhost:4000/orders");
            setOrders(res.data);
            
        } catch (error) {
            console.log(error);
        }
    }

    //OBTENER REGISTROS PARA PAGINACION
    const paginarOrders = (posicion) =>{

        let arrayPagina = [];

        for (let i = posicion; i < posicion+10; i++) {
            arrayPagina.push(orders[i]);            
        }

        setPagina(arrayPagina);
        setPosicion(posicion);
    }

    return(
        <div className="contenedor-orders">
            {/* NOMBRES DE LOS CAMPOSº */}
            <div className="nombres-campos">
                <ul>
                    <li>ORDER ID</li>
                    <li>COUNTRY</li>
                    <li>SHIP DATE</li>
                    <li>COMPANY NAME</li>
                    <li>STATUS</li>
                    <li>TYPE</li>
                </ul>
            </div>
            {/* LISTADO DE ORDERS PARA MOSTRAR */}
            {pagina.map((order)=>{
                return(
                    <div key={order.id} className="listado-orders">
                        <input type="text" readOnly value={order.order_id}/>
                        <input type="text" readOnly value={order.country}/>
                        <input type="text" readOnly value={order.ship_date}/>
                        <input type="text" readOnly value={order.company_name}/>
                        <input type="text" readOnly value={order.status}/>
                        <input type="text" readOnly value={order.type}/>
                    </div>
                )
            })}
            <div className="botones-paginacion">
                <div onClick={()=>paginarOrders(0)}>{"<<"}</div>
                <div onClick={()=>paginarOrders(posicion-10)}>{"<"}</div>
                <div onClick={()=>paginarOrders(posicion+10)}>{">"}</div>
                <div onClick={()=>paginarOrders(orders.length - 10)}>{">>"}</div>
            </div>
        </div>
    )
}

export default Orders;