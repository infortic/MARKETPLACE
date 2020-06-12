import knex from '../database/connection'
import { Request, Response } from 'express'

class itemsControllers {
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*')
        const serializedItems = items.map(element => {
            return {
                id: element.id,
                title: element.title,
                url: `http://localhost:3333/uploads/${element.image}`
            }
        })
        return response.json(serializedItems)
    }
}

export default itemsControllers