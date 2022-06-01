import { getConnection } from "typeorm"

export const ClearTables = async () => {
    try {
        const connection = getConnection()
        const entities = connection.entityMetadatas
        for (const entity of entities) {
            const repository = getConnection().getRepository(entity.name)
            await repository.query(`TRUNCATE TABLE ${entity.tableName} CASCADE`)
        }
        connection.close()
    } catch (error) {
        throw new Error(`Error: Cleaning test database tables : ${error}`)
    }
}