import { useState, useEffect } from 'react'
import LoginRutes from '../../routes/Login';
import iziToast from 'izitoast';
// esto se llama cada ves que se hace un click cuando deveria llamarase solo una ves para todas partes del sistema

//optimizar este hoock se llama muchas veces rendimiento realmente vajo
function useButtonsRole(arrRoles) {// ['caja','admin']
    const [arrButtons, setArrButtons] = useState(false);
    useEffect(() => {
        //console.log(' esto hooks que se llama varias veses')
        let isMounted = true;

        const buttonPermit = async () => {
            const token = await JSON.parse(localStorage.getItem('tokTC'));
            const resp = await LoginRutes.userListRole(token.user.id);
            if (resp.error) {
                //user un hooks o funcion de  de mensajes
                iziToast.show({
                    timeout: 5000,
                    icon: 'bi bi-slash-circle-fill',
                    iconColor: '#D8DBE2',
                    title: 'Error',
                    titleColor: '#D8DBE2',
                    message: 'No se puede mostrar los datos',
                    messageColor: '#D8DBE2',
                    backgroundColor: '#A30000',
                    position: 'topCenter'
                });
                return;
            }
            if (resp.resp.status === 'No fount') {
                iziToast.show({
                    timeout: 5000,
                    icon: 'bi bi-slash-circle-fill',
                    iconColor: '#D8DBE2',
                    title: 'Error',
                    titleColor: '#D8DBE2',
                    message: resp.resp.message,
                    messageColor: '#D8DBE2',
                    backgroundColor: '#A30000',
                    position: 'topCenter'
                });
                return;
            }
            if (resp.resp.status === 'ok') {
                ///[{"_id": "6","name": "user",},{"_id": "63","name": "caja",}]                
                let listRoles = resp.resp.result;
                let isPermit = false;
                for (let i = 0; i < listRoles.length; i++) {
                    for (let j = 0; j < arrRoles.length; j++) {
                        if (arrRoles[j] === listRoles[i].name) {
                            isPermit = true
                        }
                    }
                }
                setArrButtons(isPermit)
            }
        }
        if (isMounted) {
            buttonPermit();
        }

        return () => isMounted = false;
    }, [arrRoles]);
    return [arrButtons];
}

export default useButtonsRole;
