const testController = {
  postEcho: (req, res) => {
    console.log(req.body);
    const a = 1;
    const b = 1;
    return res.status(200).json({ status: 'success', echo: req?.body?.msg });
  },
};

module.exports = testController;
