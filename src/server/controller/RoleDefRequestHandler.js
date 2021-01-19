const elasticsearch = require('elasticsearch');

const docIndex = 'roledefs';
// Set up Elastic Search Client
const bonsai_url = process.env.BONSAI_URL;
const client = new elasticsearch.Client({
  host: bonsai_url,
  log: 'trace'
});

function searchRoles(req, res, next) {
  this.client = client;
  this.docIndex = docIndex;
  try {
    {
      const { from, size, query } = req.query;
      this.client
        .search({
          body: query && { query: JSON.parse(query) },
          from,
          size,
          index: this.docIndex
        })
        .then(e => {
          res.json(e);
        })
        .catch(c => {
          console.log(c);
          res.json(c);
        });
    }
  } catch (err) {
    console.log(err);
  }
}

function updateRole(req, res, next) {
  this.client = client;
  this.docIndex = docIndex;
  try {
    {
      this.client
        .update({
          ...req.body,
          index: this.docIndex
        })
        .then(e => {
          res.json(e);
        })
        .catch(c => {
          console.log(c);
          res.json(c);
        });
    }
  } catch (err) {
    console.log(err.message);
  }
}

function deleteRole(req, res, next) {
  this.client = client;
  this.docIndex = docIndex;
  try {
    {
      this.client
        .deleteByQuery({
          body: req.body,
          refresh: true,
          index: this.docIndex
        })
        .then(e => {
          res.json(e);
        })
        .catch(c => {
          console.log(c);
          res.json(c);
        });
    }
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = { searchRoles, deleteRole, updateRole };
