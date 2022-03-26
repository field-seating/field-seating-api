const testController = {
  postEcho: (req, res) => {
    console.log(req.body)
    return res.status(200).json({ status: 'success', echo: 'req.body' })
  }
}

module.exports = testController