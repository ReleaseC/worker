import {Document} from 'mongoose';


export interface Activity extends Document {
    readonly activityId: String,
    company_id: String,
    project_id: String,
    activityName: String,
    group: String,
    address: String,
    mark: String,
    createdAt: String,
    visits: Array<String>,
}
