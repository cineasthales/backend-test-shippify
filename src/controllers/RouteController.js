import fs from 'fs'

class RouteController {

    static generate = async (request, response) => {

        const { maximum_distance, consider_traffic } = request.body

        if (typeof maximum_distance !== 'number' || maximum_distance < 1) {
            return response.status(400).send({message: 'The field maximum_distance must be a number greater than 0.'})
        }

        if (typeof consider_traffic !== 'boolean') {
            return response.status(400).send({message: 'The field consider_traffic must be a boolean.'})
        }
        
        const file_path = './src/storage/payloadTest.json'

        let lines = await fs.promises.readFile(file_path, (_, data) => { return data })
        lines = Object.values(JSON.parse(lines))

        let routeId = 1
        let routes = []

        while (lines.length) {

            let current_line = lines.shift()
            let steps = [
                {point: current_line.pickup_location, id: current_line.id},
                {point: current_line.delivery_location, id: current_line.id}
            ]
            let route_distance = current_line.distance
            let going_forward = true
            let first_line = current_line

            while (true) {

                if (going_forward) {

                    const options_to_go_next = lines.filter(line => {
                        return current_line.delivery_location[0] == line.pickup_location[0]
                            && current_line.delivery_location[1] == line.pickup_location[1]
                            && (route_distance + line.distance) <= maximum_distance
                    })

                    if (options_to_go_next.length) {

                        current_line = this.#choose_best_option(options_to_go_next, consider_traffic)
                        steps.push(
                            {point: current_line.pickup_location, id: current_line.id},
                            {point: current_line.delivery_location, id: current_line.id}
                        )
                        route_distance += current_line.distance

                        lines = this.#remove_line(lines, current_line)

                    } else {
                        current_line = first_line
                        going_forward = false
                    }

                } else {

                    const options_to_go_back = lines.filter(line => {
                        return line.delivery_location[0] == current_line.pickup_location[0]
                            && line.delivery_location[1] == current_line.pickup_location[1]
                            && (route_distance + line.distance) <= maximum_distance
                    })

                    if (options_to_go_back.length) {

                        current_line = this.#choose_best_option(options_to_go_back, consider_traffic)
                        steps.unshift(
                            {point: current_line.pickup_location, id: current_line.id},
                            {point: current_line.delivery_location, id: current_line.id}
                        )
                        route_distance += current_line.distance

                        lines = this.#remove_line(lines, current_line)

                    } else {
                        break
                    }

                }

            }

            if (steps.length > 2) {
                routes.push({ routeId, steps })
                routeId++
            }

        }

        return response.status(200).send(routes)
    }

    static #choose_best_option(options, consider_traffic) {

        if (options.length == 1) {
            return options[0]
        }
    
        const sorted = options.sort((path_a, path_b) => {
            const path_a_result = consider_traffic ? path_a.distance * path_a.traffic : path_a.distance
            const path_b_result = consider_traffic ? path_b.distance * path_b.traffic : path_b.distance
    
            return path_a_result < path_b_result ? -1 : (path_a_result > path_b_result ? 1 : 0)
        })
    
        return sorted[0]
    }

    static #remove_line(lines, current_line) {

        const index_to_remove = lines.findIndex(line => line.id == current_line.id)
    
        if (index_to_remove > -1) {
            lines.splice(index_to_remove, 1)
        }
    
        return lines
    }
}

export default RouteController