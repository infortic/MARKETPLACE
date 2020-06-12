import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import './styles.css'
import logo from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import api from '../../services/api'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'

interface Items {
    id: number
    title: string
    url: string
}

interface ufResponse {
    sigla: string
}

interface ufCitys {
    municipio: { nome: string }
}

const CreatePoint = () => {

    const [items, setItems] = useState<Items[]>([])
    const [ufs, setUf] = useState<String[]>([])
    const [selectedUf, setSelectedUf] = useState('0')
    const [actualCityList, setactualCityList] = useState<String[]>([])
    const [selectedCity, setSelectedCity] = useState('0')
    const [positionSelectedFromClick, setPositionSelectedFromClick] = useState<[number, number]>([0, 0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [formData, setFormDate] = useState({
        name: '',
        email: '',
        whatsapp: '',
        rua: '',
        numero: Number
    })
    const history = useHistory();

    function hendleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const selectedUf = event.target.value
        setSelectedUf(selectedUf)
    }

    function hendleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const selectCity = event.target.value
        setSelectedCity(selectCity)
        console.log(selectCity)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setPositionSelectedFromClick(
            [event.latlng.lat, event.latlng.lng]
        )
        setInitialPosition([event.latlng.lat, event.latlng.lng])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target

        setFormDate({ ...formData, [name]: value })

    }

    function handloSelectedItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id)
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id])
        }

        console.log(selectedItems)
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        const { name, email, whatsapp, rua, numero } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = positionSelectedFromClick
        const items = selectedItems

        const data = {
            name,
            email,
            whatsapp,
            latitude,
            logitude: latitude,
            city,
            street: rua,
            uf,
            items
        }

        await api.post('points', data)
        alert('Ponto de Coleta Adicionado')
        history.push('/')
    }


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords

            setInitialPosition([latitude, longitude])

        })
    }, [])

    useEffect(() => {
        api.get('/items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        axios.get<ufResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            setUf(ufInitials)
        })
    }, [])

    useEffect(() => {

        if (selectedUf === '0') {
            return
        }

        axios.get<ufCitys[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos`).then(response => {


            const cityList = response.data.map(city => city.municipio.nome)

            setactualCityList(cityList)

        })



    }, [selectedUf])






    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="E-coleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Início
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do<br />Ponto de Coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input
                                type="text"
                                id="whatsapp"
                                name="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>selecione um endereço no mapa </span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={initialPosition} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={hendleSelectUf}
                            >

                                <option value="0">Selecione um estado</option>

                                {
                                    ufs.map(
                                        uf => (
                                            <option key={String(uf)} value={String(uf)}>{uf}</option>
                                        )
                                    )
                                }

                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={hendleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {
                                    actualCityList.map(
                                        city => (
                                            <option key={String(city)} value={String(city)}>{String(city)}</option>
                                        )
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="street">Rua</label>
                            <input
                                type="text"
                                name="street"
                                id="street"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="number">Numero</label>
                            <input
                                type="number"
                                name="number"
                                id="number"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>selecione os itens de coleta a baixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id}
                                onClick={() => handloSelectedItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.url} alt="teste" />
                                <strong>{item.title}</strong>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint