'use strict'

const fetch = require("node-fetch");

const crypto = require("crypto");

const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB();

module.exports.getAllPlanets = async (event, _context) => {
  var result ;
  var listPlanetas = new Array();
   await fetch('https://swapi.py4e.com/api/planets')
    .then((response) => {
      return response.json();
    }).then((data) => {
      for(let a of data.results){
        var planeta = {
           "nombre": a.name,
           "periodo_rotacion": a.rotation_period, 
           "periodo_orbital": a.orbital_period,
           "diametro": a.diameter,
           "clima":a.climate,
           "gravedad":a.gravity,
           "terreno":a.terrain,
           "Superficie_del_agua":a.surface_water,
           "poblacion": a.population,
           "residentes": a.residents,
           "peliculas":a.films,
           "feccreacion": a.created,
           "fecmodificacion": a.edited,
           "url": a.url
        };
        listPlanetas.push(planeta);
      }
    }).then(() => {
      result = listPlanetas;
  }).catch(
    err => result = err
  );  
  return result;
};

module.exports.getPlaneta = async (idPlaneta) => {
    let result ;
    let planeta
     await fetch(`https://swapi.py4e.com/api/planets/${idPlaneta}`)
      .then((response) => {
        return response.json();
      }).then((data) => {
    
            planeta = {
             "nombre": data.name,
             "periodo_rotacion": data.rotation_period, 
             "periodo_orbital": data.orbital_period,
             "diametro": data.diameter,
             "clima":data.climate,
             "gravedad":data.gravity,
             "terreno":data.terrain,
             "Superficie_del_agua":data.surface_water,
             "poblacion": data.population,
             "residentes": data.residents,
             "peliculas":data.films,
             "feccreacion": data.created,
             "fecmodificacion": data.edited,
             "url": data.url
          };
      }).then(() => {
        result = planeta;
    }).catch(
      err => result = err
    );  
    return result;
  };

  module.exports.crearPlaneta = async (data) => {
    console.log('CrearPlaneta en Dynamo');

    const idPlaneta = crypto.randomBytes(16).toString("hex");

    let itemPlaneta = {
      idPlaneta: {S: idPlaneta},
      feccreacion: {S: new Date().toISOString()},
      nombre: {S: data.nombre},
      periodoRotacion: {S: data.periodoRotacion},
      periodoOrbital: {S: data.periodoOrbital},
      diametro: {S: data.diametro},
      clima: {S: data.clima},
      gravedad: {S: data.gravedad},
      terreno: {S: data.terreno},
      superficieAgua: {S: data.superficieAgua},
      poblacion: {S: data.poblacion},
      residentes: {SS: data.residentes},
      peliculas: {SS: data.peliculas},
      url: {S: data.url}
    };

    const params = {
        TableName: process.env.PLANET_TABLE,
        Item: itemPlaneta
    };

    return dynamo.putItem(params).promise();
  };

  module.exports.getAllPlanetsDyn = async (event, _context) => {

    const params = {
        TableName: process.env.PLANET_TABLE
    };

    return dynamo.scan(params).promise();
  };

  module.exports.getPlanetaDyn = async (idPlaneta) => {
    const params = {
        TableName: process.env.PLANET_TABLE,
        ProjectionExpression: 'idPlaneta, #N, periodoOrbital, periodoRotacion, poblacion, clima, diametro, superficieAgua, terreno, #U, feccreacion, gravedad, peliculas, residentes',
        ExpressionAttributeNames: {'#N': 'nombre', '#U':'url'},
        KeyConditionExpression: 'idPlaneta  = :id',
        ExpressionAttributeValues: {':id': {S: idPlaneta}}
    };

    return dynamo.query(params).promise();

  };