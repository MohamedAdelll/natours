module.exports = class ApiFeatures {
  queryParams;
  query;
  excludedFilter = ['sort', 'page', 'limit', 'fields'];
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }
  filter() {
    const newQueryParam = { ...this.queryParams };
    this.excludedFilter.forEach((el) => delete newQueryParam[el]);

    this.query = this.query.find(
      JSON.parse(
        JSON.stringify(newQueryParam).replaceAll(
          /\b (gt|gte|lt|lte)\b/g,
          (match) => '$' + match
        )
      )
    );

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
    if (this.queryParams.limit) {
      let limitBy = this.queryParams.limit;
      limitBy = limitBy.split(',').join(' ');
      this.query = this.query.select(limitBy);
    } else this.query = this.query.select('-__v');
    return this;
  }
};
