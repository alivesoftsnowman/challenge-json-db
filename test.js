const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})


//test new endpoints

tape('put_student', async function (t) {
  const url = `${endpoint}/student/bodyA?age=20&&name=bob`
  jsonist.put(url, {"name":"new name", "age": 18}, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful put check')
    t.end()
  })
})

tape('get_student',async function (t) {
  const url = `${endpoint}/student/bodyA`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful get check')
    t.end()
  })
})
tape('del_student',async function (t) {
  const url = `${endpoint}/student/bodyA/age`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful delete check')
    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})

