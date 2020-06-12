import knex from '../database/connection'
import {Request, Response} from 'express'

class pointsControllers {
    async  create(request: Request, response: Response){
        //recurso de desestruturação do javaScript
        const {
            name,
            email,
            whatsapp,
            latitude,
            logitude,
            city,
            street,
            uf,
            items
        } = request.body
    
       const trx = await knex.transaction();
    
       const insertedIds = await   trx('points').insert({
            //shot sitaxy
            image: "image-fake",
            name,
            email,
            whatsapp,
            latitude,
            logitude,
            city,
            street,
            uf,
        })
    
        const point_id = insertedIds[0]
    
        const pointsItens = items.map((item_id: number) =>{
          return {
            point_id,
            item_id 
          } 
        })
    
        console.log(pointsItens)
    
       await trx('point_item').insert(pointsItens);
    
        trx.commit()
        return response.json({success: true})
    }

    async show(request: Request, response: Response){
        const {id} = request.params
        const point = await knex('points').where('id', id).first()
        if(!point){
            return response.status(400).json("Point Not Found")
        }

        const items = await knex('items')
        .join('point_item','items.id','=','point_item.item_id')
        .where('point_item.point_id', id).select('title')

       return response.json({point, items})
    }

    async index(request: Request, response: Response){
        const {city, uf, items} = request.query

        const parsedItems = String(items)
        .split(',')
        .map(element => Number(element.trim()))

        const points = await knex('points')
        .join('point_item', 'points.id', '=', 'point_item.point_id')
        .whereIn('point_item.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')

        console.log(city,uf,items)

        response.json(points)
    }
}

export default pointsControllers