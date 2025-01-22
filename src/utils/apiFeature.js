



export class ApiFeature {
    constructor(mongooseQuery, searchQuery) {
        this.mongooseQuery = mongooseQuery;
        this.searchQuery = searchQuery;
    }

    pagination(model) {

        let pageNumber = parseInt(this.searchQuery.page * 1) || 1

        if (this.searchQuery.page < 1) pageNumber = 1

        let total = model.countDocuments();

        const limit = parseInt(this.searchQuery.limit) || 3


        let numberOfPages = Math.ceil(total / limit)
        if (pageNumber > numberOfPages) pageNumber = numberOfPages


        let skip = (pageNumber - 1) * limit
        let nextPage = pageNumber + 1

        this.mongooseQuery.skip(skip).limit(limit)
        this.total = total
        this.pageNumber = pageNumber
        this.limit = limit
        this.nextPage = nextPage

        return this
    }

    filter() {
        //deep copy from req.body using "structuredClone"
        let filterObj = structuredClone(this.searchQuery)
        // stringfy it to use string method replace to add $ to the search parameters
        filterObj = JSON.stringify(filterObj)
        // use string method replace to add $ to the search parameters
        filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, (value) => `$${value}`)
        // parse it again to use it in the search
        filterObj = JSON.parse(filterObj)

        let excludeFields = ['page', 'sort', 'fields', 'search', 'limit']
        excludeFields.forEach(val => delete filterObj[val])

        this.mongooseQuery.find(filterObj)
        return this
    }

    sort() {
        if (this.searchQuery.sort) {
            const sortedBy = this.searchQuery.sort.split(',').join(' ')
            this.mongooseQuery.sort(sortedBy)
        }
        return this
    }

    fields() {
        if (this.searchQuery.fields) {
            const selectedFields = this.searchQuery.fields.split(',').join(' ')
            this.mongooseQuery.select(selectedFields)
        }
        return this
    }

    search() {
        if (this.searchQuery.search) {
            this.mongooseQuery.find(
                {
                    $or: [
                        { title: { $regex: this.searchQuery.search, $options: 'i' } },
                        { name: { $regex: this.searchQuery.search, $options: 'i' } },
                        { description: { $regex: this.searchQuery.search, $options: 'i' } },
                    ]

                }
            )
        }
        return this
    }

}

