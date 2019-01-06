# Projet “Cabinet médical 2018”  

Etudiants :  
- Maxence Morand
- Thiam Cheikh  

Promotion: L3 MIAGE  
Rendu le 07/01/2019


## Spécificités du serveur

##### Comportement notable du serveur:  
- Lors de la modification d'un patient, les visites sont suprimées  
- Lors de la création d'un patient, une visite est crée avec une date et sans intervenant  
- Le paramètre correspondant à la date de naissance dans la requette sur /addPatient n'est pas `patientBirthday` 
(comme dit dans l'enoncé du projet) mais `naissance`  
- (/affectation infirmier sans valeurs => status 200) ???  

##### Modification apportées au serveur: 
- CORS defini dans le serverCabinetMedical.ts (~L.80) (nous avons quand même suivi l'énoncé du projet pour que le client soit compatible) :      
`res.header("Access-Control-Allow-Origin", "*");`  
`res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");`     
`res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');`  
- Ajoute d'un test sur l'existance du patient dans le post sur /affectation, sinon en cas de patient non trouvé, le serveur ne répond plus
- Les codes d'erreurs retournés mis à 400 (Bad request) au lieu de 500 (server internal error) pour qu'ils correspondent
 à l'énoncé du projet  et à la sémantique  

## Lancer le projet 
1. Lancer `npm start` dans le répertoire du serveur contenant le fichier `package.json`  
2. Lancer `npm start` dans le répertoire du client contenant le fichier `package.json`  
3. Aller à [http://localhost:4200/](`http://localhost:4200/`). L'application se recharger automatiquement lors d'un changement sur un fichier source.

##Routes  
Ce projet utilise les modules de `@angular/router` pour permettre à l'application de facilement naviguer
 entre les pages, passer des paramettres et rediriger si l'url n'est pas conforme.  
Les différentes url sont:  
- ``/`` => page d'accueil  
- ``/patient/[id]`` => page d'un patient defini par son `id` qui est son numero de Sécurité social  
- ``/infirmier/[id]`` => page d'un infirmier defini par son `id`  

Ces pages sont accessible depuis les liens présent dans l'application mais aussi entre les requêtants directement.  

##Structure du projet  
Le code source du projet se trouve dans le répertoire "app" et est organisé comme suit:  
- **dataInterfaces**: les structures de données
- **entry**: composant nécessaire au routage de l'application
- **Services**: communication avec le serveur et entre les composants
- **page_accueil**
- **page_infirmier**
- **page_patient**
- **secretary**: page vide
 
## Services  
- **actes**: récupère et analyse le document actes.xml du serveur
- **affectation**: gère les envoie d'affectation et de désaffectation au serveur
- **cabinet-medical**: récupère et analyse le document cabinetInfirmier.xml du serveur, 
communique avec ``POST /addPatient`` du serveur.
- **constant**: stockage de variable disponible dans tous les composant l'injectant
- **tile**: permet l'affichage des tuiles informative pour que l'utilisateur ai un retour sur ces actions, 
c'est un service partagé pour qu'une tuile puisse être définie dans un composant mais affiché dans un autre (en cas de mauvaise id dans l'url)

##IHM
Les interfaces ont été pensée pour avoir une grande évolutivité 
Pour la conception de base on s'était mis d'accord sur ce genre de structure [lien google doc](https://docs.google.com/drawings/d/1D5nnKtJJrQMSyySQKvz3dx0tXMwvMQ7mN4zCP0VgEOo/edit?usp=sharing)