'use strict';


module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      const myController = req.app.locals.myController;
      let project = req.params.project;
      const filters = req.query

      try {
        const result = await myController.getIssues(project, filters)
        res.json(result)
      } catch (e) {
        console.error(e);

        res.status(500).json({ message: 'Internal server error', error: e });
      };

    })

    .post(async function (req, res) {
      const myController = req.app.locals.myController;

      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body

      if (!issue_title || !issue_text || !created_by) return res.json({ error: 'required field(s) missing' });

      try {
        const result = await myController.addIssues(project, {
          issue_text,
          issue_title,
          created_by,
          assigned_to: assigned_to,
          status_text: status_text
        })
        res.json(result)
      } catch (e) {
        console.error(e);

        res.status(500).json({ message: 'Internal server error', error: e });
      };
    })

    .put(async function (req, res) {
      const myController = req.app.locals.myController;

      let project = req.params.project;
      const { _id, ...body } = req.body

      if (!_id) return res.json({ error: 'missing _id' })
      if (Object.keys(body).length === 0) return res.json({ error: 'no update field(s) sent', '_id': _id })

      try {
        const result = await myController.modifyIssue(project, _id, body)
        res.json(result)
      } catch (e) {
        console.error(e);
        res.json({ error: 'could not update', '_id': _id });
      };
    })

    .delete(async function (req, res) {
      const myController = req.app.locals.myController;

      let project = req.params.project;
      const { _id } = req.body

      if (!_id) return res.json({ error: 'missing _id' })

      try {
        const result = await myController.deleteIssue(project, _id,)
        res.json(result)
      } catch (e) {
        console.error(e);
       res.json({ error: 'could not delete', '_id': _id })
      };

    });

};
