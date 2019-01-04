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

