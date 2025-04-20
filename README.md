# Exempel-API med Express
Ett skal för ett REST-API som använder NodeJs och Express.
Cors används för att tillåta alla anrop från alla domäner (fungerar ok som expempel, men är inte att rekommendera i en riktig webbplats).

## Installation
Direkt efter att repot klonas behöver kommandot
**npm install** köras.

## Skalet används i Moment 2_1 i Backendkursen i programmet WEBBPROGRAMMERING  
Fungerar somen API server
    
### Databas
Som bas finns en mysql databas för hantering av datat.  
Du behöver en lokal webbserver som kan köra mysql.  
Databasens namn är cv.  
Tabellen som databasen använder skapas via kod i filen install.js  
För att få den att fungera så behöver du justera .envfilen för att skriva in rätt uppgifter för:   
* host
* user
* password
* name (på databasen)   
OBS! Det ät viktigt att den heter cv eftersom det namnet används i koden

#### Databasstruktur
id - int pk auto_increment  
companyname varchar(64) NOT NULL  
jobtitle vachar(64) NOT NULL  
location varchar(64) NOT NULL  
startdate date NOT NULL 
enddate date NULL
description text NULL    
postcreated timestamp NOT NULL

## Ibstallation av DB
För att installera databasen kör:
**node install**

Starta sedan applikationen med: 
**npm run serve**

## Routes
Dessa "endpoints" används:
* GET: 	http://localhost:3000/api/ 						-> Returnerar hälsningsfras
* GET: 	http://localhost:3000/api/workexp				-> Returnera array av arbetslivserfarenhet från anställingar
* GET: 	http://localhost:3000/api/workexp/:id		    -> Returnera post[id] av arbetslivserfarenhet från anställingar
* POST: http://localhost:3000/api/workexp 			    -> Lägg till arbetslivserfarenhet
* PUT: 	http://localhost:3000/api/workexp/:id			-> Uppdatera en arbetslivserfarenhet användare
* DELETE: http://localhost:3000/api/workexp/:id	        -> Radera en aarbetslivserfarenhet
Om någon annan route än ovan anropas ges ett felmeddelande som svar.

## Av
Av Mattias Dahlgren, Mittuniversitetet, mattias.dahlgren@miun.se

### Används och reviderat av
Torbjörn Lundberg, student webbutveckling 120 p på Mittuniversitet, tolu2403@student.miun.se    