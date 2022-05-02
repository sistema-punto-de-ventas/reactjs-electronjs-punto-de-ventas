import React from 'react'
import './Styles/StyleMenu.css'

const Menu = ({ buttons, functionsMenu, isButtonPosition }) => {
    return (
        <div className='headMenu'>
            {isButtonPosition ?
                <>
                    <div className='button-content-left'>
                        {buttons.map((data, key) => {
                            if (data.possition === 'left') {
                                return (
                                    <button
                                        key={key}
                                        onClick={() => functionsMenu(key)}
                                        className={`buttonMenu ${data.selected}`}
                                    >
                                        {data.button}
                                    </button>
                                );
                            }
                            return (<div key={key}></div>);

                        })}
                    </div>
                    <div className='button-content-rigth'>
                        {buttons.map((data, key) => {
                            if (data.possition === 'rigth') {
                                return (
                                    <button
                                        key={key}
                                        onClick={() => functionsMenu(key)}
                                        className={`buttonMenu ${data.selected}`}
                                    >
                                        {data.button}
                                    </button>
                                );
                            }
                            return (<div key={key}></div>);

                        })}
                    </div>
                </>
                :
                <div className='button-content-left'>
                    {buttons.map((data, key) => {

                        return (
                            <button
                                key={key}
                                onClick={() => functionsMenu(key)}
                                className={`buttonMenu ${data.selected}`}
                            >
                                {data.button}
                            </button>
                        );


                    })}
                </div>
            }


        </div>
    )
};
//export default Menu;
export default Menu;
