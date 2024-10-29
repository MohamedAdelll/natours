module.exports = class ApiFeatures {
  queryParams;
  query;
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }
  filter() {
    const newQueryParam = { ...this.queryParams };

    const excludedFilter = ['sort', 'page', 'limit', 'fields'];
    excludedFilter.forEach((el) => delete newQueryParam[el]);

    const queryStr = JSON.stringify(newQueryParam).replace(
      /\b (gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    const parsedQueryParam = JSON.parse(queryStr);

    this.query = this.query.find(parsedQueryParam);

    return this;
  }
  paginate() {
    const page = +this.queryParams.page || 1;
    const limit = +this.queryParams.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  sort() {
    if (this.queryParams.sort) {
      let sortBy = this.queryParams.sort;
      sortBy = sortBy.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else this.query = this.query.sort('-createdAt');
    return this;
  }
  limitFields() {
    if (this.queryParams.fields) {
      let fields = this.queryParams.fields;
      fields = fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else this.query = this.query.select('-__v');
    return this;
  }
};
