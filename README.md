# ClientAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.6.

## Development server

Run `ng start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## PB back-end

lors d'une modification de patient, les visites sont suprimées (L.201-203)

lors de la création d'un patient, une visite est crée(L.201-203) et sans intervenant qui plus est

CORS defini dans le serverCabinetMedical.ts

Le parametre correspondant à la date de naissance dans la requette sur /addPatient n'est pas `patientBirthday ` mais `naissance` (
et la requete ne retourne rien, on aurai attendu le nouvelle element enregistré)

Dans le post sur affectation  j'ai rajouter un test sur l'existance du patient, car sinon en cas de patient non trouvé, le serveur ne répond plus

J'ai changé le scode d'erreur retourné pour qu'il cole à la documentation et soit plus logique (400 "bad request" au lieu de 500 'server internal error")

/affectation infirmier sans valeurs => status 200 ???

il y a des remise à zero des visite de cabinet.WML intepestive