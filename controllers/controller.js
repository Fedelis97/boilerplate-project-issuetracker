const { adaptIssue, adaptFilters } = require("../adapters/adapter");
const { ObjectId } = require("mongodb");

class MyController {

    constructor(db) {
        this.db = db; // Store db instance
        this.collection = db.collection('issues');
    }



    addIssues = async function (project, issue) {
        try {
            const adaptedIssue = adaptIssue(issue)
            const result = await this.collection.insertOne({
                project,
                ...adaptedIssue
            })

            return { _id: result.insertedId, ...adaptedIssue }

        } catch (e) {
            console.error(e)
            throw new Error(e)
        }

    }
 
    getIssues = async function (projects, filters) {

        let projectFilter = [];
        if (projects) {
            projectFilter = Array.isArray(projects) ? projects : [projects];
        }
        try {
            const result = await this.collection.
                find({ 'project': { $in: projectFilter }, ...adaptFilters(filters) }
                ).toArray()
            return result
        } catch (e) {
            console.log(e)
            throw new Error(e)
        }
    }

    modifyIssue = async function (project, id, body) {
        try {
            const res = await this.collection.findOneAndUpdate(
                { _id: new ObjectId(id), project },
                { $set: { ...body, updated_on: new Date() } },
                { returnDocument: 'after' } // Returns the updated document
            );
            if(!res){
                return  { error: 'could not update', '_id': id }
            }
            return { result: 'successfully updated', '_id': id }
        } catch (e) {
            console.log('error',e)
            throw new Error(e)
        }
    }

    deleteIssue = async function (project, id) {
        try {
            const res = await this.collection.findOneAndDelete(
                { _id: new ObjectId(id), project }
            );

            if(!res){
                return { error: 'could not delete', '_id': id }
            }
            return { result: 'successfully deleted', '_id': id }
        } catch (e) {
            console.log('error',e)
            throw new Error(e)
        }
    }

}

module.exports = MyController;
