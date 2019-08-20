import '../config/config';
import cities from './collections/cities.json'
import database from './mongoose'


const importCollections = async () => {
    try {
       await database.LocationModel.insertMany(cities)
       process.exit()
    } catch (error) {
        console.warn(error)
        process.exit()
    }
}

importCollections()