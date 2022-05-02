# Back-end Test Shippify 

Developed by Thales Cezar Castro using Node.js and Express

## Requirements
- Node.js 16+ LTS
- NPM
- Yarn

## How to run
1. In the terminal, go to the desired directory using the command `cd`
2. Clone this repository
```bash
git clone https://github.com/cineasthales/backend-test-shippify
```
3. Install the dependencies
```bash
yarn i
```
4. Run the server
```bash
yarn run dev
```

## Route
POST /routes
### Params
- maximum_distance: required integer greater than 0 to determine how far each route can go.
- consider_traffic: required boolen to determine if the traffic has to be considered in the calculations.
### Return
An array containing all the generated routes.