module.exports = class ApiFeatures {
  queryStr;
  query;
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    const queryStrCopy = { ...this.queryStr };
    const excludedFilter = ['sort', 'page', 'limit', 'fields'];
    excludedFilter.forEach((el) => delete queryStrCopy[el]);

    this.query = this.query.find(
      JSON.parse(
        JSON.stringify(queryStrCopy).replaceAll(
          /\b (gt|gte|lt|lte)\b/g,
          (match) => '$' + match
        )
      )
    );

    return this;
  }
  paginate() {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      let sortBy = this.queryStr.sort;
      sortBy = sortBy.split(',').join(' ');
      this.query.sort(sortBy);
    } else this.query = this.query.sort('-createdAt');
    return this;
  }
  limitFields() {
    if (this.queryStr.limit) {
      let limitBy = this.queryStr.limit;
      limitBy = limitBy.split(',').join(' ');
      this.query.select(limitBy);
    } else this.query = this.query.select('-__v');
    return this;
  }
};
