'use strict';

const metadataManager = require('./metaDataManager');

module.exports.obtPlanetas = (event, context, callback) => {
	console.log('obtPlanetas fue llamado');

		metadataManager
			.getAllPlanets()
			.then(planetas => {
				sendResponse(200, planetas, callback);
			})
			.catch(error => {
        console.log(error);
				sendResponse(500, 'Hubo un error al obtener los planes' , callback);
			});
	}; 

module.exports.obtPlaneta =  (event, context, callback) => {
    console.log('obtPlaneta fue llamado');

    const idPlaneta = event.pathParameters && event.pathParameters.idPlaneta;
    if (idPlaneta !== null) {
      metadataManager
        .getPlaneta(idPlaneta)
        .then(planeta => {
          sendResponse(200, planeta, callback);
        })
        .catch(error => {
          sendResponse(500, 'Hubo un error al obtener el planeta', callback);
        });
    } else {
      sendResponse(400, 'Falta el idPlaneta', callback);
    }
};  

module.exports.crearPlaneta =  (event, context, callback) => {
  console.log('crearPlaneta fue llamado');

    const data = JSON.parse(event.body);

    metadataManager
      .crearPlaneta(data)
      .then(planeta => {
        sendResponse(200, planeta, callback);
      })
      .catch(error => {
        sendResponse(500, error, callback);
      });
};  

module.exports.obtPlanetasDyn = (event, context, callback) => {
	console.log('obtPlanetas fue llamado');

		metadataManager
			.getAllPlanetsDyn()
			.then(planetas => {
				sendResponse(200, planetas, callback);
			})
			.catch(error => {
        console.log(error);
				sendResponse(500, 'Hubo un error al obtener los planes' , callback);
			});
	}; 

  module.exports.obtPlanetaDyn =  (event, context, callback) => {
    console.log('obtPlanetaDyn fue llamado');

    const idPlaneta = event.pathParameters && event.pathParameters.idPlaneta;
    if (idPlaneta !== null) {
      metadataManager
        .getPlanetaDyn(idPlaneta)
        .then(planeta => {
          sendResponse(200, planeta, callback);
        })
        .catch(error => {
          sendResponse(500, 'Hubo un error al obtener el planetadyn', callback);
        });
    } else {
      sendResponse(400, 'Falta el idPlaneta', callback);
    }
};

function sendResponse(statusCode, message, callback) {
  const response =  {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
  callback(null, response);
}
