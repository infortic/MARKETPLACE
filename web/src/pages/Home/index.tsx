import React from 'react'
import logo from '../../assets/logo.svg'
import src from '*.bmp'
import './styles.css'
import {FiLogIn} from 'react-icons/fi'
import {Link} from 'react-router-dom'




const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="E-coleta"/>
                    <main>
                        <h1>Seu marketplace de coletas de resíduos.</h1>
                        <p>Ajudamos pessoas a encontrar pontos de coletas de forma eficiente.</p>
                        <Link to="/create">
                            <span>
                                <FiLogIn />
                            </span>
                            <strong>Cadastre um ponto de coleta</strong>
                        </Link>
                    </main>
                </header>
            </div>
        </div>
    )
}

export default Home;

