import Knex from 'knex'

export async function seed(knex: Knex){
await knex('items').insert([
        {title: 'Lâmpadas', image: 'lampadas.svg'},
        {title: 'Pilhas e Baterias', image: 'baterias.svg'},
        {title: 'Papeis e Papelão', image: 'papeis-papelao.svg'},
        {title: 'Resíduos Eletrônicos', image: 'eletronicos.svg'},
        {title: 'Resídups Orgânicos', image: 'organicos.svg'},
        {title: 'Ólieo de Cozinha', image: 'oleo.svg'},
    ])
}
