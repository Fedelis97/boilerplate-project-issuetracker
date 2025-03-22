const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../server');
const assert = chai.assert;
const server = require('../server');
const MyController = require('../controllers/controller');
const { connectDB, closeDB } = require('./setup');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  let myDB
  let controller

  before(async function () {
    myDB = await connectDB();

    controller = new MyController(myDB)
  })

  after(async function () {
    await closeDB();
  })

  beforeEach(async function () {
    await myDB.collection("issues").deleteMany({})
  })

  test('Create an issue with every field: POST request to /api/issues/{project}', function () {
    chai.request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Bug in login',
        issue_text: 'Login button not working',
        created_by: 'tester',
        assigned_to: 'developer1',
        status_text: 'In Progress'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
      });

  });


  test('Create an issue with only required fields: POST request to /api/issues/{project}', function () {
    chai.request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Bug in login',
        issue_text: 'Login button not working',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function () {
    chai.request(server)
      .post('/api/issues/apitest')
      .send({
        created_by: 'tester',
        assigned_to: 'developer1',
        status_text: 'In Progress'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });

  test(' View issues on a project: GET request to /api/issues/{project}', function () {
    chai.request(server)
      .get('/api/issues/apitest')
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });

  test('View issues on a project with one filter: GET request to /api/issues/{project}', function () {
    chai.request(server)
      .get('/api/issues/apitest?open=true')
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function () {
    chai.request(server)
      .get('/api/issues/apitest?open=true&assigned_to=Joe')
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}', function () {
    chai.request(server)
      .put('/api/issues/apitest')
      .send({
        _id:'5871dda29faedc3491ff93bb',
        issue_title: 'Bug in login',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });


  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function () {
    chai.request(server)
      .put('/api/issues/apitest')
      .send({
        _id:'5871dda29faedc3491ff93bb',
        issue_title: 'Bug in login',
        assigned_to: 'developer1',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function () {
    chai.request(server)
      .put('/api/issues/apitest')
      .send({
        issue_title: 'Bug in login',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function () {
    chai.request(server)
      .put('/api/issues/apitest')
      .send({
        _id:'5871dda29faedc3491ff93bb',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function () {
    chai.request(server)
      .put('/api/issues/apitest')
      .send({
        _id:2,
        issue_title: 'Bug in login',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });

    // Delete an issue: DELETE request to /api/issues/{project}
  // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  // Delete an issue with missing _id: DELETE request to /api/issues/{project}

  test('Delete an issue: DELETE request to /api/issues/{project}', function () {
    chai.request(server)
      .delete('/api/issues/apitest')
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });


  test(' Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function () {
    chai.request(server)
      .delete('/api/issues/1')
      .end((err, res) => {
        assert.equal(res.status, 200);
      });
  });

  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function () {
    chai.request(server)
      .delete('/api/issues')
      .end((err, res) => {
        assert.equal(res.status, 404);
      });
  });
});
